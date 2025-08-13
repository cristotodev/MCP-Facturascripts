import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaAlbaranClientesResource } from '../../../src/resources/lineaalbaranclientes.js';
import { LineaAlbaranCliente } from '../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('../../../src/fs/client.js');

describe('LineaAlbaranClientesResource', () => {
  let lineaAlbaranClientesResource: LineaAlbaranClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaAlbaranClientesResource = new LineaAlbaranClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineaalbaranclientes URI', () => {
      expect(lineaAlbaranClientesResource.matchesUri('facturascripts://lineaalbaranclientes')).toBe(true);
      expect(lineaAlbaranClientesResource.matchesUri('facturascripts://lineaalbaranclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaAlbaranClientesResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaAlbaranClientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaAlbaranClientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaAlbaranClientes: LineaAlbaranCliente[] = [
      {
        idlinea: 1,
        idalbaran: 1,
        idproducto: 1,
        descripcion: 'Test Product',
        cantidad: 2.5,
        pvpunitario: 10.0,
        pvptotal: 25.0,
        codimpuesto: 'IVA21',
        iva: 21.0
      }
    ];

    it('should return resource with lineaalbaranclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaAlbaranClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaAlbaranClientesResource.getResource('facturascripts://lineaalbaranclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineaalbaranclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineaalbaranclientes');
      expect(result.name).toBe('FacturaScripts LineaAlbaranClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaAlbaranClientesResource.getResource('facturascripts://lineaalbaranclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineaalbaranclientes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaAlbaranClientesResource.getResource('facturascripts://lineaalbaranclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaAlbaranClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineaalbaranclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});