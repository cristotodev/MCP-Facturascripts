import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CodigoPostalesResource } from '../../../src/resources/codigopostales.js';
import { CodigoPostal } from '../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('../../../src/fs/client.js');

describe('CodigoPostalesResource', () => {
  let codigoPostalesResource: CodigoPostalesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    codigoPostalesResource = new CodigoPostalesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://codigopostales URI', () => {
      expect(codigoPostalesResource.matchesUri('facturascripts://codigopostales')).toBe(true);
      expect(codigoPostalesResource.matchesUri('facturascripts://codigopostales?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(codigoPostalesResource.matchesUri('http://example.com')).toBe(false);
      expect(codigoPostalesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(codigoPostalesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockCodigoPostales: CodigoPostal[] = [
      {
        codpais: 'ESP',
        creation_date: '2025-08-12 18:49:13',
        id: 1,
        idciudad: 1,
        idprovincia: 1,
        last_nick: 'admin',
        last_update: '2025-08-12 18:49:13',
        nick: 'admin',
        number: 28001
      }
    ];

    it('should return resource with codigo postales data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockCodigoPostales
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await codigoPostalesResource.getResource('facturascripts://codigopostales');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/codigopostales', 50, 0, {});
      expect(result.uri).toBe('facturascripts://codigopostales');
      expect(result.name).toBe('FacturaScripts Postal Codes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await codigoPostalesResource.getResource('facturascripts://codigopostales?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/codigopostales', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await codigoPostalesResource.getResource('facturascripts://codigopostales?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Postal Codes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch codigopostales');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});