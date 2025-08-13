import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailsentesResource } from '../../../src/resources/emailsentes.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('EmailsentesResource', () => {
  let resource: EmailsentesResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new EmailsentesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts emailsentes URI', () => {
      expect(resource.matchesUri('facturascripts://emailsentes')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://emailsentes')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch emailsentes with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          addressee: 'Ejemplo',
          attachment: 1,
          body: 'Ejemplo',
          date: '2025-08-12 18:49:13',
          email_from: 'ejemplo@email.com',
          html: 'Ejemplo',
          id: 1,
          nick: 'Ejemplo',
          opened: 1,
          subject: 'Ejemplo',
          uuid: 'Ejemplo',
          verificode: 'Ejemplo'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://emailsentes');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/emailsentes',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts EmailSentes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://emailsentes');
      
      expect(result.name).toBe('FacturaScripts EmailSentes (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch emailsentes');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});