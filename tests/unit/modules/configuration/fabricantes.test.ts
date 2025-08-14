import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FabricantesResource } from '../../../../src/resources/fabricantes.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('FabricantesResource', () => {
  let resource: FabricantesResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new FabricantesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts fabricantes URI', () => {
      expect(resource.matchesUri('facturascripts://fabricantes')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://fabricantes')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch fabricantes with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          codfabricante: 'Ejemplo',
          nombre: 'Ejemplo Nombre',
          numproductos: 1
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://fabricantes');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/fabricantes',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Fabricantes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://fabricantes');
      
      expect(result.name).toBe('FacturaScripts Fabricantes (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch fabricantes');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});