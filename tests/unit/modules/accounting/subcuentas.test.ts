import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SubcuentasResource } from '../../../../src/modules/accounting/subcuentas/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('SubcuentasResource', () => {
  let mockClient: FacturaScriptsClient;
  let subcuentasResource: SubcuentasResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    subcuentasResource = new SubcuentasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://subcuentas URI', () => {
      expect(subcuentasResource.matchesUri('facturascripts://subcuentas')).toBe(true);
      expect(subcuentasResource.matchesUri('facturascripts://subcuentas?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(subcuentasResource.matchesUri('http://example.com')).toBe(false);
      expect(subcuentasResource.matchesUri('facturascripts://other')).toBe(false);
      expect(subcuentasResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return subcuentas data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 10, offset: 0, hasMore: false },
        data: [{
          idsubcuenta: 1,
          codsubcuenta: '430000001',
          codcuenta: '430000',
          codejercicio: '2024',
          descripcion: 'Cliente ejemplo S.L.',
          debe: 1500.00,
          haber: 1200.00,
          saldo: 300.00,
          idcuenta: 100,
          codcuentaesp: null
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await subcuentasResource.getResource('facturascripts://subcuentas?limit=10');

      expect(result.uri).toBe('facturascripts://subcuentas?limit=10');
      expect(result.name).toBe('FacturaScripts Sub-accounts');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/subcuentas', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await subcuentasResource.getResource('facturascripts://subcuentas');

      expect(result.name).toBe('FacturaScripts Sub-accounts (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch subcuentas');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});