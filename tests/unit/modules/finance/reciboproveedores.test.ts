import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReciboproveedoresResource } from '../../../../src/modules/finance/reciboproveedores/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('ReciboproveedoresResource', () => {
  let mockClient: FacturaScriptsClient;
  let reciboproveedoresResource: ReciboproveedoresResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    reciboproveedoresResource = new ReciboproveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://reciboproveedores URI', () => {
      expect(reciboproveedoresResource.matchesUri('facturascripts://reciboproveedores')).toBe(true);
      expect(reciboproveedoresResource.matchesUri('facturascripts://reciboproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(reciboproveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(reciboproveedoresResource.matchesUri('facturascripts://other')).toBe(false);
      expect(reciboproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return reciboproveedores data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          idrecibo: 1,
          codproveedor: 'PRO001',
          codigofactura: 'FAC001',
          idfactura: 1,
          numero: 1,
          fecha: '2025-08-12',
          importe: 200.75,
          vencimiento: '2025-09-12',
          pagado: 0,
          vencido: 1,
          liquidado: 0,
          observaciones: 'Recibo pendiente',
          nick: 'admin',
          idempresa: 1,
          coddivisa: 'EUR',
          codpago: 'TRANSFERENCIA',
          fechapago: null
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await reciboproveedoresResource.getResource('facturascripts://reciboproveedores?limit=10');

      expect(result.uri).toBe('facturascripts://reciboproveedores?limit=10');
      expect(result.name).toBe('FacturaScripts Supplier Receipts');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/reciboproveedores', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await reciboproveedoresResource.getResource('facturascripts://reciboproveedores');

      expect(result.name).toBe('FacturaScripts Supplier Receipts (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch reciboproveedores');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});