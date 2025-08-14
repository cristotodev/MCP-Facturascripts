import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaFacturaProveedoresResource } from '../../../../src/resources/lineafacturaproveedores.js';
import { LineaFacturaProveedor } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaFacturaProveedoresResource', () => {
  let lineaFacturaProveedoresResource: LineaFacturaProveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaFacturaProveedoresResource = new LineaFacturaProveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineafacturaproveedores URI', () => {
      expect(lineaFacturaProveedoresResource.matchesUri('facturascripts://lineafacturaproveedores')).toBe(true);
      expect(lineaFacturaProveedoresResource.matchesUri('facturascripts://lineafacturaproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaFacturaProveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaFacturaProveedoresResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaFacturaProveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaFacturaProveedores: LineaFacturaProveedor[] = [
      {
        idlinea: 1,
        idfactura: 1,
        idproducto: 1,
        descripcion: 'Supplier Invoice Product',
        cantidad: 10.0,
        pvpunitario: 6.0,
        pvptotal: 60.0,
        codimpuesto: 'IVA21',
        iva: 21.0
      }
    ];

    it('should return resource with lineafacturaproveedores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaFacturaProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaFacturaProveedoresResource.getResource('facturascripts://lineafacturaproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineafacturaproveedores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineafacturaproveedores');
      expect(result.name).toBe('FacturaScripts LineaFacturaProveedores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaFacturaProveedoresResource.getResource('facturascripts://lineafacturaproveedores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineafacturaproveedores', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaFacturaProveedoresResource.getResource('facturascripts://lineafacturaproveedores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaFacturaProveedores (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineafacturaproveedores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});