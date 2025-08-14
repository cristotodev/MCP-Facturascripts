import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacturaproveedoresResource } from '../../../../src/modules/purchasing/facturaproveedores/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import type { FacturaProveedor } from '../../../../src/types/facturascripts.js';

// Mock the FacturaScriptsClient
vi.mock('../../../../src/fs/client.js');

describe('FacturaproveedoresResource', () => {
  let mockClient: FacturaScriptsClient;
  let facturaproveedoresResource: FacturaproveedoresResource;

  beforeEach(() => {
    mockClient = new FacturaScriptsClient();
    facturaproveedoresResource = new FacturaproveedoresResource(mockClient);
    vi.clearAllMocks();
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://facturaproveedores URIs', () => {
      expect(facturaproveedoresResource.matchesUri('facturascripts://facturaproveedores')).toBe(true);
      expect(facturaproveedoresResource.matchesUri('facturascripts://facturaproveedores?limit=10')).toBe(true);
      expect(facturaproveedoresResource.matchesUri('facturascripts://facturaproveedores?limit=10&offset=20')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(facturaproveedoresResource.matchesUri('facturascripts://facturaclientes')).toBe(false);
      expect(facturaproveedoresResource.matchesUri('https://example.com')).toBe(false);
      expect(facturaproveedoresResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockFacturas: FacturaProveedor[] = [
      {
        idfactura: 1,
        codigo: 'FPROV001',
        numproveedor: 'FP-2024-001',
        codproveedor: 'PROV001',
        nombre: 'Proveedor Test S.L.',
        cifnif: '12345678A',
        fecha: '2024-01-15',
        hora: '10:30:00',
        codalmacen: 'ALM001',
        coddivisa: 'EUR',
        tasaconv: 1,
        codpago: 'CONT',
        total: 1210.00,
        totaliva: 210.00,
        totalirpf: 0,
        totalrecargo: 0,
        neto: 1000.00,
        observaciones: 'Factura de prueba',
        fechavencimiento: '2024-02-15',
        pagada: false,
        anulada: false,
        editable: true,
      },
      {
        idfactura: 2,
        codigo: 'FPROV002',
        numproveedor: 'FP-2024-002',
        codproveedor: 'PROV002',
        nombre: 'Otro Proveedor S.A.',
        cifnif: '87654321B',
        fecha: '2024-01-20',
        hora: '14:15:00',
        codalmacen: 'ALM001',
        coddivisa: 'EUR',
        tasaconv: 1,
        codpago: 'TRANS',
        total: 605.00,
        totaliva: 105.00,
        totalirpf: 0,
        totalrecargo: 0,
        neto: 500.00,
        observaciones: 'Segunda factura de prueba',
        fechavencimiento: '2024-02-20',
        pagada: true,
        anulada: false,
        editable: false,
      },
    ];

    const mockPaginatedResponse = {
      meta: {
        total: 2,
        limit: 50,
        offset: 0,
        hasMore: false,
      },
      data: mockFacturas,
    };

    it('should return factura proveedores data with default pagination', async () => {
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockPaginatedResponse);

      const result = await facturaproveedoresResource.getResource('facturascripts://facturaproveedores');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaproveedores', 50, 0, {});
      expect(result).toEqual({
        uri: 'facturascripts://facturaproveedores',
        name: 'FacturaScripts FacturaProveedores',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify(mockPaginatedResponse, null, 2),
            uri: 'facturascripts://facturaproveedores',
          },
        ],
      });
    });

    it('should parse and use limit and offset from URI', async () => {
      vi.mocked(mockClient.getWithPagination).mockResolvedValue({
        ...mockPaginatedResponse,
        meta: { ...mockPaginatedResponse.meta, limit: 20, offset: 5 },
      });

      const result = await facturaproveedoresResource.getResource('facturascripts://facturaproveedores?limit=20&offset=5');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaproveedores', 20, 5, {});
      expect(result.contents[0].text).toContain('"limit": 20');
      expect(result.contents[0].text).toContain('"offset": 5');
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'FacturaProveedores API connection failed';
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error(errorMessage));

      const result = await facturaproveedoresResource.getResource('facturascripts://facturaproveedores');

      expect(result.name).toBe('FacturaScripts FacturaProveedores (Error)');
      expect(result.contents[0].text).toContain('Failed to fetch facturaproveedores');
      expect(result.contents[0].text).toContain(errorMessage);
    });
  });
});