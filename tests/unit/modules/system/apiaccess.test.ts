import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiAccessResource } from '../../../../src/resources/apiaccess.js';
import { ApiAccess } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('ApiAccessResource', () => {
  let apiAccessResource: ApiAccessResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    apiAccessResource = new ApiAccessResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://apiaccess URI', () => {
      expect(apiAccessResource.matchesUri('facturascripts://apiaccess')).toBe(true);
      expect(apiAccessResource.matchesUri('facturascripts://apiaccess?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(apiAccessResource.matchesUri('http://example.com')).toBe(false);
      expect(apiAccessResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(apiAccessResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockApiAccess: ApiAccess[] = [
      {
        allowdelete: 1,
        allowget: 1,
        allowpost: 1,
        allowput: 1,
        id: 1,
        idapikey: 1,
        resource: 'Test Resource'
      }
    ];

    it('should return resource with api access data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockApiAccess
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await apiAccessResource.getResource('facturascripts://apiaccess');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/apiaccess', 50, 0, {});
      expect(result.uri).toBe('facturascripts://apiaccess');
      expect(result.name).toBe('FacturaScripts API Access');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await apiAccessResource.getResource('facturascripts://apiaccess?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/apiaccess', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await apiAccessResource.getResource('facturascripts://apiaccess?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts API Access (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch apiaccess');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});