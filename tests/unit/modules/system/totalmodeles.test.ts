import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TotalModelesResource } from '../../../../src/modules/system/totalmodeles/resource.js';
import type { TotalModel } from '../../../../src/types/facturascripts.js';

describe('TotalModelesResource', () => {
  let mockClient: any;
  let totalModelesResource: TotalModelesResource;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      getWithPagination: vi.fn()
    };
    totalModelesResource = new TotalModelesResource(mockClient);
  });

  describe('getResource', () => {
    it('should fetch total models successfully', async () => {
      const mockData: TotalModel[] = [
        { id: 1, name: 'Test Model' },
        { id: 2, name: 'Another Model' }
      ];

      const mockResponse = {
        meta: {
          total: 2,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
        data: mockData,
      };

      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await totalModelesResource.getResource('facturascripts://totalmodeles?limit=50&offset=0');

      expect(result.uri).toBe('facturascripts://totalmodeles?limit=50&offset=0');
      expect(result.name).toBe('FacturaScripts Analytics/Total Models');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].type).toBe('text');

      const content = JSON.parse(result.contents[0].text);
      expect(content.meta.total).toBe(2);
      expect(content.data).toHaveLength(2);
      expect(content.data[0].id).toBe(1);
      expect(content.data[1].id).toBe(2);

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/totalmodeles',
        50,
        0,
        {}
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API connection failed');
      mockClient.getWithPagination.mockRejectedValue(mockError);

      const result = await totalModelesResource.getResource('facturascripts://totalmodeles');

      expect(result.uri).toBe('facturascripts://totalmodeles');
      expect(result.name).toBe('FacturaScripts Analytics/Total Models (Error)');
      expect(result.mimeType).toBe('application/json');

      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch analytics models');
      expect(content.message).toBe('API connection failed');
      expect(content.meta.total).toBe(0);
      expect(content.data).toEqual([]);
    });

    it('should parse URL parameters correctly', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 25, offset: 10, hasMore: false },
        data: [],
      };

      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await totalModelesResource.getResource('facturascripts://totalmodeles?limit=25&offset=10&filter=active:1&order=name:asc');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/totalmodeles',
        25,
        10,
        {
          'filter[active]': '1',
          'sort[name]': 'ASC'
        }
      );
    });
  });

  describe('matchesUri', () => {
    it('should match totalmodeles URIs', () => {
      expect(totalModelesResource.matchesUri('facturascripts://totalmodeles')).toBe(true);
      expect(totalModelesResource.matchesUri('facturascripts://totalmodeles?limit=10')).toBe(true);
      expect(totalModelesResource.matchesUri('facturascripts://totalmodeles?filter=active:1')).toBe(true);
    });

    it('should not match non-totalmodeles URIs', () => {
      expect(totalModelesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(totalModelesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(totalModelesResource.matchesUri('facturascripts://variantes')).toBe(false);
      expect(totalModelesResource.matchesUri('https://example.com')).toBe(false);
    });
  });
});