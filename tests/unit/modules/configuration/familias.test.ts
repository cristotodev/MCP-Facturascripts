import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FamiliasResource } from '../../../../src/resources/familias.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('FamiliasResource', () => {
  let resource: FamiliasResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new FamiliasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts familias URI', () => {
      expect(resource.matchesUri('facturascripts://familias')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://familias')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch familias with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          codfamilia: 'Ejemplo',
          codsubcuentacom: 'Ejemplo',
          codsubcuentairpfcom: 'Ejemplo',
          codsubcuentaven: 'Ejemplo',
          descripcion: 'Descripción de ejemplo',
          madre: 'Ejemplo',
          numproductos: 1
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://familias');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/familias',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Familias');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://familias');
      
      expect(result.name).toBe('FacturaScripts Familias (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch familias');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});