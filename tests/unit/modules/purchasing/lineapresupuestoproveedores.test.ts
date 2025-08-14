import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaPresupuestoProveedoresResource } from '../../../../src/modules/sales-orders/line-items/lineapresupuestoproveedores/resource.js';
import { LineaPresupuestoProveedor } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaPresupuestoProveedoresResource', () => {
  let lineaPresupuestoProveedoresResource: LineaPresupuestoProveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaPresupuestoProveedoresResource = new LineaPresupuestoProveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineapresupuestoproveedores URI', () => {
      expect(lineaPresupuestoProveedoresResource.matchesUri('facturascripts://lineapresupuestoproveedores')).toBe(true);
      expect(lineaPresupuestoProveedoresResource.matchesUri('facturascripts://lineapresupuestoproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaPresupuestoProveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaPresupuestoProveedoresResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaPresupuestoProveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaPresupuestoProveedores: LineaPresupuestoProveedor[] = [
      {
        idlinea: 1,
        idpresupuesto: 1,
        idproducto: 1,
        descripcion: 'Supplier Quote Product',
        cantidad: 10.0,
        pvpunitario: 15.0,
        pvptotal: 150.0,
        codimpuesto: 'IVA21',
        iva: 21.0
      }
    ];

    it('should return resource with lineapresupuestoproveedores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaPresupuestoProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaPresupuestoProveedoresResource.getResource('facturascripts://lineapresupuestoproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapresupuestoproveedores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineapresupuestoproveedores');
      expect(result.name).toBe('FacturaScripts LineaPresupuestoProveedores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaPresupuestoProveedoresResource.getResource('facturascripts://lineapresupuestoproveedores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapresupuestoproveedores', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaPresupuestoProveedoresResource.getResource('facturascripts://lineapresupuestoproveedores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaPresupuestoProveedores (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineapresupuestoproveedores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});