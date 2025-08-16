import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PagoproveedoresResource } from '../../../../src/modules/finance/pagoproveedores/resource.js';
import { PagoProveedor } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('PagoproveedoresResource', () => {
  let pagoproveedoresResource: PagoproveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    pagoproveedoresResource = new PagoproveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pagoproveedores URI', () => {
      expect(pagoproveedoresResource.matchesUri('facturascripts://pagoproveedores')).toBe(true);
      expect(pagoproveedoresResource.matchesUri('facturascripts://pagoproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(pagoproveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(pagoproveedoresResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(pagoproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPagosProveedores: PagoProveedor[] = [
      {
        codpago: 'TRANS002',
        fecha: '2025-08-12',
        hora: '2025-08-12 18:49:13',
        idasiento: 2,
        idpago: 2,
        idrecibo: 2,
        importe: 456.78,
        nick: 'admin'
      }
    ];

    it('should return resource with supplier payments data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPagosProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await pagoproveedoresResource.getResource('facturascripts://pagoproveedores');

      expect(result.name).toBe('FacturaScripts Supplier Payments');
      expect(result.mimeType).toBe('application/json');
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pagoproveedores', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await pagoproveedoresResource.getResource('facturascripts://pagoproveedores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Supplier Payments (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch pagoproveedores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await pagoproveedoresResource.getResource('facturascripts://pagoproveedores');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});