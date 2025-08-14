import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentificadorFiscalesResource } from '../../../../src/resources/identificadorfiscales.js';
import { IdentificadorFiscal } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('IdentificadorFiscalesResource', () => {
  let identificadorFiscalesResource: IdentificadorFiscalesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    identificadorFiscalesResource = new IdentificadorFiscalesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://identificadorfiscales URI', () => {
      expect(identificadorFiscalesResource.matchesUri('facturascripts://identificadorfiscales')).toBe(true);
      expect(identificadorFiscalesResource.matchesUri('facturascripts://identificadorfiscales?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(identificadorFiscalesResource.matchesUri('http://example.com')).toBe(false);
      expect(identificadorFiscalesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(identificadorFiscalesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockIdentificadorFiscales: IdentificadorFiscal[] = [
      {
        codeid: 'NIF',
        tipoidfiscal: 'Número de Identificación Fiscal',
        validar: 1
      }
    ];

    it('should return resource with identificadorfiscales data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockIdentificadorFiscales
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await identificadorFiscalesResource.getResource('facturascripts://identificadorfiscales');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/identificadorfiscales', 50, 0, {});
      expect(result.uri).toBe('facturascripts://identificadorfiscales');
      expect(result.name).toBe('FacturaScripts IdentificadorFiscales');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await identificadorFiscalesResource.getResource('facturascripts://identificadorfiscales?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/identificadorfiscales', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await identificadorFiscalesResource.getResource('facturascripts://identificadorfiscales?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts IdentificadorFiscales (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch identificadorfiscales');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});