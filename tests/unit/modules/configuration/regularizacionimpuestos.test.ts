import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegularizacionimpuestosResource } from '../../../../src/modules/configuration/regularizacionimpuestos/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('RegularizacionimpuestosResource', () => {
  let mockClient: FacturaScriptsClient;
  let regularizacionimpuestosResource: RegularizacionimpuestosResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    regularizacionimpuestosResource = new RegularizacionimpuestosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://regularizacionimpuestos URI', () => {
      expect(regularizacionimpuestosResource.matchesUri('facturascripts://regularizacionimpuestos')).toBe(true);
      expect(regularizacionimpuestosResource.matchesUri('facturascripts://regularizacionimpuestos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(regularizacionimpuestosResource.matchesUri('http://example.com')).toBe(false);
      expect(regularizacionimpuestosResource.matchesUri('facturascripts://other')).toBe(false);
      expect(regularizacionimpuestosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return regularizacionimpuestos data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          idregiva: 1,
          codejercicio: '2024',
          periodo: '01',
          fechainicio: '2024-01-01',
          fechafin: '2024-01-31',
          fechaasiento: '2024-02-01',
          idasiento: 100,
          idempresa: 1,
          bloquear: 0,
          codsubcuentaacr: '477000',
          codsubcuentadeu: '472000',
          idsubcuentaacr: 1001,
          idsubcuentadeu: 1002
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await regularizacionimpuestosResource.getResource('facturascripts://regularizacionimpuestos?limit=10');

      expect(result.uri).toBe('facturascripts://regularizacionimpuestos?limit=10');
      expect(result.name).toBe('FacturaScripts Tax Regularizations');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/regularizacionimpuestos', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await regularizacionimpuestosResource.getResource('facturascripts://regularizacionimpuestos');

      expect(result.name).toBe('FacturaScripts Tax Regularizations (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch regularizacionimpuestos');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});