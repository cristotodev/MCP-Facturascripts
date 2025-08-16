import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaisResource } from '../../../../src/modules/geographic/pais/resource.js';
import { Pais } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('PaisResource', () => {
  let paisResource: PaisResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    paisResource = new PaisResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pais URI', () => {
      expect(paisResource.matchesUri('facturascripts://pais')).toBe(true);
      expect(paisResource.matchesUri('facturascripts://pais?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(paisResource.matchesUri('http://example.com')).toBe(false);
      expect(paisResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(paisResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPaises: Pais[] = [
      {
        alias: 'España',
        codiso: 'ES',
        codpais: 'ESP',
        creation_date: '2025-08-12 18:49:13',
        last_nick: 'admin',
        last_update: '2025-08-12 18:49:13',
        latitude: 40.4168,
        longitude: -3.7038,
        nick: 'admin',
        nombre: 'España',
        telephone_prefix: '+34'
      }
    ];

    it('should return resource with countries data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPaises
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await paisResource.getResource('facturascripts://pais');

      expect(result.name).toBe('FacturaScripts Countries');
      expect(result.mimeType).toBe('application/json');
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pais', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await paisResource.getResource('facturascripts://pais?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Countries (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch pais');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await paisResource.getResource('facturascripts://pais');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});