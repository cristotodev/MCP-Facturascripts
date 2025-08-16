import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PagoclientesResource } from '../../../../src/modules/finance/pagoclientes/resource.js';
import { PagoCliente } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('PagoclientesResource', () => {
  let pagoclientesResource: PagoclientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    pagoclientesResource = new PagoclientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://pagoclientes URI', () => {
      expect(pagoclientesResource.matchesUri('facturascripts://pagoclientes')).toBe(true);
      expect(pagoclientesResource.matchesUri('facturascripts://pagoclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(pagoclientesResource.matchesUri('http://example.com')).toBe(false);
      expect(pagoclientesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(pagoclientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPagosClientes: PagoCliente[] = [
      {
        codpago: 'TRANS001',
        customid: 'CUSTOM123',
        customstatus: 'completed',
        fecha: '2025-08-12',
        gastos: 5.00,
        hora: '2025-08-12 18:49:13',
        idasiento: 1,
        idpago: 1,
        idrecibo: 1,
        importe: 123.45,
        nick: 'admin'
      }
    ];

    it('should return resource with customer payments data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPagosClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await pagoclientesResource.getResource('facturascripts://pagoclientes');

      expect(result.name).toBe('FacturaScripts Customer Payments');
      expect(result.mimeType).toBe('application/json');
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/pagoclientes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await pagoclientesResource.getResource('facturascripts://pagoclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Customer Payments (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch pagoclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await pagoclientesResource.getResource('facturascripts://pagoclientes');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});