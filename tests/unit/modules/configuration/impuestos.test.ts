import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImpuestosResource } from '../../../../src/resources/impuestos.js';
import { Impuesto } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('ImpuestosResource', () => {
  let impuestosResource: ImpuestosResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    impuestosResource = new ImpuestosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://impuestos URI', () => {
      expect(impuestosResource.matchesUri('facturascripts://impuestos')).toBe(true);
      expect(impuestosResource.matchesUri('facturascripts://impuestos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(impuestosResource.matchesUri('http://example.com')).toBe(false);
      expect(impuestosResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(impuestosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockImpuestos: Impuesto[] = [
      {
        codimpuesto: 'IVA21',
        descripcion: 'IVA General 21%',
        activo: 1,
        iva: 21.00,
        tipo: 1
      }
    ];

    it('should return resource with impuestos data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockImpuestos
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await impuestosResource.getResource('facturascripts://impuestos');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/impuestos', 50, 0, {});
      expect(result.uri).toBe('facturascripts://impuestos');
      expect(result.name).toBe('FacturaScripts Impuestos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await impuestosResource.getResource('facturascripts://impuestos?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/impuestos', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await impuestosResource.getResource('facturascripts://impuestos?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Impuestos (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch impuestos');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});