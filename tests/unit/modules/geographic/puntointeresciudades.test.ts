import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PuntointeresciudadesResource } from '../../../../src/modules/geographic/puntointeresciudades/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('PuntointeresciudadesResource', () => {
  let mockClient: FacturaScriptsClient;
  let puntointeresciudadesResource: PuntointeresciudadesResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    puntointeresciudadesResource = new PuntointeresciudadesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://puntointeresciudades URI', () => {
      expect(puntointeresciudadesResource.matchesUri('facturascripts://puntointeresciudades')).toBe(true);
      expect(puntointeresciudadesResource.matchesUri('facturascripts://puntointeresciudades?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(puntointeresciudadesResource.matchesUri('http://example.com')).toBe(false);
      expect(puntointeresciudadesResource.matchesUri('facturascripts://other')).toBe(false);
      expect(puntointeresciudadesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return puntointeresciudades data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          id: 1,
          name: 'Centro Comercial',
          alias: 'centro_comercial',
          idciudad: 1,
          latitude: 40.4168,
          longitude: -3.7038,
          creation_date: '2025-08-12 18:49:13',
          last_update: '2025-08-12 18:49:13',
          nick: 'admin',
          last_nick: 'admin'
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await puntointeresciudadesResource.getResource('facturascripts://puntointeresciudades?limit=10');

      expect(result.uri).toBe('facturascripts://puntointeresciudades?limit=10');
      expect(result.name).toBe('FacturaScripts City Points of Interest');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/puntointeresciudades', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await puntointeresciudadesResource.getResource('facturascripts://puntointeresciudades');

      expect(result.name).toBe('FacturaScripts City Points of Interest (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch puntointeresciudades');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});