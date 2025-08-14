import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AsientosResource } from '../../../../src/resources/asientos.js';
import { Asiento } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AsientosResource', () => {
  let asientosResource: AsientosResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    asientosResource = new AsientosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://asientos URI', () => {
      expect(asientosResource.matchesUri('facturascripts://asientos')).toBe(true);
      expect(asientosResource.matchesUri('facturascripts://asientos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(asientosResource.matchesUri('http://example.com')).toBe(false);
      expect(asientosResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(asientosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAsientos: Asiento[] = [
      {
        canal: 1,
        codejercicio: '2025',
        concepto: 'Test Entry',
        documento: 'DOC001',
        editable: 1,
        fecha: '2025-08-12',
        idasiento: 1,
        iddiario: 1,
        idempresa: 1,
        importe: 123.45,
        numero: 1,
        operacion: 'Test Operation'
      }
    ];

    it('should return resource with accounting entries data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAsientos
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await asientosResource.getResource('facturascripts://asientos');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/asientos', 50, 0, {});
      expect(result.uri).toBe('facturascripts://asientos');
      expect(result.name).toBe('FacturaScripts Accounting Entries');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await asientosResource.getResource('facturascripts://asientos?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/asientos', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await asientosResource.getResource('facturascripts://asientos?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Accounting Entries (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch asientos');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});