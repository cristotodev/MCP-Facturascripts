import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProveedoresResource } from '../../../../src/resources/proveedores.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import type { Proveedor } from '../../../../src/types/facturascripts.js';

// Mock the FacturaScriptsClient
vi.mock('../../../../src/fs/client.js');

describe('ProveedoresResource', () => {
  let mockClient: FacturaScriptsClient;
  let proveedoresResource: ProveedoresResource;

  beforeEach(() => {
    mockClient = new FacturaScriptsClient();
    proveedoresResource = new ProveedoresResource(mockClient);
    vi.clearAllMocks();
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://proveedores URIs', () => {
      expect(proveedoresResource.matchesUri('facturascripts://proveedores')).toBe(true);
      expect(proveedoresResource.matchesUri('facturascripts://proveedores?limit=10')).toBe(true);
      expect(proveedoresResource.matchesUri('facturascripts://proveedores?limit=10&offset=20')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(proveedoresResource.matchesUri('facturascripts://clientes')).toBe(false);
      expect(proveedoresResource.matchesUri('https://example.com')).toBe(false);
      expect(proveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockProveedores: Proveedor[] = [
      {
        codproveedor: 'PROV001',
        nombre: 'Proveedor Test 1',
        razonsocial: 'Test Provider S.L.',
        cifnif: '12345678A',
        telefono1: '123456789',
        email: 'test1@provider.com',
        activo: true,
        fechaalta: '2024-01-15',
      },
      {
        codproveedor: 'PROV002',
        nombre: 'Proveedor Test 2',
        razonsocial: 'Another Provider S.A.',
        cifnif: '87654321B',
        telefono1: '987654321',
        email: 'test2@provider.com',
        activo: true,
        fechaalta: '2024-02-20',
      },
    ];

    const mockPaginatedResponse = {
      meta: {
        total: 2,
        limit: 50,
        offset: 0,
        hasMore: false,
      },
      data: mockProveedores,
    };

    it('should return proveedores data with default pagination', async () => {
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockPaginatedResponse);

      const result = await proveedoresResource.getResource('facturascripts://proveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/proveedores', 50, 0, {});
      expect(result).toEqual({
        uri: 'facturascripts://proveedores',
        name: 'FacturaScripts Proveedores',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify(mockPaginatedResponse, null, 2),
            uri: 'facturascripts://proveedores',
          },
        ],
      });
    });

    it('should parse and use limit and offset from URI', async () => {
      vi.mocked(mockClient.getWithPagination).mockResolvedValue({
        ...mockPaginatedResponse,
        meta: { ...mockPaginatedResponse.meta, limit: 10, offset: 20 },
      });

      const result = await proveedoresResource.getResource('facturascripts://proveedores?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/proveedores', 10, 20, {});
      expect(result.contents[0].text).toContain('"limit": 10');
      expect(result.contents[0].text).toContain('"offset": 20');
    });

    it('should handle invalid limit and offset parameters', async () => {
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockPaginatedResponse);

      await proveedoresResource.getResource('facturascripts://proveedores?limit=invalid&offset=also-invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/proveedores', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API connection failed';
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error(errorMessage));

      const result = await proveedoresResource.getResource('facturascripts://proveedores');

      expect(result.name).toBe('FacturaScripts Proveedores (Error)');
      expect(result.contents[0].text).toContain('Failed to fetch proveedores');
      expect(result.contents[0].text).toContain(errorMessage);
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue('String error');

      const result = await proveedoresResource.getResource('facturascripts://proveedores');

      expect(result.name).toBe('FacturaScripts Proveedores (Error)');
      expect(result.contents[0].text).toContain('Unknown error');
    });
  });
});