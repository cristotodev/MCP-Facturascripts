import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AttachedfilesResource } from '../../../../src/modules/system/attachedfiles/resource.js';
import { AttachedFile } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AttachedfilesResource', () => {
  let attachedFilesResource: AttachedfilesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    attachedFilesResource = new AttachedfilesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://attachedfiles URI', () => {
      expect(attachedFilesResource.matchesUri('facturascripts://attachedfiles')).toBe(true);
      expect(attachedFilesResource.matchesUri('facturascripts://attachedfiles?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(attachedFilesResource.matchesUri('http://example.com')).toBe(false);
      expect(attachedFilesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(attachedFilesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAttachedFiles: AttachedFile[] = [
      {
        date: '2025-08-12',
        filename: 'test-file.pdf',
        hour: '2025-08-12 18:49:13',
        idfile: 1,
        mimetype: 'application/pdf',
        path: '/files/test-file.pdf',
        size: 1024
      }
    ];

    it('should return resource with attached files data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAttachedFiles
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await attachedFilesResource.getResource('facturascripts://attachedfiles');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/attachedfiles', 50, 0, {});
      expect(result.uri).toBe('facturascripts://attachedfiles');
      expect(result.name).toBe('FacturaScripts Attachedfiles');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await attachedFilesResource.getResource('facturascripts://attachedfiles?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/attachedfiles', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await attachedFilesResource.getResource('facturascripts://attachedfiles?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Attachedfiles (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch attachedfiles');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});