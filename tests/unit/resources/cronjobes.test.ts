import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CronjobesResource } from '../../../src/resources/cronjobes.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('CronjobesResource', () => {
  let resource: CronjobesResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new CronjobesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts cronjobes URI', () => {
      expect(resource.matchesUri('facturascripts://cronjobes')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://cronjobes')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch cronjobes with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          id: 1,
          jobname: 'TestJob',
          pluginname: 'TestPlugin',
          enabled: 1,
          done: 0
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://cronjobes');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/cronjobes',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts CronJobs');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://cronjobes');
      
      expect(result.name).toBe('FacturaScripts CronJobs (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch cronjobes');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});