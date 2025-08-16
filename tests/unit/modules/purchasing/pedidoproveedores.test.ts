import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PedidoproveedoresResource } from '../../../../src/modules/purchasing/pedidoproveedores/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('PedidoproveedoresResource', () => {
  let mockClient: FacturaScriptsClient;
  let pedidoproveedoresResource: PedidoproveedoresResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    pedidoproveedoresResource = new PedidoproveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pedidoproveedores URI', () => {
      expect(pedidoproveedoresResource.matchesUri('facturascripts://pedidoproveedores')).toBe(true);
      expect(pedidoproveedoresResource.matchesUri('facturascripts://pedidoproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(pedidoproveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(pedidoproveedoresResource.matchesUri('facturascripts://other')).toBe(false);
      expect(pedidoproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return supplier orders data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{
          idpedido: 1,
          codigo: 'PO001',
          codproveedor: 'PROV001',
          nombre: 'Test Supplier',
          fecha: '2024-01-01',
          total: 100.00
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await pedidoproveedoresResource.getResource('facturascripts://pedidoproveedores?limit=10');

      expect(result.uri).toBe('facturascripts://pedidoproveedores?limit=10');
      expect(result.name).toBe('FacturaScripts Supplier Orders');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pedidoproveedores', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await pedidoproveedoresResource.getResource('facturascripts://pedidoproveedores');

      expect(result.name).toBe('FacturaScripts Supplier Orders (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch pedidoproveedores');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});