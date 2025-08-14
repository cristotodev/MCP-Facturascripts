import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImpuestoZonasResource } from '../../../../src/resources/impuestozonas.js';
import { ImpuestoZona } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('ImpuestoZonasResource', () => {
  let impuestoZonasResource: ImpuestoZonasResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    impuestoZonasResource = new ImpuestoZonasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://impuestozonas URI', () => {
      expect(impuestoZonasResource.matchesUri('facturascripts://impuestozonas')).toBe(true);
      expect(impuestoZonasResource.matchesUri('facturascripts://impuestozonas?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(impuestoZonasResource.matchesUri('http://example.com')).toBe(false);
      expect(impuestoZonasResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(impuestoZonasResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockImpuestoZonas: ImpuestoZona[] = [
      {
        id: 1,
        codimpuesto: 'IVA21',
        codimpuestosel: 'IVA21',
        codisopro: 'ESP',
        codpais: 'ES',
        prioridad: 1
      }
    ];

    it('should return resource with impuestozonas data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockImpuestoZonas
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await impuestoZonasResource.getResource('facturascripts://impuestozonas');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/impuestozonas', 50, 0, {});
      expect(result.uri).toBe('facturascripts://impuestozonas');
      expect(result.name).toBe('FacturaScripts ImpuestoZonas');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await impuestoZonasResource.getResource('facturascripts://impuestozonas?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/impuestozonas', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await impuestoZonasResource.getResource('facturascripts://impuestozonas?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts ImpuestoZonas (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch impuestozonas');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});