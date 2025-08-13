import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiKeyesResource } from '../../../src/resources/apikeyes.js';
import { ApiKey } from '../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('../../../src/fs/client.js');

describe('ApiKeyesResource', () => {
  let apiKeyesResource: ApiKeyesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    apiKeyesResource = new ApiKeyesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://apikeyes URI', () => {
      expect(apiKeyesResource.matchesUri('facturascripts://apikeyes')).toBe(true);
      expect(apiKeyesResource.matchesUri('facturascripts://apikeyes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(apiKeyesResource.matchesUri('http://example.com')).toBe(false);
      expect(apiKeyesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(apiKeyesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockApiKeys: ApiKey[] = [
      {
        apikey: 'test-key',
        creationdate: '2025-08-12',
        description: 'Test API Key',
        enabled: 1,
        fullaccess: 1,
        id: 1,
        nick: 'testuser'
      }
    ];

    it('should return resource with api keys data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockApiKeys
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await apiKeyesResource.getResource('facturascripts://apikeyes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/apikeyes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://apikeyes');
      expect(result.name).toBe('FacturaScripts API Keys');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await apiKeyesResource.getResource('facturascripts://apikeyes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/apikeyes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await apiKeyesResource.getResource('facturascripts://apikeyes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts API Keys (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch apikeyes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});