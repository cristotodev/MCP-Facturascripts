import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaPedidoClientesResource } from '../../../../src/resources/lineapedidoclientes.js';
import { LineaPedidoCliente } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaPedidoClientesResource', () => {
  let lineaPedidoClientesResource: LineaPedidoClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaPedidoClientesResource = new LineaPedidoClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineapedidoclientes URI', () => {
      expect(lineaPedidoClientesResource.matchesUri('facturascripts://lineapedidoclientes')).toBe(true);
      expect(lineaPedidoClientesResource.matchesUri('facturascripts://lineapedidoclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaPedidoClientesResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaPedidoClientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaPedidoClientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaPedidoClientes: LineaPedidoCliente[] = [
      {
        idlinea: 1,
        idpedido: 1,
        idproducto: 1,
        descripcion: 'Order Product',
        cantidad: 5.0,
        pvpunitario: 12.0,
        pvptotal: 60.0,
        codimpuesto: 'IVA21',
        iva: 21.0,
        coste: 10.0
      }
    ];

    it('should return resource with lineapedidoclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaPedidoClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaPedidoClientesResource.getResource('facturascripts://lineapedidoclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapedidoclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineapedidoclientes');
      expect(result.name).toBe('FacturaScripts LineaPedidoClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaPedidoClientesResource.getResource('facturascripts://lineapedidoclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapedidoclientes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaPedidoClientesResource.getResource('facturascripts://lineapedidoclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaPedidoClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineapedidoclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});