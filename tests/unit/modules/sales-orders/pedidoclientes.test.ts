import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PedidoclientesResource, PedidoCliente } from '../../../../src/modules/sales-orders/pedidoclientes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('PedidoclientesResource', () => {
  let pedidoclientesResource: PedidoclientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    pedidoclientesResource = new PedidoclientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pedidoclientes URI', () => {
      expect(pedidoclientesResource.matchesUri('facturascripts://pedidoclientes')).toBe(true);
      expect(pedidoclientesResource.matchesUri('facturascripts://pedidoclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(pedidoclientesResource.matchesUri('http://example.com')).toBe(false);
      expect(pedidoclientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(pedidoclientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPedidoclientes: PedidoCliente[] = [
      {
        codigo: 'PED001',
        numero: 'P-2024-001',
        codcliente: 'CLI001',
        nombrecliente: 'Cliente Test',
        fecha: '2024-01-15',
        total: 150.75,
        totaliva: 31.66,
        servido: false
      }
    ];

    it('should return resource with pedidoclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPedidoclientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await pedidoclientesResource.getResource('facturascripts://pedidoclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pedidoclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://pedidoclientes');
      expect(result.name).toBe('FacturaScripts PedidoClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await pedidoclientesResource.getResource('facturascripts://pedidoclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pedidoclientes', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await pedidoclientesResource.getResource('facturascripts://pedidoclientes?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pedidoclientes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await pedidoclientesResource.getResource('facturascripts://pedidoclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts PedidoClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch pedidoclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await pedidoclientesResource.getResource('facturascripts://pedidoclientes');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});