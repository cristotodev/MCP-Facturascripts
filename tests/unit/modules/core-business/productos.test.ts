import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductosResource, Producto } from '../../../../src/modules/core-business/productos/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { noVendidosToolImplementation } from '../../../../src/modules/core-business/productos/tool.js';

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

describe('ProductosNoVendidosTool', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('noVendidosToolImplementation', () => {
    const mockProducts = [
      {
        referencia: 'PROD001',
        descripcion: 'Producto Vendido',
        idproducto: 1,
        fechaalta: '01-01-2024',
        stockfis: 10,
        sevende: true
      },
      {
        referencia: 'PROD002',
        descripcion: 'Producto No Vendido',
        idproducto: 2,
        fechaalta: '02-01-2024',
        stockfis: 5,
        sevende: true
      },
      {
        referencia: 'PROD003',
        descripcion: 'Producto No Vendible',
        idproducto: 3,
        fechaalta: '03-01-2024',
        stockfis: 15,
        sevende: false
      }
    ];

    const mockInvoiceLines = [
      {
        referencia: 'PROD001',
        descripcion: 'Producto Vendido',
        cantidad: 2,
        fecha: '2024-01-15'
      }
    ];

    it('should return unsold products successfully', async () => {
      // Mock products API call - only return sellable products (sevende: true)
      const sellableProducts = mockProducts.filter(p => p.sevende === true);
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: sellableProducts,
        })
        // Mock invoice lines API call
        .mockResolvedValueOnce({
          data: mockInvoiceLines,
        });

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.meta.total).toBe(1);
      expect(response.data).toHaveLength(1);
      expect(response.data[0].referencia).toBe('PROD002');
      expect(response.resumen.total_productos_vendibles).toBe(2);
      expect(response.resumen.total_productos_vendidos).toBe(1);
      expect(response.resumen.total_productos_no_vendidos).toBe(1);
      expect(response.resumen.porcentaje_no_vendidos).toBe('50.00%');
    });

    it('should apply date filters correctly', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockProducts,
        })
        .mockResolvedValueOnce({
          data: [],
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-12-31'
      };

      await noVendidosToolImplementation(args, mockClient);

      // Check that date filters were applied to invoice lines query
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/lineafacturaclientes',
        2000,
        0,
        {
          'filter[fecha_gte]': '2024-01-01',
          'filter[fecha_lte]': '2024-12-31'
        }
      );
    });

    it('should apply pagination correctly', async () => {
      const manyProducts = Array.from({ length: 200 }, (_, i) => ({
        referencia: `PROD${String(i + 1).padStart(3, '0')}`,
        descripcion: `Producto ${i + 1}`,
        idproducto: i + 1,
        fechaalta: '01-01-2024',
        stockfis: 10,
        sevende: true
      }));

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: manyProducts,
        })
        .mockResolvedValueOnce({
          data: [],
        });

      const args = {
        limit: 50,
        offset: 10
      };

      const result = await noVendidosToolImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.meta.limit).toBe(50);
      expect(response.meta.offset).toBe(10);
      expect(response.meta.hasMore).toBe(true);
      expect(response.data).toHaveLength(50);
    });

    it('should validate and sanitize parameters', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockProducts[1]],
        })
        .mockResolvedValueOnce({
          data: [],
        });

      const args = {
        limit: 2000, // Above maximum
        offset: -5   // Below minimum
      };

      const result = await noVendidosToolImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.meta.limit).toBe(1000); // Capped at maximum
      expect(response.meta.offset).toBe(0);   // Set to minimum
    });

    it('should handle no sellable products', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
      });

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(response.error).toBe('No sellable products found');
      expect(response.message).toBe('No se encontraron productos con sevende=true en el sistema');
    });

    it('should handle all products sold scenario', async () => {
      const allSoldProducts = [
        {
          referencia: 'PROD001',
          descripcion: 'Producto 1',
          idproducto: 1,
          fechaalta: '01-01-2024',
          stockfis: 10,
          sevende: true
        },
        {
          referencia: 'PROD002',
          descripcion: 'Producto 2',
          idproducto: 2,
          fechaalta: '02-01-2024',
          stockfis: 5,
          sevende: true
        }
      ];

      const allSoldLines = [
        { referencia: 'PROD001', cantidad: 1 },
        { referencia: 'PROD002', cantidad: 2 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: allSoldProducts,
        })
        .mockResolvedValueOnce({
          data: allSoldLines,
        });

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.meta.total).toBe(0);
      expect(response.data).toHaveLength(0);
      expect(response.resumen.total_productos_vendidos).toBe(2);
      expect(response.resumen.total_productos_no_vendidos).toBe(0);
      expect(response.resumen.porcentaje_no_vendidos).toBe('0.00%');
    });

    it('should handle large datasets with pagination', async () => {
      // Mock first batch of products (full batch of 1000)
      const firstBatch = Array.from({ length: 1000 }, (_, i) => ({
        referencia: `BATCH1_${i}`,
        descripcion: `Producto Batch 1 ${i}`,
        idproducto: i,
        fechaalta: '01-01-2024',
        stockfis: 10,
        sevende: true
      }));

      // Mock second batch of products (smaller, indicating end)
      const secondBatch = Array.from({ length: 500 }, (_, i) => ({
        referencia: `BATCH2_${i}`,
        descripcion: `Producto Batch 2 ${i}`,
        idproducto: 1000 + i,
        fechaalta: '01-01-2024',
        stockfis: 10,
        sevende: true
      }));

      // Mock invoice lines - first batch covers BATCH1_ products
      const invoiceLinesBatch1 = Array.from({ length: 2000 }, (_, i) => ({
        referencia: `BATCH1_${i % 1000}`, // Cycle through the 1000 products
        cantidad: 1
      }));

      // Mock invoice lines - second batch covers BATCH2_ products  
      const invoiceLinesBatch2 = Array.from({ length: 1000 }, (_, i) => ({
        referencia: `BATCH2_${i % 500}`, // Cycle through the 500 products
        cantidad: 1
      }));

      mockClient.getWithPagination
        // Products pagination (2 calls)
        .mockResolvedValueOnce({ data: firstBatch })
        .mockResolvedValueOnce({ data: secondBatch })
        // Invoice lines pagination (2 calls)
        .mockResolvedValueOnce({ data: invoiceLinesBatch1 })
        .mockResolvedValueOnce({ data: invoiceLinesBatch2 });

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.resumen.total_productos_vendibles).toBe(1500);
      expect(response.resumen.total_productos_vendidos).toBe(1500);
      expect(response.resumen.total_productos_no_vendidos).toBe(0);
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API connection failed');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(response.error).toBe('API Error');
      expect(response.message).toBe('API connection failed');
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error string');

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(response.error).toBe('API Error');
      expect(response.message).toBe('Error desconocido al obtener productos no vendidos');
    });

    it('should include proper period information in response', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockProducts[1]],
        })
        .mockResolvedValueOnce({
          data: [],
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-12-31'
      };

      const result = await noVendidosToolImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.periodo.fecha_desde).toBe('2024-01-01');
      expect(response.periodo.fecha_hasta).toBe('2024-12-31');
      expect(response.periodo.descripcion).toBe('Análisis de productos no vendidos desde 2024-01-01 hasta 2024-12-31');
    });

    it('should handle only fecha_desde parameter', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockProducts[1]],
        })
        .mockResolvedValueOnce({
          data: [],
        });

      const args = {
        fecha_desde: '2024-01-01'
      };

      const result = await noVendidosToolImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.periodo.fecha_desde).toBe('2024-01-01');
      expect(response.periodo.fecha_hasta).toBe(null);
      expect(response.periodo.descripcion).toBe('Análisis de productos no vendidos desde 2024-01-01');
    });

    it('should filter out products without reference', async () => {
      const productsWithMissingRefs = [
        {
          referencia: 'PROD001',
          descripcion: 'Producto con referencia',
          idproducto: 1,
          fechaalta: '01-01-2024',
          stockfis: 10,
          sevende: true
        },
        {
          referencia: null,
          descripcion: 'Producto sin referencia',
          idproducto: 2,
          fechaalta: '02-01-2024',
          stockfis: 5,
          sevende: true
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: productsWithMissingRefs,
        })
        .mockResolvedValueOnce({
          data: [],
        });

      const result = await noVendidosToolImplementation({}, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.data).toHaveLength(1);
      expect(response.data[0].referencia).toBe('PROD001');
    });
  });
});