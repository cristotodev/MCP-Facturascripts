import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaFacturaClientesResource } from '../../../../src/modules/sales-orders/line-items/lineafacturaclientes/resource.js';
import { LineaFacturaCliente } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaFacturaClientesResource', () => {
  let lineaFacturaClientesResource: LineaFacturaClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaFacturaClientesResource = new LineaFacturaClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineafacturaclientes URI', () => {
      expect(lineaFacturaClientesResource.matchesUri('facturascripts://lineafacturaclientes')).toBe(true);
      expect(lineaFacturaClientesResource.matchesUri('facturascripts://lineafacturaclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaFacturaClientesResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaFacturaClientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaFacturaClientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaFacturaClientes: LineaFacturaCliente[] = [
      {
        idlinea: 1,
        idfactura: 1,
        idproducto: 1,
        descripcion: 'Invoice Product',
        cantidad: 3.0,
        pvpunitario: 15.0,
        pvptotal: 45.0,
        codimpuesto: 'IVA21',
        iva: 21.0,
        coste: 12.0
      }
    ];

    it('should return resource with lineafacturaclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaFacturaClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaFacturaClientesResource.getResource('facturascripts://lineafacturaclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineafacturaclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineafacturaclientes');
      expect(result.name).toBe('FacturaScripts LineaFacturaClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaFacturaClientesResource.getResource('facturascripts://lineafacturaclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineafacturaclientes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaFacturaClientesResource.getResource('facturascripts://lineafacturaclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaFacturaClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineafacturaclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});