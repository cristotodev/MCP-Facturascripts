import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VariantesResource } from '../../../../src/modules/core-business/variantes/resource.js';
import type { Variante } from '../../../../src/types/facturascripts.js';

describe('VariantesResource', () => {
  let mockClient: any;
  let variantesResource: VariantesResource;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      getWithPagination: vi.fn()
    };
    variantesResource = new VariantesResource(mockClient);
  });

  describe('getResource', () => {
    it('should fetch product variants successfully', async () => {
      const mockData: Variante[] = [
        {
          idvariante: 1,
          idproducto: 100,
          referencia: 'VAR001',
          codbarras: '1234567890123',
          precio: 25.99,
          coste: 15.50,
          stockfis: 10,
          margen: 67.42,
          idatributovalor1: 1,
          idatributovalor2: 2
        },
        {
          idvariante: 2,
          idproducto: 100,
          referencia: 'VAR002',
          codbarras: '1234567890124',
          precio: 29.99,
          coste: 18.00,
          stockfis: 5,
          margen: 66.56
        }
      ];

      const mockResponse = {
        meta: {
          total: 2,
          limit: 50,
          offset: 0,
          hasMore: false,
        },
        data: mockData,
      };

      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await variantesResource.getResource('facturascripts://variantes?limit=50&offset=0');

      expect(result.uri).toBe('facturascripts://variantes?limit=50&offset=0');
      expect(result.name).toBe('FacturaScripts Product Variants');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      expect(result.contents[0].type).toBe('text');

      const content = JSON.parse(result.contents[0].text);
      expect(content.meta.total).toBe(2);
      expect(content.data).toHaveLength(2);
      expect(content.data[0].idvariante).toBe(1);
      expect(content.data[0].referencia).toBe('VAR001');
      expect(content.data[1].idvariante).toBe(2);
      expect(content.data[1].referencia).toBe('VAR002');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/variantes',
        50,
        0,
        {}
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('Database connection failed');
      mockClient.getWithPagination.mockRejectedValue(mockError);

      const result = await variantesResource.getResource('facturascripts://variantes');

      expect(result.uri).toBe('facturascripts://variantes');
      expect(result.name).toBe('FacturaScripts Product Variants (Error)');
      expect(result.mimeType).toBe('application/json');

      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch product variants');
      expect(content.message).toBe('Database connection failed');
      expect(content.meta.total).toBe(0);
      expect(content.data).toEqual([]);
    });

    it('should parse complex filter parameters correctly', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 25, offset: 10, hasMore: false },
        data: [],
      };

      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await variantesResource.getResource('facturascripts://variantes?limit=25&offset=10&filter=idproducto:100,precio_gte:20.00&order=precio:desc');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/variantes',
        25,
        10,
        {
          'filter[idproducto]': '100',
          'filter[precio_gte]': '20.00',
          'sort[precio]': 'DESC'
        }
      );
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: [],
      };

      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await variantesResource.getResource('facturascripts://variantes?filter=nonexistent:value');

      const content = JSON.parse(result.contents[0].text);
      expect(content.meta.total).toBe(0);
      expect(content.data).toEqual([]);
    });
  });

  describe('matchesUri', () => {
    it('should match variantes URIs', () => {
      expect(variantesResource.matchesUri('facturascripts://variantes')).toBe(true);
      expect(variantesResource.matchesUri('facturascripts://variantes?limit=10')).toBe(true);
      expect(variantesResource.matchesUri('facturascripts://variantes?filter=idproducto:100')).toBe(true);
      expect(variantesResource.matchesUri('facturascripts://variantes?order=precio:asc')).toBe(true);
    });

    it('should not match non-variantes URIs', () => {
      expect(variantesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(variantesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(variantesResource.matchesUri('facturascripts://totalmodeles')).toBe(false);
      expect(variantesResource.matchesUri('https://example.com')).toBe(false);
    });
  });
});