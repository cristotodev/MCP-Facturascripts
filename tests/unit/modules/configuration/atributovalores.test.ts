import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AtributovaloresResource } from '../../../../src/modules/configuration/atributovalores/resource.js';
import { AtributoValor } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AtributovaloresResource', () => {
  let atributoValoresResource: AtributovaloresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    atributoValoresResource = new AtributovaloresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://atributovalores URI', () => {
      expect(atributoValoresResource.matchesUri('facturascripts://atributovalores')).toBe(true);
      expect(atributoValoresResource.matchesUri('facturascripts://atributovalores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(atributoValoresResource.matchesUri('http://example.com')).toBe(false);
      expect(atributoValoresResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(atributoValoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAtributoValores: AtributoValor[] = [
      {
        codatributo: 'COLOR',
        descripcion: 'Color rojo vibrante',
        id: 1,
        valor: 'Rojo',
        orden: 1
      }
    ];

    it('should return resource with atributovalores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAtributoValores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await atributoValoresResource.getResource('facturascripts://atributovalores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/atributovalores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://atributovalores');
      expect(result.name).toBe('FacturaScripts Atributovalores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await atributoValoresResource.getResource('facturascripts://atributovalores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/atributovalores', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await atributoValoresResource.getResource('facturascripts://atributovalores?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Atributovalores (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch atributovalores');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});