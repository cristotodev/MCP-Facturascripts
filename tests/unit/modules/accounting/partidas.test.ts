import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PartidasResource } from '../../../../src/modules/accounting/partidas/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('PartidasResource', () => {
  let mockClient: FacturaScriptsClient;
  let partidasResource: PartidasResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    partidasResource = new PartidasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://partidas URI', () => {
      expect(partidasResource.matchesUri('facturascripts://partidas')).toBe(true);
      expect(partidasResource.matchesUri('facturascripts://partidas?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(partidasResource.matchesUri('http://example.com')).toBe(false);
      expect(partidasResource.matchesUri('facturascripts://other')).toBe(false);
      expect(partidasResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return partidas data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{
          idpartida: 1,
          idasiento: 1,
          concepto: 'Test entry',
          debe: 100.00,
          haber: 0.00
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await partidasResource.getResource('facturascripts://partidas?limit=10');

      expect(result.uri).toBe('facturascripts://partidas?limit=10');
      expect(result.name).toBe('FacturaScripts Accounting Entry Lines');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/partidas', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await partidasResource.getResource('facturascripts://partidas');

      expect(result.name).toBe('FacturaScripts Accounting Entry Lines (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch partidas');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});