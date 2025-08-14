import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormatodocumentosResource } from '../../../../src/modules/configuration/formatodocumentos/resource.js';
import { FormatoDocumento } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('FormatodocumentosResource', () => {
  let formatoDocumentosResource: FormatodocumentosResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    formatoDocumentosResource = new FormatodocumentosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://formatodocumentos URI', () => {
      expect(formatoDocumentosResource.matchesUri('facturascripts://formatodocumentos')).toBe(true);
      expect(formatoDocumentosResource.matchesUri('facturascripts://formatodocumentos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(formatoDocumentosResource.matchesUri('http://example.com')).toBe(false);
      expect(formatoDocumentosResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(formatoDocumentosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockFormatoDocumentos: FormatoDocumento[] = [
      {
        id: 1,
        nombre: 'Formato Factura',
        tipodoc: 'FacturaCliente',
        autoaplicar: 1,
        idempresa: 1
      }
    ];

    it('should return resource with formatodocumentos data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockFormatoDocumentos
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await formatoDocumentosResource.getResource('facturascripts://formatodocumentos');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/formatodocumentos', 50, 0, {});
      expect(result.uri).toBe('facturascripts://formatodocumentos');
      expect(result.name).toBe('FacturaScripts Formatodocumentos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await formatoDocumentosResource.getResource('facturascripts://formatodocumentos?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/formatodocumentos', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await formatoDocumentosResource.getResource('facturascripts://formatodocumentos?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Formatodocumentos (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch formatodocumentos');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});