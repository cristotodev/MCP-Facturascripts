import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EjerciciosResource } from '../../../src/resources/ejercicios.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('EjerciciosResource', () => {
  let resource: EjerciciosResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new EjerciciosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts ejercicios URI', () => {
      expect(resource.matchesUri('facturascripts://ejercicios')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://ejercicios')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch ejercicios with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          codejercicio: 'Ejemplo',
          estado: 'Ejemplo',
          fechafin: '2025-08-12',
          fechainicio: '2025-08-12',
          idempresa: 1,
          longsubcuenta: 1,
          nombre: 'Ejemplo Nombre'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://ejercicios');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/ejercicios',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Ejercicios');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://ejercicios');
      
      expect(result.name).toBe('FacturaScripts Ejercicios (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch ejercicios');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});