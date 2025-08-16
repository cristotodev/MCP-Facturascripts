import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RetencionesResource } from '../../../../src/modules/configuration/retenciones/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('RetencionesResource', () => {
  let mockClient: FacturaScriptsClient;
  let retencionesResource: RetencionesResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    retencionesResource = new RetencionesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://retenciones URI', () => {
      expect(retencionesResource.matchesUri('facturascripts://retenciones')).toBe(true);
      expect(retencionesResource.matchesUri('facturascripts://retenciones?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(retencionesResource.matchesUri('http://example.com')).toBe(false);
      expect(retencionesResource.matchesUri('facturascripts://other')).toBe(false);
      expect(retencionesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return retenciones data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          codretencion: 'IRPF15',
          descripcion: 'IRPF 15% Profesionales',
          porcentaje: 15.00,
          activa: 1,
          codsubcuentaret: '473000',
          codsubcuentaacr: '477000'
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await retencionesResource.getResource('facturascripts://retenciones?limit=10');

      expect(result.uri).toBe('facturascripts://retenciones?limit=10');
      expect(result.name).toBe('FacturaScripts Retentions/Withholdings');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/retenciones', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await retencionesResource.getResource('facturascripts://retenciones');

      expect(result.name).toBe('FacturaScripts Retentions/Withholdings (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch retenciones');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});