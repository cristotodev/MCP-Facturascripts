import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductoimagenesResource } from '../../../../src/modules/core-business/productoimagenes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('ProductoimagenesResource', () => {
  let mockClient: FacturaScriptsClient;
  let productoimagenesResource: ProductoimagenesResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    productoimagenesResource = new ProductoimagenesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://productoimagenes URI', () => {
      expect(productoimagenesResource.matchesUri('facturascripts://productoimagenes')).toBe(true);
      expect(productoimagenesResource.matchesUri('facturascripts://productoimagenes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(productoimagenesResource.matchesUri('http://example.com')).toBe(false);
      expect(productoimagenesResource.matchesUri('facturascripts://other')).toBe(false);
      expect(productoimagenesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return product images data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          id: 1,
          idproducto: 1,
          idfile: 1,
          referencia: 'TEST001',
          orden: 1
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await productoimagenesResource.getResource('facturascripts://productoimagenes?limit=10');

      expect(result.uri).toBe('facturascripts://productoimagenes?limit=10');
      expect(result.name).toBe('FacturaScripts Product Images');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productoimagenes', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await productoimagenesResource.getResource('facturascripts://productoimagenes');

      expect(result.name).toBe('FacturaScripts Product Images (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch productoimagenes');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});