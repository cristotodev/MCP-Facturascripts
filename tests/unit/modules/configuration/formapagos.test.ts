import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormaPagosResource } from '../../../../src/resources/formapagos.js';
import { FormaPago } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('FormaPagosResource', () => {
  let formaPagosResource: FormaPagosResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    formaPagosResource = new FormaPagosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://formapagos URI', () => {
      expect(formaPagosResource.matchesUri('facturascripts://formapagos')).toBe(true);
      expect(formaPagosResource.matchesUri('facturascripts://formapagos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(formaPagosResource.matchesUri('http://example.com')).toBe(false);
      expect(formaPagosResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(formaPagosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockFormaPagos: FormaPago[] = [
      {
        codpago: 'CONTADO',
        descripcion: 'Pago al contado',
        activa: 1,
        plazovencimiento: 0,
        tipovencimiento: 'days'
      }
    ];

    it('should return resource with formapagos data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockFormaPagos
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await formaPagosResource.getResource('facturascripts://formapagos');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/formapagos', 50, 0, {});
      expect(result.uri).toBe('facturascripts://formapagos');
      expect(result.name).toBe('FacturaScripts FormaPagos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await formaPagosResource.getResource('facturascripts://formapagos?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/formapagos', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await formaPagosResource.getResource('facturascripts://formapagos?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts FormaPagos (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch formapagos');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});