import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaPedidoProveedoresResource } from '../../../../src/resources/lineapedidoproveedores.js';
import { LineaPedidoProveedor } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaPedidoProveedoresResource', () => {
  let lineaPedidoProveedoresResource: LineaPedidoProveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaPedidoProveedoresResource = new LineaPedidoProveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineapedidoproveedores URI', () => {
      expect(lineaPedidoProveedoresResource.matchesUri('facturascripts://lineapedidoproveedores')).toBe(true);
      expect(lineaPedidoProveedoresResource.matchesUri('facturascripts://lineapedidoproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaPedidoProveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaPedidoProveedoresResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaPedidoProveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaPedidoProveedores: LineaPedidoProveedor[] = [
      {
        idlinea: 1,
        idpedido: 1,
        idproducto: 1,
        descripcion: 'Supplier Order Product',
        cantidad: 15.0,
        pvpunitario: 8.0,
        pvptotal: 120.0,
        codimpuesto: 'IVA21',
        iva: 21.0
      }
    ];

    it('should return resource with lineapedidoproveedores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaPedidoProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaPedidoProveedoresResource.getResource('facturascripts://lineapedidoproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapedidoproveedores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineapedidoproveedores');
      expect(result.name).toBe('FacturaScripts LineaPedidoProveedores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaPedidoProveedoresResource.getResource('facturascripts://lineapedidoproveedores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapedidoproveedores', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaPedidoProveedoresResource.getResource('facturascripts://lineapedidoproveedores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaPedidoProveedores (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineapedidoproveedores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});