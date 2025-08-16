import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PagefilteresResource } from '../../../../src/modules/system/pagefilteres/resource.js';
import { PageFilter } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('PagefilteresResource', () => {
  let pagefilteresResource: PagefilteresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    pagefilteresResource = new PagefilteresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pagefilteres URI', () => {
      expect(pagefilteresResource.matchesUri('facturascripts://pagefilteres')).toBe(true);
      expect(pagefilteresResource.matchesUri('facturascripts://pagefilteres?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(pagefilteresResource.matchesUri('http://example.com')).toBe(false);
      expect(pagefilteresResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(pagefilteresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPageFilters: PageFilter[] = [
      {
        description: 'Filter for active items',
        filters: 'activo:1',
        id: 1,
        name: 'ActiveFilter',
        nick: 'admin'
      }
    ];

    it('should return resource with page filters data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPageFilters
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await pagefilteresResource.getResource('facturascripts://pagefilteres');

      expect(result.name).toBe('FacturaScripts Page Filters');
      expect(result.mimeType).toBe('application/json');
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pagefilteres', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await pagefilteresResource.getResource('facturascripts://pagefilteres?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Page Filters (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch pagefilteres');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await pagefilteresResource.getResource('facturascripts://pagefilteres');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});