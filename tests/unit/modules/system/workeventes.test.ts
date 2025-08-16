import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { WorkEventesResource } from '../../../../src/modules/system/workeventes/resource.js';
import type { WorkEvent } from '../../../../src/types/facturascripts.js';

vi.mock('../../../../src/fs/client.js');

describe('WorkEventesResource', () => {
  let mockClient: FacturaScriptsClient;
  let workEventesResource: WorkEventesResource;

  beforeEach(() => {
    mockClient = new FacturaScriptsClient();
    workEventesResource = new WorkEventesResource(mockClient);
    vi.clearAllMocks();
  });

  describe('getResource', () => {
    it('should fetch work events successfully', async () => {
      const mockData: WorkEvent[] = [
        {
          id: 1,
          name: 'Database Backup',
          creation_date: '2025-08-16 10:00:00',
          done: 1,
          done_date: '2025-08-16 10:05:00',
          nick: 'admin',
          params: 'daily_backup',
          value: 'success',
          workers: 1,
          worker_list: 'backup_service'
        },
        {
          id: 2,
          name: 'Email Processing',
          creation_date: '2025-08-16 11:00:00',
          done: 0,
          nick: 'system',
          params: 'queue_size=50',
          workers: 2,
          worker_list: 'email_worker_1,email_worker_2'
        }
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

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockResponse);

      const result = await workEventesResource.getResource('facturascripts://workeventes?limit=50&offset=0');

      expect(result.uri).toBe('facturascripts://workeventes?limit=50&offset=0');
      expect(result.name).toBe('FacturaScripts Work Events');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].type).toBe('text');

      const content = JSON.parse(result.contents[0].text);
      expect(content.meta.total).toBe(2);
      expect(content.data).toHaveLength(2);
      expect(content.data[0].id).toBe(1);
      expect(content.data[0].name).toBe('Database Backup');
      expect(content.data[0].done).toBe(1);
      expect(content.data[1].id).toBe(2);
      expect(content.data[1].done).toBe(0);

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/workeventes',
        50,
        0,
        {}
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Server maintenance in progress');
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(mockError);

      const result = await workEventesResource.getResource('facturascripts://workeventes');

      expect(result.uri).toBe('facturascripts://workeventes');
      expect(result.name).toBe('FacturaScripts Work Events (Error)');
      expect(result.mimeType).toBe('application/json');

      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch work events');
      expect(content.message).toBe('Server maintenance in progress');
      expect(content.meta.total).toBe(0);
      expect(content.data).toEqual([]);
    });

    it('should parse filter and order parameters correctly', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 25, offset: 5, hasMore: false },
        data: [],
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockResponse);

      await workEventesResource.getResource('facturascripts://workeventes?limit=25&offset=5&filter=done:1,nick:admin&order=creation_date:desc');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/workeventes',
        25,
        5,
        {
          'filter[done]': '1',
          'filter[nick]': 'admin',
          'sort[creation_date]': 'DESC'
        }
      );
    });

    it('should handle partial work event data', async () => {
      const mockData: WorkEvent[] = [
        {
          id: 3,
          name: 'Minimal Event'
        }
      ];

      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockData,
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockResponse);

      const result = await workEventesResource.getResource('facturascripts://workeventes');

      const content = JSON.parse(result.contents[0].text);
      expect(content.data[0].id).toBe(3);
      expect(content.data[0].name).toBe('Minimal Event');
      expect(content.data[0].done).toBeUndefined();
      expect(content.data[0].creation_date).toBeUndefined();
    });

    it('should handle text search filters', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: [],
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockResponse);

      await workEventesResource.getResource('facturascripts://workeventes?filter=name_like:backup');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/workeventes',
        50,
        0,
        {
          'filter[name_like]': 'backup'
        }
      );
    });
  });

  describe('matchesUri', () => {
    it('should match workeventes URIs', () => {
      expect(workEventesResource.matchesUri('facturascripts://workeventes')).toBe(true);
      expect(workEventesResource.matchesUri('facturascripts://workeventes?limit=10')).toBe(true);
      expect(workEventesResource.matchesUri('facturascripts://workeventes?filter=done:1')).toBe(true);
      expect(workEventesResource.matchesUri('facturascripts://workeventes?order=creation_date:desc')).toBe(true);
    });

    it('should not match non-workeventes URIs', () => {
      expect(workEventesResource.matchesUri('facturascripts://cronjobes')).toBe(false);
      expect(workEventesResource.matchesUri('facturascripts://logmessages')).toBe(false);
      expect(workEventesResource.matchesUri('facturascripts://totalmodeles')).toBe(false);
      expect(workEventesResource.matchesUri('https://example.com')).toBe(false);
    });
  });
});