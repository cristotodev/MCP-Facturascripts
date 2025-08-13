import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GrupoClientesResource } from '../../../src/resources/grupoclientes.js';
import { GrupoClientes } from '../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('../../../src/fs/client.js');

describe('GrupoClientesResource', () => {
  let grupoClientesResource: GrupoClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    grupoClientesResource = new GrupoClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://grupoclientes URI', () => {
      expect(grupoClientesResource.matchesUri('facturascripts://grupoclientes')).toBe(true);
      expect(grupoClientesResource.matchesUri('facturascripts://grupoclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(grupoClientesResource.matchesUri('http://example.com')).toBe(false);
      expect(grupoClientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(grupoClientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockGrupoClientes: GrupoClientes[] = [
      {
        codgrupo: 'RETAIL',
        nombre: 'Clientes Minoristas',
        codsubcuenta: '430000',
        codtarifa: 'GENERAL'
      }
    ];

    it('should return resource with grupoclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockGrupoClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await grupoClientesResource.getResource('facturascripts://grupoclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/grupoclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://grupoclientes');
      expect(result.name).toBe('FacturaScripts GrupoClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await grupoClientesResource.getResource('facturascripts://grupoclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/grupoclientes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await grupoClientesResource.getResource('facturascripts://grupoclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts GrupoClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch grupoclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});