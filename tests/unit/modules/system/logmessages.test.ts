import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LogMessagesResource } from '../../../../src/resources/logmessages.js';
import { LogMessage } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LogMessagesResource', () => {
  let logMessagesResource: LogMessagesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    logMessagesResource = new LogMessagesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://logmessages URI', () => {
      expect(logMessagesResource.matchesUri('facturascripts://logmessages')).toBe(true);
      expect(logMessagesResource.matchesUri('facturascripts://logmessages?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(logMessagesResource.matchesUri('http://example.com')).toBe(false);
      expect(logMessagesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(logMessagesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLogMessages: LogMessage[] = [
      {
        id: 1,
        channel: 'app',
        context: 'authentication',
        idcontacto: 1,
        ip: '192.168.1.100',
        level: 'info',
        message: 'User logged in successfully',
        model: 'User',
        modelcode: 'admin',
        nick: 'admin',
        time: '2025-08-12 18:49:13',
        uri: '/login'
      }
    ];

    it('should return resource with logmessages data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLogMessages
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await logMessagesResource.getResource('facturascripts://logmessages');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/logmessages', 50, 0, {});
      expect(result.uri).toBe('facturascripts://logmessages');
      expect(result.name).toBe('FacturaScripts LogMessages');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await logMessagesResource.getResource('facturascripts://logmessages?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/logmessages', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await logMessagesResource.getResource('facturascripts://logmessages?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LogMessages (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch logmessages');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});