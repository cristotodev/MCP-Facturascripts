import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PagesResource } from '../../../../src/modules/system/pages/resource.js';
import { Page } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('PagesResource', () => {
  let pagesResource: PagesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    pagesResource = new PagesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pages URI', () => {
      expect(pagesResource.matchesUri('facturascripts://pages')).toBe(true);
      expect(pagesResource.matchesUri('facturascripts://pages?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(pagesResource.matchesUri('http://example.com')).toBe(false);
      expect(pagesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(pagesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPages: Page[] = [
      {
        icon: 'fas fa-home',
        menu: 'main',
        name: 'HomePage',
        ordernum: 1,
        showonmenu: 1,
        submenu: 'general',
        title: 'Home Page'
      }
    ];

    it('should return resource with pages data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPages
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await pagesResource.getResource('facturascripts://pages');

      expect(result.name).toBe('FacturaScripts Pages');
      expect(result.mimeType).toBe('application/json');
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pages', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await pagesResource.getResource('facturascripts://pages?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Pages (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch pages');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await pagesResource.getResource('facturascripts://pages');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});