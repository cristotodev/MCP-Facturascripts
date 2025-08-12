import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PresupuestoclientesResource, PresupuestoCliente } from '../../../src/resources/presupuestoclientes.js';
import { FacturaScriptsClient } from '../../../src/facturascripts/client.js';

vi.mock('../../../src/facturascripts/client.js');

describe('PresupuestoclientesResource', () => {
  let presupuestoclientesResource: PresupuestoclientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    presupuestoclientesResource = new PresupuestoclientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://presupuestoclientes URI', () => {
      expect(presupuestoclientesResource.matchesUri('facturascripts://presupuestoclientes')).toBe(true);
      expect(presupuestoclientesResource.matchesUri('facturascripts://presupuestoclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(presupuestoclientesResource.matchesUri('http://example.com')).toBe(false);
      expect(presupuestoclientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(presupuestoclientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockPresupuestoclientes: PresupuestoCliente[] = [
      {
        codigo: 'PRE001',
        numero: 'P-2024-001',
        codcliente: 'CLI001',
        nombrecliente: 'Cliente Test',
        fecha: '2024-01-15',
        total: 250.50,
        totaliva: 52.61,
        aceptado: false,
        vencimiento: '2024-02-15'
      }
    ];

    it('should return resource with presupuestoclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockPresupuestoclientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await presupuestoclientesResource.getResource('facturascripts://presupuestoclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/presupuestoclientes', 50, 0);
      expect(result.uri).toBe('facturascripts://presupuestoclientes');
      expect(result.name).toBe('FacturaScripts PresupuestoClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await presupuestoclientesResource.getResource('facturascripts://presupuestoclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/presupuestoclientes', 10, 20);
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await presupuestoclientesResource.getResource('facturascripts://presupuestoclientes?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/presupuestoclientes', 50, 0);
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await presupuestoclientesResource.getResource('facturascripts://presupuestoclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts PresupuestoClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch presupuestoclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await presupuestoclientesResource.getResource('facturascripts://presupuestoclientes');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});