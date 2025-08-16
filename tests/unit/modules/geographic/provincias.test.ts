import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProvinciasResource } from '../../../../src/modules/geographic/provincias/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('ProvinciasResource', () => {
  let mockClient: FacturaScriptsClient;
  let provinciasResource: ProvinciasResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    provinciasResource = new ProvinciasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://provincias URI', () => {
      expect(provinciasResource.matchesUri('facturascripts://provincias')).toBe(true);
      expect(provinciasResource.matchesUri('facturascripts://provincias?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(provinciasResource.matchesUri('http://example.com')).toBe(false);
      expect(provinciasResource.matchesUri('facturascripts://other')).toBe(false);
      expect(provinciasResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return provinces data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          idprovincia: 1,
          provincia: 'Madrid',
          codpais: 'ES',
          codisoprov: '28',
          alias: 'madrid',
          latitude: 40.4168,
          longitude: -3.7038
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await provinciasResource.getResource('facturascripts://provincias?limit=10');

      expect(result.uri).toBe('facturascripts://provincias?limit=10');
      expect(result.name).toBe('FacturaScripts Provinces');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/provincias', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await provinciasResource.getResource('facturascripts://provincias');

      expect(result.name).toBe('FacturaScripts Provinces (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch provincias');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});