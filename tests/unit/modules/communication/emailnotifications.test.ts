import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailnotificationsResource } from '../../../../src/modules/communication/emailnotifications/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('EmailnotificationsResource', () => {
  let resource: EmailnotificationsResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new EmailnotificationsResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts emailnotifications URI', () => {
      expect(resource.matchesUri('facturascripts://emailnotifications')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://emailnotifications')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch emailnotifications with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          body: 'Ejemplo',
          creationdate: '2025-08-12',
          enabled: 1,
          name: 'Ejemplo Nombre',
          subject: 'Ejemplo'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://emailnotifications');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/emailnotifications',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Emailnotifications');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://emailnotifications');
      
      expect(result.name).toBe('FacturaScripts Emailnotifications (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch emailnotifications');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});