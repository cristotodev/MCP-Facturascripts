import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlbaranclientesResource, AlbaranCliente } from '../../../../src/modules/sales-orders/albaranclientes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AlbaranclientesResource', () => {
  let albaranclientesResource: AlbaranclientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    albaranclientesResource = new AlbaranclientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://albaranclientes URI', () => {
      expect(albaranclientesResource.matchesUri('facturascripts://albaranclientes')).toBe(true);
      expect(albaranclientesResource.matchesUri('facturascripts://albaranclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(albaranclientesResource.matchesUri('http://example.com')).toBe(false);
      expect(albaranclientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(albaranclientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAlbaranClientes: AlbaranCliente[] = [
      {
        codigo: 'ALB001',
        codcliente: 'CLI001',
        nombrecliente: 'Cliente Test',
        fecha: '2024-01-01',
        total: 123.45,
        totaliva: 25.92,
        neto: 97.53,
        editable: 1
      }
    ];

    it('should return resource with albaranclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAlbaranClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await albaranclientesResource.getResource('facturascripts://albaranclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/albaranclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://albaranclientes');
      expect(result.name).toBe('FacturaScripts AlbaranClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 10, offset: 20, hasMore: false },
        data: mockAlbaranClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await albaranclientesResource.getResource('facturascripts://albaranclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/albaranclientes', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAlbaranClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await albaranclientesResource.getResource('facturascripts://albaranclientes?limit=invalid&offset=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/albaranclientes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValue(new Error(errorMessage));

      const result = await albaranclientesResource.getResource('facturascripts://albaranclientes');

      expect(result.name).toBe('FacturaScripts AlbaranClientes (Error)');
      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.error).toBe('Failed to fetch albaranclientes');
      expect(errorData.message).toBe(errorMessage);
      expect(errorData.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error');

      const result = await albaranclientesResource.getResource('facturascripts://albaranclientes');

      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.message).toBe('Unknown error');
    });
  });
});