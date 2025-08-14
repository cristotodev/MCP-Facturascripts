import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AtributosResource } from '../../../../src/resources/atributos.js';
import { Atributo } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AtributosResource', () => {
  let atributosResource: AtributosResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    atributosResource = new AtributosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://atributos URI', () => {
      expect(atributosResource.matchesUri('facturascripts://atributos')).toBe(true);
      expect(atributosResource.matchesUri('facturascripts://atributos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(atributosResource.matchesUri('http://example.com')).toBe(false);
      expect(atributosResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(atributosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAtributos: Atributo[] = [
      {
        codatributo: 'COLOR',
        nombre: 'Color del Producto',
        num_selector: 1
      }
    ];

    it('should return resource with atributos data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAtributos
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await atributosResource.getResource('facturascripts://atributos');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/atributos', 50, 0, {});
      expect(result.uri).toBe('facturascripts://atributos');
      expect(result.name).toBe('FacturaScripts Attributes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await atributosResource.getResource('facturascripts://atributos?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/atributos', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await atributosResource.getResource('facturascripts://atributos?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Attributes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch atributos');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});