import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EstadodocumentosResource } from '../../../../src/modules/configuration/estadodocumentos/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('EstadodocumentosResource', () => {
  let resource: EstadodocumentosResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new EstadodocumentosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts estadodocumentos URI', () => {
      expect(resource.matchesUri('facturascripts://estadodocumentos')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://estadodocumentos')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch estadodocumentos with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          activo: 1,
          actualizastock: 1,
          bloquear: 1,
          color: 'Ejemplo',
          editable: 1,
          generadoc: 'Ejemplo',
          icon: 'Ejemplo',
          idestado: 1,
          nombre: 'Ejemplo Nombre',
          predeterminado: 1,
          tipodoc: 'Ejemplo'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://estadodocumentos');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/estadodocumentos',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Estadodocumentos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://estadodocumentos');
      
      expect(result.name).toBe('FacturaScripts Estadodocumentos (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch estadodocumentos');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});