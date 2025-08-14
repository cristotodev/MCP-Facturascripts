import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductoproveedoresResource, ProductoProveedor } from '../../../../src/resources/productoproveedores.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('ProductoproveedoresResource', () => {
  let productoproveedoresResource: ProductoproveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    productoproveedoresResource = new ProductoproveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://productoproveedores URI', () => {
      expect(productoproveedoresResource.matchesUri('facturascripts://productoproveedores')).toBe(true);
      expect(productoproveedoresResource.matchesUri('facturascripts://productoproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(productoproveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(productoproveedoresResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(productoproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockProductoproveedores: ProductoProveedor[] = [
      {
        codproveedor: 'PROV001',
        referencia: 'PROD001',
        refproveedor: 'REF-PROV-001',
        precio: 15.50,
        dtopor: 5.0,
        actualizado: '2024-01-15'
      }
    ];

    it('should return resource with productoproveedores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockProductoproveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await productoproveedoresResource.getResource('facturascripts://productoproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productoproveedores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://productoproveedores');
      expect(result.name).toBe('FacturaScripts ProductoProveedores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await productoproveedoresResource.getResource('facturascripts://productoproveedores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productoproveedores', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await productoproveedoresResource.getResource('facturascripts://productoproveedores?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productoproveedores', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await productoproveedoresResource.getResource('facturascripts://productoproveedores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts ProductoProveedores (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch productoproveedores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await productoproveedoresResource.getResource('facturascripts://productoproveedores');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});