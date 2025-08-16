import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TarifasResource } from '../../../../src/modules/configuration/tarifas/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('TarifasResource', () => {
  let mockClient: FacturaScriptsClient;
  let tarifasResource: TarifasResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    tarifasResource = new TarifasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://tarifas URI', () => {
      expect(tarifasResource.matchesUri('facturascripts://tarifas')).toBe(true);
      expect(tarifasResource.matchesUri('facturascripts://tarifas?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(tarifasResource.matchesUri('http://example.com')).toBe(false);
      expect(tarifasResource.matchesUri('facturascripts://other')).toBe(false);
      expect(tarifasResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return tarifas data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          codtarifa: 'GENERAL',
          nombre: 'Tarifa General',
          aplicar: 'pvp',
          maxpvp: 1,
          mincoste: 0,
          valorx: 1.21,
          valory: 0.00
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await tarifasResource.getResource('facturascripts://tarifas?limit=10');

      expect(result.uri).toBe('facturascripts://tarifas?limit=10');
      expect(result.name).toBe('FacturaScripts Tariffs/Price Lists');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/tarifas', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await tarifasResource.getResource('facturascripts://tarifas');

      expect(result.name).toBe('FacturaScripts Tariffs/Price Lists (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch tarifas');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});