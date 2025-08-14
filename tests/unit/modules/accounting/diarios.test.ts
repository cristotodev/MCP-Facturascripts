import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiariosResource } from '../../../../src/resources/diarios.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

const mockClient = {
  getWithPagination: vi.fn(),
} as any;

describe('DiariosResource', () => {
  let resource: DiariosResource;

  beforeEach(() => {
    resource = new DiariosResource(mockClient);
    vi.clearAllMocks();
  });

  describe('matchesUri', () => {
    it('should return true for valid diarios URI', () => {
      const result = resource.matchesUri('facturascripts://diarios');
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
      const mockData = [{ coddiario: 'DIA001', descripcion: 'General Journal' }];
      const mockResponse = { data: mockData, meta: { total: 1, hasMore: false } };
      mockClient.getWithPagination.mockResolvedValueOnce(mockResponse);

      const result = await resource.getResource('facturascripts://diarios');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/diarios', 50, 0, {});
      expect(result.name).toBe('FacturaScripts Diarios');
      expect(result.mimeType).toBe('application/json');
      expect(JSON.parse(result.contents[0].text)).toEqual(mockResponse);
    });

    it('should handle custom parameters', async () => {
      const mockResponse = { data: [], meta: { total: 0, hasMore: false } };
      mockClient.getWithPagination.mockResolvedValueOnce(mockResponse);

      await resource.getResource('facturascripts://diarios?limit=10&offset=5&filter=activo:1&order=descripcion:asc');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/diarios', 10, 5, {
        'filter[activo]': '1',
        'sort[descripcion]': 'ASC'
      });
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValueOnce(new Error(errorMessage));

      const result = await resource.getResource('facturascripts://diarios');
      
      expect(result.name).toBe('FacturaScripts Diarios (Error)');
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch diarios');
      expect(content.message).toBe(errorMessage);
    });
  });
});