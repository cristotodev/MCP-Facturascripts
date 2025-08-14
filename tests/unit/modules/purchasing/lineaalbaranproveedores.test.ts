import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaAlbaranProveedoresResource } from '../../../../src/resources/lineaalbaranproveedores.js';
import { LineaAlbaranProveedor } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaAlbaranProveedoresResource', () => {
  let lineaAlbaranProveedoresResource: LineaAlbaranProveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaAlbaranProveedoresResource = new LineaAlbaranProveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineaalbaranproveedores URI', () => {
      expect(lineaAlbaranProveedoresResource.matchesUri('facturascripts://lineaalbaranproveedores')).toBe(true);
      expect(lineaAlbaranProveedoresResource.matchesUri('facturascripts://lineaalbaranproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaAlbaranProveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaAlbaranProveedoresResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaAlbaranProveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaAlbaranProveedores: LineaAlbaranProveedor[] = [
      {
        idlinea: 1,
        idalbaran: 1,
        idproducto: 1,
        descripcion: 'Supplier Product',
        cantidad: 5.0,
        pvpunitario: 8.0,
        pvptotal: 40.0,
        codimpuesto: 'IVA21',
        iva: 21.0
      }
    ];

    it('should return resource with lineaalbaranproveedores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaAlbaranProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaAlbaranProveedoresResource.getResource('facturascripts://lineaalbaranproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineaalbaranproveedores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineaalbaranproveedores');
      expect(result.name).toBe('FacturaScripts LineaAlbaranProveedores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaAlbaranProveedoresResource.getResource('facturascripts://lineaalbaranproveedores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineaalbaranproveedores', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaAlbaranProveedoresResource.getResource('facturascripts://lineaalbaranproveedores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaAlbaranProveedores (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineaalbaranproveedores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});