import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaPresupuestoClientesResource } from '../../../../src/resources/lineapresupuestoclientes.js';
import { LineaPresupuestoCliente } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaPresupuestoClientesResource', () => {
  let lineaPresupuestoClientesResource: LineaPresupuestoClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaPresupuestoClientesResource = new LineaPresupuestoClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineapresupuestoclientes URI', () => {
      expect(lineaPresupuestoClientesResource.matchesUri('facturascripts://lineapresupuestoclientes')).toBe(true);
      expect(lineaPresupuestoClientesResource.matchesUri('facturascripts://lineapresupuestoclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaPresupuestoClientesResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaPresupuestoClientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaPresupuestoClientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaPresupuestoClientes: LineaPresupuestoCliente[] = [
      {
        idlinea: 1,
        idpresupuesto: 1,
        idproducto: 1,
        descripcion: 'Quote Product',
        cantidad: 2.0,
        pvpunitario: 25.0,
        pvptotal: 50.0,
        codimpuesto: 'IVA21',
        iva: 21.0,
        coste: 20.0
      }
    ];

    it('should return resource with lineapresupuestoclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaPresupuestoClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaPresupuestoClientesResource.getResource('facturascripts://lineapresupuestoclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapresupuestoclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineapresupuestoclientes');
      expect(result.name).toBe('FacturaScripts LineaPresupuestoClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaPresupuestoClientesResource.getResource('facturascripts://lineapresupuestoclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineapresupuestoclientes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaPresupuestoClientesResource.getResource('facturascripts://lineapresupuestoclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaPresupuestoClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineapresupuestoclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});