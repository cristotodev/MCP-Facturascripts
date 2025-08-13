import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DoctransformationsResource } from '../../../src/resources/doctransformations.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('DoctransformationsResource', () => {
  let resource: DoctransformationsResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new DoctransformationsResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts doctransformations URI', () => {
      expect(resource.matchesUri('facturascripts://doctransformations')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://doctransformations')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch doctransformations with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          cantidad: 123.45,
          id: 1,
          iddoc1: 1,
          iddoc2: 1,
          idlinea1: 1,
          idlinea2: 1,
          model1: 'Ejemplo',
          model2: 'Ejemplo'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://doctransformations');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/doctransformations',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts DocTransformations');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://doctransformations');
      
      expect(result.name).toBe('FacturaScripts DocTransformations (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch doctransformations');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});