import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SecuenciadocumentosResource } from '../../../../src/modules/configuration/secuenciadocumentos/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('SecuenciadocumentosResource', () => {
  let mockClient: FacturaScriptsClient;
  let secuenciadocumentosResource: SecuenciadocumentosResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    secuenciadocumentosResource = new SecuenciadocumentosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://secuenciadocumentos URI', () => {
      expect(secuenciadocumentosResource.matchesUri('facturascripts://secuenciadocumentos')).toBe(true);
      expect(secuenciadocumentosResource.matchesUri('facturascripts://secuenciadocumentos?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(secuenciadocumentosResource.matchesUri('http://example.com')).toBe(false);
      expect(secuenciadocumentosResource.matchesUri('facturascripts://other')).toBe(false);
      expect(secuenciadocumentosResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return secuenciadocumentos data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          idsecuencia: 1,
          codejercicio: '2024',
          codserie: 'A',
          idempresa: 1,
          inicio: 1,
          longnumero: 6,
          numero: 100,
          patron: '{EJE}{SERIE}{NUM}',
          tipodoc: 'FacturaCliente',
          usarhuecos: 1
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await secuenciadocumentosResource.getResource('facturascripts://secuenciadocumentos?limit=10');

      expect(result.uri).toBe('facturascripts://secuenciadocumentos?limit=10');
      expect(result.name).toBe('FacturaScripts Document Sequences');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/secuenciadocumentos', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await secuenciadocumentosResource.getResource('facturascripts://secuenciadocumentos');

      expect(result.name).toBe('FacturaScripts Document Sequences (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch secuenciadocumentos');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});