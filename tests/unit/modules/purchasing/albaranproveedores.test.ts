import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlbaranproveedoresResource, AlbaranProveedor } from '../../../../src/resources/albaranproveedores.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AlbaranproveedoresResource', () => {
  let albaranproveedoresResource: AlbaranproveedoresResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    albaranproveedoresResource = new AlbaranproveedoresResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://albaranproveedores URI', () => {
      expect(albaranproveedoresResource.matchesUri('facturascripts://albaranproveedores')).toBe(true);
      expect(albaranproveedoresResource.matchesUri('facturascripts://albaranproveedores?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(albaranproveedoresResource.matchesUri('http://example.com')).toBe(false);
      expect(albaranproveedoresResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(albaranproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAlbaranProveedores: AlbaranProveedor[] = [
      {
        codigo: 'ALB001',
        codproveedor: 'PROV001',
        nombre: 'Proveedor Test',
        fecha: '2024-01-01',
        total: 123.45,
        totaliva: 25.92,
        neto: 97.53,
        editable: 1
      }
    ];

    it('should return resource with albaranproveedores data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAlbaranProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await albaranproveedoresResource.getResource('facturascripts://albaranproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/albaranproveedores', 50, 0, {});
      expect(result.uri).toBe('facturascripts://albaranproveedores');
      expect(result.name).toBe('FacturaScripts AlbaranProveedores');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 25, offset: 10, hasMore: false },
        data: mockAlbaranProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await albaranproveedoresResource.getResource('facturascripts://albaranproveedores?limit=25&offset=10');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/albaranproveedores', 25, 10, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAlbaranProveedores
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await albaranproveedoresResource.getResource('facturascripts://albaranproveedores?limit=invalid&offset=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/albaranproveedores', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValue(new Error(errorMessage));

      const result = await albaranproveedoresResource.getResource('facturascripts://albaranproveedores');

      expect(result.name).toBe('FacturaScripts AlbaranProveedores (Error)');
      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.error).toBe('Failed to fetch albaranproveedores');
      expect(errorData.message).toBe(errorMessage);
      expect(errorData.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error');

      const result = await albaranproveedoresResource.getResource('facturascripts://albaranproveedores');

      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.message).toBe('Unknown error');
    });
  });
});