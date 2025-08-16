import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SeriesResource } from '../../../../src/modules/configuration/series/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('SeriesResource', () => {
  let mockClient: FacturaScriptsClient;
  let seriesResource: SeriesResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    seriesResource = new SeriesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://series URI', () => {
      expect(seriesResource.matchesUri('facturascripts://series')).toBe(true);
      expect(seriesResource.matchesUri('facturascripts://series?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(seriesResource.matchesUri('http://example.com')).toBe(false);
      expect(seriesResource.matchesUri('facturascripts://other')).toBe(false);
      expect(seriesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return series data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          codserie: 'A',
          descripcion: 'Serie A - General',
          canal: 1,
          iddiario: 1,
          siniva: 0,
          tipo: 'venta'
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await seriesResource.getResource('facturascripts://series?limit=10');

      expect(result.uri).toBe('facturascripts://series?limit=10');
      expect(result.name).toBe('FacturaScripts Series');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/series', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await seriesResource.getResource('facturascripts://series');

      expect(result.name).toBe('FacturaScripts Series (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch series');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});