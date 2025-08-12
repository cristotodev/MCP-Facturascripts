import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacturaclientesResource, FacturaCliente } from '../../../src/resources/facturaclientes.js';
import { FacturaScriptsClient } from '../../../src/facturascripts/client.js';

vi.mock('../../../src/facturascripts/client.js');

describe('FacturaclientesResource', () => {
  let facturaclientesResource: FacturaclientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    facturaclientesResource = new FacturaclientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://facturaclientes URI', () => {
      expect(facturaclientesResource.matchesUri('facturascripts://facturaclientes')).toBe(true);
      expect(facturaclientesResource.matchesUri('facturascripts://facturaclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(facturaclientesResource.matchesUri('http://example.com')).toBe(false);
      expect(facturaclientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(facturaclientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockFacturaclientes: FacturaCliente[] = [
      {
        codigo: 'FAC001',
        numero: 'F-2024-001',
        codcliente: 'CLI001',
        nombrecliente: 'Cliente Test',
        fecha: '2024-01-15',
        total: 250.50,
        totaliva: 52.61,
        pagada: false,
        vencimiento: '2024-02-15'
      }
    ];

    it('should return resource with facturaclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockFacturaclientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await facturaclientesResource.getResource('facturascripts://facturaclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaclientes', 50, 0);
      expect(result.uri).toBe('facturascripts://facturaclientes');
      expect(result.name).toBe('FacturaScripts FacturaClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await facturaclientesResource.getResource('facturascripts://facturaclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaclientes', 10, 20);
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await facturaclientesResource.getResource('facturascripts://facturaclientes?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaclientes', 50, 0);
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await facturaclientesResource.getResource('facturascripts://facturaclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts FacturaClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch facturaclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await facturaclientesResource.getResource('facturascripts://facturaclientes');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});