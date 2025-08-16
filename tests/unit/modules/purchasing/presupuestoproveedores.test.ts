import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PresupuestoproveedoresResource } from '../../../../src/modules/purchasing/presupuestoproveedores/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('PresupuestoproveedoresResource', () => {
  let mockClient: FacturaScriptsClient;
  let presupuestoproveedoresResource: PresupuestoproveedoresResource;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as any;
    presupuestoproveedoresResource = new PresupuestoproveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://presupuestoproveedores URI', () => {
      expect(presupuestoproveedoresResource.matchesUri('facturascripts://presupuestoproveedores')).toBe(true);
      expect(presupuestoproveedoresResource.matchesUri('facturascripts://presupuestoproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(presupuestoproveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(presupuestoproveedoresResource.matchesUri('facturascripts://other')).toBe(false);
      expect(presupuestoproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return supplier quotes data on success', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{
          idpresupuesto: 1,
          codigo: 'Q001',
          codproveedor: 'PROV001',
          nombre: 'Test Supplier',
          fecha: '2024-01-01',
          total: 150.00
        }]
      };

      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);

      const result = await presupuestoproveedoresResource.getResource('facturascripts://presupuestoproveedores?limit=10');

      expect(result.uri).toBe('facturascripts://presupuestoproveedores?limit=10');
      expect(result.name).toBe('FacturaScripts Supplier Quotes');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/presupuestoproveedores', 10, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API connection failed'));

      const result = await presupuestoproveedoresResource.getResource('facturascripts://presupuestoproveedores');

      expect(result.name).toBe('FacturaScripts Supplier Quotes (Error)');
      const parsedContent = JSON.parse(result.contents[0].text);
      expect(parsedContent.error).toBe('Failed to fetch presupuestoproveedores');
      expect(parsedContent.message).toBe('API connection failed');
    });
  });
});