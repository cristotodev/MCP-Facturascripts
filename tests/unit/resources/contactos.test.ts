import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContactosResource } from '../../../src/resources/contactos.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('ContactosResource', () => {
  let resource: ContactosResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new ContactosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts contactos URI', () => {
      expect(resource.matchesUri('facturascripts://contactos')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://contactos')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch contactos with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          idcontacto: 1,
          nombre: 'John Doe',
          email: 'john@example.com',
          telefono1: '+1234567890'
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://contactos');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/contactos',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Contactos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://contactos');
      
      expect(result.name).toBe('FacturaScripts Contactos (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch contactos');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});