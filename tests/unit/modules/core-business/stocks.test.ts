import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StocksResource } from '../../../../src/modules/core-business/stocks/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import type { Stock } from '../../../../src/types/facturascripts.js';

// Mock the FacturaScriptsClient
vi.mock('../../../../src/fs/client.js');

describe('StocksResource', () => {
  let mockClient: FacturaScriptsClient;
  let stocksResource: StocksResource;

  beforeEach(() => {
    mockClient = new FacturaScriptsClient();
    stocksResource = new StocksResource(mockClient);
    vi.clearAllMocks();
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
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockPaginatedResponse);

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
      vi.mocked(mockClient.getWithPagination).mockResolvedValue({
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
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error(errorMessage));

      const result = await stocksResource.getResource('facturascripts://stocks');

      expect(result.name).toBe('FacturaScripts Stocks (Error)');
      expect(result.contents[0].text).toContain('Failed to fetch stocks');
      expect(result.contents[0].text).toContain(errorMessage);
    });
  });
});