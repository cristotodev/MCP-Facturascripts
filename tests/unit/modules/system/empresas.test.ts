import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmpresasResource } from '../../../../src/resources/empresas.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('EmpresasResource', () => {
  let resource: EmpresasResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new EmpresasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts empresas URI', () => {
      expect(resource.matchesUri('facturascripts://empresas')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://empresas')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch empresas with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          administrador: 'Ejemplo',
          apartado: 'Ejemplo',
          cifnif: 'Ejemplo',
          ciudad: 'Ejemplo',
          codpais: 'Ejemplo',
          codpostal: 'Ejemplo',
          direccion: 'Ejemplo',
          excepcioniva: 'Ejemplo',
          email: 'ejemplo@email.com',
          fax: 'Ejemplo',
          fechaalta: '2025-08-12',
          idempresa: 1,
          idlogo: 1,
          nombre: 'Ejemplo Nombre',
          nombrecorto: 'Ejemplo Nombre',
          observaciones: 'Ejemplo',
          personafisica: 1,
          provincia: 'Ejemplo',
          regimeniva: 'Ejemplo',
          telefono1: '+34 666 777 888',
          telefono2: '+34 666 777 888',
          tipoidfiscal: 'Ejemplo',
          web: 'https://ejemplo.com'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://empresas');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/empresas',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Empresas');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://empresas');
      
      expect(result.name).toBe('FacturaScripts Empresas (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch empresas');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});