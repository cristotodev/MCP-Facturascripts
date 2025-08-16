import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReciboclientesResource } from '../../../../src/modules/finance/reciboclientes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('ReciboclientesResource', () => {
  let mockClient: FacturaScriptsClient;
  let reciboclientesResource: ReciboclientesResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    reciboclientesResource = new ReciboclientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://reciboclientes URI', () => {
      expect(reciboclientesResource.matchesUri('facturascripts://reciboclientes')).toBe(true);
      expect(reciboclientesResource.matchesUri('facturascripts://reciboclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(reciboclientesResource.matchesUri('http://example.com')).toBe(false);
      expect(reciboclientesResource.matchesUri('facturascripts://other')).toBe(false);
      expect(reciboclientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return reciboclientes data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          idrecibo: 1,
          codcliente: 'CLI001',
          codigofactura: 'FAC001',
          idfactura: 1,
          numero: 1,
          fecha: '2025-08-12',
          importe: 100.50,
          vencimiento: '2025-09-12',
          pagado: 1,
          vencido: 0,
          liquidado: 100.50,
          gastos: 0,
          observaciones: 'Recibo de prueba',
          nick: 'admin',
          idempresa: 1,
          coddivisa: 'EUR',
          codpago: 'CONTADO',
          fechapago: '2025-08-12'
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await reciboclientesResource.getResource('facturascripts://reciboclientes?limit=10');

      expect(result.uri).toBe('facturascripts://reciboclientes?limit=10');
      expect(result.name).toBe('FacturaScripts Customer Receipts');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/reciboclientes', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await reciboclientesResource.getResource('facturascripts://reciboclientes');

      expect(result.name).toBe('FacturaScripts Customer Receipts (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch reciboclientes');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});