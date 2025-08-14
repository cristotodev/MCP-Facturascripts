import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductosResource, Producto } from '../../../../src/modules/core-business/productos/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('ProductosResource', () => {
  let productosResource: ProductosResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    productosResource = new ProductosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://productos URI', () => {
      expect(productosResource.matchesUri('facturascripts://productos')).toBe(true);
      expect(productosResource.matchesUri('facturascripts://productos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(productosResource.matchesUri('http://example.com')).toBe(false);
      expect(productosResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(productosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockProductos: Producto[] = [
      {
        referencia: 'PROD001',
        descripcion: 'Test Product',
        precio: 19.99,
        codfamilia: 'FAM001',
        stockfis: 100,
        bloqueado: false,
        secompra: true,
        sevende: true
      }
    ];

    it('should return resource with productos data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockProductos
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await productosResource.getResource('facturascripts://productos');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productos', 50, 0, {});
      expect(result.uri).toBe('facturascripts://productos');
      expect(result.name).toBe('FacturaScripts Productos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await productosResource.getResource('facturascripts://productos?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productos', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await productosResource.getResource('facturascripts://productos?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/productos', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await productosResource.getResource('facturascripts://productos?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Productos (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch productos');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await productosResource.getResource('facturascripts://productos');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});