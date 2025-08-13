import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachedFileRelationsResource } from '../../../src/resources/attachedfilerelations.js';
import { AttachedFileRelation } from '../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('../../../src/fs/client.js');

describe('AttachedFileRelationsResource', () => {
  let attachedFileRelationsResource: AttachedFileRelationsResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    attachedFileRelationsResource = new AttachedFileRelationsResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://attachedfilerelations URI', () => {
      expect(attachedFileRelationsResource.matchesUri('facturascripts://attachedfilerelations')).toBe(true);
      expect(attachedFileRelationsResource.matchesUri('facturascripts://attachedfilerelations?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(attachedFileRelationsResource.matchesUri('http://example.com')).toBe(false);
      expect(attachedFileRelationsResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(attachedFileRelationsResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAttachedFileRelations: AttachedFileRelation[] = [
      {
        creationdate: '2025-08-12 18:49:13',
        id: 1,
        idfile: 1,
        model: 'Cliente',
        modelid: 123,
        modelcode: 'CLI-001',
        nick: 'testuser',
        observations: 'Test relation'
      }
    ];

    it('should return resource with attached file relations data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAttachedFileRelations
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await attachedFileRelationsResource.getResource('facturascripts://attachedfilerelations');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/attachedfilerelations', 50, 0, {});
      expect(result.uri).toBe('facturascripts://attachedfilerelations');
      expect(result.name).toBe('FacturaScripts Attached File Relations');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await attachedFileRelationsResource.getResource('facturascripts://attachedfilerelations?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/attachedfilerelations', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await attachedFileRelationsResource.getResource('facturascripts://attachedfilerelations?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Attached File Relations (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch attachedfilerelations');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});