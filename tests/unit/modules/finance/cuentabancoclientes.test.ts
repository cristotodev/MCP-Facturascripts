import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CuentabanccllientesResource } from '../../../../src/modules/finance/cuentabancoclientes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

const mockClient = {
  getWithPagination: vi.fn(),
} as any;

describe('CuentabanccllientesResource', () => {
  let resource: CuentabanccllientesResource;

  beforeEach(() => {
    resource = new CuentabanccllientesResource(mockClient);
    vi.clearAllMocks();
  });

  describe('matchesUri', () => {
    it('should return true for valid cuentabancoclientes URI', () => {
      const result = resource.matchesUri('facturascripts://cuentabancoclientes');
      expect(result).toBe(true);
    });

    it('should return false for invalid URI', () => {
      const result = resource.matchesUri('facturascripts://other');
      expect(result).toBe(false);
    });

    it('should return false for malformed URI', () => {
      const result = resource.matchesUri('invalid-uri');
      expect(result).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should return formatted resource with default parameters', async () => {
      const mockData = [{ codcliente: 'CLI001', iban: 'ES123', descripcion: 'Test account' }];
      const mockResponse = { data: mockData, meta: { total: 1, hasMore: false } };
      mockClient.getWithPagination.mockResolvedValueOnce(mockResponse);

      const result = await resource.getResource('facturascripts://cuentabancoclientes');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/cuentabancoclientes', 50, 0, {});
      expect(result.name).toBe('FacturaScripts CuentaBancoClientes');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockResponse);
    });

    it('should handle custom parameters', async () => {
      const mockResponse = { data: [], meta: { total: 0, hasMore: false } };
      mockClient.getWithPagination.mockResolvedValueOnce(mockResponse);

      await resource.getResource('facturascripts://cuentabancoclientes?limit=10&offset=5&filter=activo:1&order=descripcion:asc');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/cuentabancoclientes', 10, 5, {
        'filter[activo]': '1',
        'sort[descripcion]': 'ASC'
      });
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValueOnce(new Error(errorMessage));

      const result = await resource.getResource('facturascripts://cuentabancoclientes');
      
      expect(result.name).toBe('FacturaScripts CuentaBancoClientes (Error)');
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch cuentabancoclientes');
      expect(content.message).toBe(errorMessage);
    });
  });
});