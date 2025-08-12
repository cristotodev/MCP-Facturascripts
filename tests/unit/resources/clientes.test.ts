import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClientesResource, Cliente } from '../../../src/resources/clientes.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('../../../src/fs/client.js');

describe('ClientesResource', () => {
  let clientesResource: ClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    clientesResource = new ClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://clientes URI', () => {
      expect(clientesResource.matchesUri('facturascripts://clientes')).toBe(true);
      expect(clientesResource.matchesUri('facturascripts://clientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(clientesResource.matchesUri('http://example.com')).toBe(false);
      expect(clientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(clientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockClientes: Cliente[] = [
      {
        codcliente: '001',
        nombre: 'Test Client',
        razonsocial: 'Test Company',
        cifnif: '12345678A',
        telefono1: '123456789',
        email: 'test@example.com',
        fechaalta: '2024-01-01',
        activo: true
      }
    ];

    it('should return resource with clientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await clientesResource.getResource('facturascripts://clientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/clientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://clientes');
      expect(result.name).toBe('FacturaScripts Clientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await clientesResource.getResource('facturascripts://clientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/clientes', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await clientesResource.getResource('facturascripts://clientes?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/clientes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await clientesResource.getResource('facturascripts://clientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts Clientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch clientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('String error');

      const result = await clientesResource.getResource('facturascripts://clientes');

      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.message).toBe('Unknown error');
    });
  });
});