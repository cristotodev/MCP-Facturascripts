import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CiudadesResource } from '../../../../src/modules/geographic/ciudades/resource.js';
import { Ciudad } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('CiudadesResource', () => {
  let ciudadesResource: CiudadesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    ciudadesResource = new CiudadesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://ciudades URI', () => {
      expect(ciudadesResource.matchesUri('facturascripts://ciudades')).toBe(true);
      expect(ciudadesResource.matchesUri('facturascripts://ciudades?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(ciudadesResource.matchesUri('http://example.com')).toBe(false);
      expect(ciudadesResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(ciudadesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockCiudades: Ciudad[] = [
      {
        alias: 'Mad',
        ciudad: 'Madrid',
        creation_date: '2025-08-12 18:49:13',
        codeid: 'MAD001',
        idciudad: 1,
        idprovincia: 1,
        last_nick: 'admin',
        last_update: '2025-08-12 18:49:13',
        latitude: 40.4168,
        longitude: -3.7038,
        nick: 'admin'
      }
    ];

    it('should return resource with ciudades data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockCiudades
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await ciudadesResource.getResource('facturascripts://ciudades');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/ciudades', 50, 0, {});
      expect(result.uri).toBe('facturascripts://ciudades');
      expect(result.name).toBe('FacturaScripts Ciudades');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await ciudadesResource.getResource('facturascripts://ciudades?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/ciudades', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await ciudadesResource.getResource('facturascripts://ciudades?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Ciudades (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch ciudades');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});