import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StocksResource } from '../../../../src/modules/core-business/stocks/resource.js';
import { lowStockToolImplementation } from '../../../../src/modules/core-business/stocks/tool.js';
import type { Stock } from '../../../../src/types/facturascripts.js';

describe('StocksResource', () => {
  let mockClient: any;
  let stocksResource: StocksResource;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      getWithPagination: vi.fn()
    };
    stocksResource = new StocksResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://stocks URIs', () => {
      expect(stocksResource.matchesUri('facturascripts://stocks')).toBe(true);
      expect(stocksResource.matchesUri('facturascripts://stocks?limit=10')).toBe(true);
      expect(stocksResource.matchesUri('facturascripts://stocks?limit=10&offset=20')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(stocksResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(stocksResource.matchesUri('https://example.com')).toBe(false);
      expect(stocksResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockStocks: Stock[] = [
      {
        idstock: 1,
        referencia: 'PROD001',
        codalmacen: 'ALM001',
        descripcion: 'Product 1 Description',
        cantidad: 100,
        reservada: 10,
        disponible: 90,
        pterecibir: 5,
        stockmin: 20,
        stockmax: 200,
        ubicacion: 'A1-B2-C3',
      },
      {
        idstock: 2,
        referencia: 'PROD002',
        codalmacen: 'ALM001',
        descripcion: 'Product 2 Description',
        cantidad: 50,
        reservada: 0,
        disponible: 50,
        pterecibir: 0,
        stockmin: 10,
        stockmax: 100,
        ubicacion: 'A2-B1-C1',
      },
    ];

    const mockPaginatedResponse = {
      meta: {
        total: 2,
        limit: 50,
        offset: 0,
        hasMore: false,
      },
      data: mockStocks,
    };

    it('should return stocks data with default pagination', async () => {
      mockClient.getWithPagination.mockResolvedValue(mockPaginatedResponse);

      const result = await stocksResource.getResource('facturascripts://stocks');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/stocks', 50, 0, {});
      expect(result).toEqual({
        uri: 'facturascripts://stocks',
        name: 'FacturaScripts Stocks',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify(mockPaginatedResponse, null, 2),
            uri: 'facturascripts://stocks',
          },
        ],
      });
    });

    it('should parse and use limit and offset from URI', async () => {
      mockClient.getWithPagination.mockResolvedValue({
        ...mockPaginatedResponse,
        meta: { ...mockPaginatedResponse.meta, limit: 25, offset: 10 },
      });

      const result = await stocksResource.getResource('facturascripts://stocks?limit=25&offset=10');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/stocks', 25, 10, {});
      expect(result.contents[0].text).toContain('"limit": 25');
      expect(result.contents[0].text).toContain('"offset": 10');
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Stock API connection failed';
      mockClient.getWithPagination.mockRejectedValue(new Error(errorMessage));

      const result = await stocksResource.getResource('facturascripts://stocks');

      expect(result.name).toBe('FacturaScripts Stocks (Error)');
      expect(result.contents[0].text).toContain('Failed to fetch stocks');
      expect(result.contents[0].text).toContain(errorMessage);
    });
  });
});

describe('lowStockToolImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  const mockStocksWithLowStock: Stock[] = [
    {
      idstock: 1,
      referencia: 'PROD001',
      codalmacen: 'ALM001',
      descripcion: 'Product 1 Description',
      cantidad: 5,    // Below minimum of 20
      stockmin: 20,
    },
    {
      idstock: 2,
      referencia: 'PROD002',
      codalmacen: 'ALM001',
      descripcion: 'Product 2 Description',
      cantidad: 15,   // Below minimum of 25
      stockmin: 25,
    },
    {
      idstock: 3,
      referencia: 'PROD003',
      codalmacen: 'ALM001',
      descripcion: 'Product 3 Description',
      cantidad: 50,   // Above minimum of 30
      stockmin: 30,
    },
    {
      idstock: 4,
      referencia: 'PROD004',
      codalmacen: 'ALM002',
      descripcion: 'Product 4 Description',
      cantidad: 10,   // Equal to minimum
      stockmin: 10,
    },
  ];

  const mockProductos = [
    { referencia: 'PROD001', descripcion: 'Enhanced Product 1 Description', idproducto: 1 },
    { referencia: 'PROD002', descripcion: 'Enhanced Product 2 Description', idproducto: 2 },
    { referencia: 'PROD004', descripcion: 'Enhanced Product 4 Description', idproducto: 4 },
  ];

  describe('successful scenarios', () => {
    it('should return products with stock below or equal to minimum by default', async () => {
      // Mock stocks response
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        // Mock product responses
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[0]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[1]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[2]],
        });

      const result = await lowStockToolImplementation({}, mockClient);

      expect(result.content[0].type).toBe('text');
      const response = JSON.parse(result.content[0].text);
      
      expect(response.meta.total).toBe(3); // PROD001, PROD002, and PROD004 (equal stock)
      expect(response.data).toHaveLength(3);
      expect(response.data[0].referencia).toBe('PROD001');
      expect(response.data[0].cantidad).toBe(5);
      expect(response.data[0].stockmin).toBe(20);
      expect(response.data[0].cantidad_a_reponer).toBe(15);
      expect(response.data[1].referencia).toBe('PROD004'); // Equal stock item
      expect(response.data[1].cantidad_a_reponer).toBe(0); // No need to reorder
      expect(response.data[2].referencia).toBe('PROD002');
      expect(response.data[2].cantidad_a_reponer).toBe(10);
    });

    it('should exclude products with stock equal to minimum when explicitly requested', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        // Mock product responses
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[0]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[1]],
        });

      const result = await lowStockToolImplementation(
        { incluir_stock_igual: false },
        mockClient
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.total).toBe(2); // Only PROD001 and PROD002 (below minimum)
      expect(response.data.every((p: any) => p.referencia !== 'PROD004')).toBe(true);
    });

    it('should include products with stock equal to minimum when explicitly requested', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[0]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[1]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[2]],
        });

      const result = await lowStockToolImplementation(
        { incluir_stock_igual: true },
        mockClient
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.total).toBe(3); // PROD001, PROD002, and PROD004
      expect(response.data.some((p: any) => p.referencia === 'PROD004')).toBe(true);
    });

    it('should filter by warehouse when codalmacen is provided', async () => {
      const filteredStocks = mockStocksWithLowStock.filter(s => s.codalmacen === 'ALM002');
      
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false },
          data: filteredStocks,
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[2]],
        });

      const result = await lowStockToolImplementation(
        { codalmacen: 'ALM002', incluir_stock_igual: true },
        mockClient
      );

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/stocks',
        1000,
        0,
        { 'filter[codalmacen]': 'ALM002' }
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.summary.almacen_filtrado).toBe('ALM002');
      expect(response.data).toHaveLength(1);
      expect(response.data[0].almacen).toBe('ALM002');
    });

    it('should handle pagination correctly - middle page', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[0]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[1]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[2]],
        });

      const result = await lowStockToolImplementation(
        { limite: 1, offset: 1 },
        mockClient
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.limit).toBe(1);
      expect(response.meta.offset).toBe(1);
      expect(response.meta.hasMore).toBe(true); // Since total = 3, offset = 1, limit = 1, there's still one more item
    });

    it('should handle pagination correctly - first page with more data', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[0]],
        })
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1, offset: 0, hasMore: false },
          data: [mockProductos[1]],
        });

      const result = await lowStockToolImplementation(
        { limite: 1, offset: 0 },
        mockClient
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.limit).toBe(1);
      expect(response.meta.offset).toBe(0);
      expect(response.meta.hasMore).toBe(true); // Since total = 2, offset = 0, limit = 1, there's more data
    });

    it('should sort results by cantidad ascending', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        .mockResolvedValue({
          meta: { total: 0, limit: 1, offset: 0, hasMore: false },
          data: [],
        });

      const result = await lowStockToolImplementation({}, mockClient);

      const response = JSON.parse(result.content[0].text);
      expect(response.data[0].cantidad).toBe(5);  // PROD001 has lowest stock
      expect(response.data[1].cantidad).toBe(10); // PROD004 has middle stock (equal to minimum)
      expect(response.data[2].cantidad).toBe(15); // PROD002 has highest stock
    });
  });

  describe('edge cases and error handling', () => {
    it('should return empty result when no stocks exist', async () => {
      mockClient.getWithPagination.mockResolvedValue({
        meta: { total: 0, limit: 1000, offset: 0, hasMore: false },
        data: [],
      });

      const result = await lowStockToolImplementation({}, mockClient);

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.total).toBe(0);
      expect(response.data).toHaveLength(0);
      expect(response.message).toContain('No se encontraron stocks');
    });

    it('should return empty result when no products are below or equal minimum stock', async () => {
      const stocksAboveMin = mockStocksWithLowStock.map(s => ({ ...s, cantidad: s.stockmin! + 10 }));
      
      mockClient.getWithPagination.mockResolvedValue({
        meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
        data: stocksAboveMin,
      });

      const result = await lowStockToolImplementation({}, mockClient);

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.total).toBe(0);
      expect(response.data).toHaveLength(0);
      expect(response.message).toContain('No hay productos con stock bajo o igual al mínimo');
    });

    it('should skip items without stockmin defined', async () => {
      const stocksWithoutMin = mockStocksWithLowStock.map(s => ({ ...s, stockmin: undefined }));
      
      mockClient.getWithPagination.mockResolvedValue({
        meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
        data: stocksWithoutMin,
      });

      const result = await lowStockToolImplementation({}, mockClient);

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.total).toBe(0);
      expect(response.data).toHaveLength(0);
    });

    it('should handle parameter validation', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 4, limit: 1000, offset: 0, hasMore: false },
          data: mockStocksWithLowStock,
        })
        .mockResolvedValue({
          meta: { total: 0, limit: 1, offset: 0, hasMore: false },
          data: [],
        });

      const result = await lowStockToolImplementation(
        { limite: 2000, offset: -5 }, // Invalid values
        mockClient
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.limit).toBe(1000); // Clamped to maximum
      expect(response.meta.offset).toBe(0);   // Clamped to minimum
    });

    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValue(
        new Error('API connection failed')
      );

      const result = await lowStockToolImplementation({}, mockClient);

      expect(result.isError).toBe(true);
      const response = JSON.parse(result.content[0].text);
      expect(response.error).toBe('Failed to fetch low stock products');
      expect(response.message).toBe('API connection failed');
    });

    it('should fallback to stock description when product details fail', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false },
          data: [mockStocksWithLowStock[0]],
        })
        .mockRejectedValue(new Error('Product API failed'));

      const result = await lowStockToolImplementation({}, mockClient);

      const response = JSON.parse(result.content[0].text);
      expect(response.data[0].descripcion).toBe('Product 1 Description'); // From stock
    });
  });
});