import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LineaFacturaClientesResource } from '../../../../src/modules/sales-orders/line-items/lineafacturaclientes/resource.js';
import { LineaFacturaCliente } from '../../../../src/types/facturascripts.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { toolProductosMasVendidosImplementation } from '../../../../src/modules/sales-orders/line-items/lineafacturaclientes/tool.js';

vi.mock('../../../../src/fs/client.js');

describe('LineaFacturaClientesResource', () => {
  let lineaFacturaClientesResource: LineaFacturaClientesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    lineaFacturaClientesResource = new LineaFacturaClientesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://lineafacturaclientes URI', () => {
      expect(lineaFacturaClientesResource.matchesUri('facturascripts://lineafacturaclientes')).toBe(true);
      expect(lineaFacturaClientesResource.matchesUri('facturascripts://lineafacturaclientes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(lineaFacturaClientesResource.matchesUri('http://example.com')).toBe(false);
      expect(lineaFacturaClientesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(lineaFacturaClientesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockLineaFacturaClientes: LineaFacturaCliente[] = [
      {
        idlinea: 1,
        idfactura: 1,
        idproducto: 1,
        descripcion: 'Invoice Product',
        cantidad: 3.0,
        pvpunitario: 15.0,
        pvptotal: 45.0,
        codimpuesto: 'IVA21',
        iva: 21.0,
        coste: 12.0
      }
    ];

    it('should return resource with lineafacturaclientes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockLineaFacturaClientes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await lineaFacturaClientesResource.getResource('facturascripts://lineafacturaclientes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineafacturaclientes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://lineafacturaclientes');
      expect(result.name).toBe('FacturaScripts LineaFacturaClientes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 10, offset: 20, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await lineaFacturaClientesResource.getResource('facturascripts://lineafacturaclientes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/lineafacturaclientes', 10, 20, {});
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('API Error');
      mockClient.getWithPagination.mockRejectedValue(error);

      const result = await lineaFacturaClientesResource.getResource('facturascripts://lineafacturaclientes?limit=10&offset=5');

      expect(result.name).toBe('FacturaScripts LineaFacturaClientes (Error)');
      
      const errorResponse = JSON.parse(result.contents[0].text);
      expect(errorResponse.error).toBe('Failed to fetch lineafacturaclientes');
      expect(errorResponse.message).toBe('API Error');
      expect(errorResponse.meta.limit).toBe(10);
      expect(errorResponse.meta.offset).toBe(5);
      expect(errorResponse.data).toEqual([]);
    });
  });
});

describe('toolProductosMasVendidosImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  const mockInvoices = [
    { idfactura: 1, fecha: '2024-01-15', codcliente: 'CLI001' },
    { idfactura: 2, fecha: '2024-01-20', codcliente: 'CLI002' },
    { idfactura: 3, fecha: '2024-01-25', codcliente: 'CLI001' }
  ];

  const mockLineItems: LineaFacturaCliente[] = [
    {
      idlinea: 1, idfactura: 1, referencia: 'PROD001', descripcion: 'Hosting Básico',
      cantidad: 2, pvptotal: 100.00, pvpunitario: 50.00
    },
    {
      idlinea: 2, idfactura: 1, referencia: 'PROD002', descripcion: 'Dominio .com',
      cantidad: 1, pvptotal: 25.00, pvpunitario: 25.00
    },
    {
      idlinea: 3, idfactura: 2, referencia: 'PROD001', descripcion: 'Hosting Básico',
      cantidad: 3, pvptotal: 150.00, pvpunitario: 50.00
    },
    {
      idlinea: 4, idfactura: 2, referencia: null, descripcion: 'Servicio de Consultoría',
      cantidad: 1, pvptotal: 200.00, pvpunitario: 200.00
    },
    {
      idlinea: 5, idfactura: 3, referencia: 'PROD002', descripcion: 'Dominio .com',
      cantidad: 2, pvptotal: 50.00, pvpunitario: 25.00
    }
  ];

  describe('Success scenarios', () => {
    it('should return best-selling products grouped by referencia', async () => {
      // Mock invoice response
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        })
        // Mock line items responses for each invoice
        .mockResolvedValueOnce({
          data: [mockLineItems[0], mockLineItems[1]],
          meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[2], mockLineItems[3]],
          meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[4]],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        limit: 10,
        offset: 0,
        order: 'cantidad_total:desc'
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);

      expect(result.content[0].type).toBe('text');
      const response = JSON.parse(result.content[0].text);
      
      expect(response.period).toEqual({ fecha_desde: '2024-01-01', fecha_hasta: '2024-01-31' });
      expect(response.meta.total).toBe(3);
      expect(response.data).toHaveLength(3);
      
      // Check aggregation results
      const hostingProduct = response.data.find((p: any) => p.referencia === 'PROD001');
      expect(hostingProduct).toEqual({
        referencia: 'PROD001',
        descripcion: 'Hosting Básico',
        cantidad_total: 5, // 2 + 3
        total_facturado: 250.00 // 100 + 150
      });

      const dominioProduct = response.data.find((p: any) => p.referencia === 'PROD002');
      expect(dominioProduct).toEqual({
        referencia: 'PROD002',
        descripcion: 'Dominio .com',
        cantidad_total: 3, // 1 + 2
        total_facturado: 75.00 // 25 + 50
      });

      const consultoriaProduct = response.data.find((p: any) => p.referencia === null);
      expect(consultoriaProduct).toEqual({
        referencia: null,
        descripcion: 'Servicio de Consultoría',
        cantidad_total: 1,
        total_facturado: 200.00
      });
    });

    it('should sort by total_facturado descending when specified', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[0], mockLineItems[1]],
          meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[2], mockLineItems[3]],
          meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[4]],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        order: 'total_facturado:desc'
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      // Should be sorted by total_facturado descending
      expect(response.data[0].total_facturado).toBe(250.00); // PROD001
      expect(response.data[1].total_facturado).toBe(200.00); // Consultoría
      expect(response.data[2].total_facturado).toBe(75.00);  // PROD002
    });

    it('should apply pagination correctly', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[0], mockLineItems[1]],
          meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[2], mockLineItems[3]],
          meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[4]],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        limit: 2,
        offset: 1
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.meta.total).toBe(3);
      expect(response.meta.limit).toBe(2);
      expect(response.meta.offset).toBe(1);
      expect(response.meta.hasMore).toBe(false);
      expect(response.data).toHaveLength(2); // Skip 1, take 2
    });

    it('should use default values for optional parameters', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[0]],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[2]],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockLineItems[4]],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
        // No limit, offset, or order specified - should use defaults
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.meta.limit).toBe(50); // default limit
      expect(response.meta.offset).toBe(0); // default offset
      // Should be sorted by cantidad_total:desc (default order)
    });
  });

  describe('Error scenarios', () => {
    it('should handle case when no invoices found in period', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 1000, offset: 0, hasMore: false }
      });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.message).toBe('No se encontraron facturas en el período especificado');
      expect(response.meta.total).toBe(0);
      expect(response.data).toEqual([]);
    });

    it('should handle case when invoices have no valid IDs', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [{ idfactura: null }, { idfactura: undefined }],
        meta: { total: 2, limit: 1000, offset: 0, hasMore: false }
      });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      expect(response.message).toBe('No se encontraron IDs de facturas válidos');
      expect(response.meta.total).toBe(0);
      expect(response.data).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockClient.getWithPagination.mockRejectedValueOnce(error);

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);

      expect(result.isError).toBe(true);
      const response = JSON.parse(result.content[0].text);
      expect(response.error).toBe('Failed to fetch productos más vendidos');
      expect(response.message).toBe('Database connection failed');
      expect(response.period).toEqual({ fecha_desde: '2024-01-01', fecha_hasta: '2024-01-31' });
    });

    it('should skip line items without description', async () => {
      const lineItemsWithoutDescription = [
        { idlinea: 1, idfactura: 1, referencia: 'PROD001', descripcion: null, cantidad: 2, pvptotal: 100 },
        { idlinea: 2, idfactura: 1, referencia: 'PROD002', descripcion: '', cantidad: 1, pvptotal: 50 },
        { idlinea: 3, idfactura: 1, referencia: 'PROD003', descripcion: 'Valid Product', cantidad: 3, pvptotal: 150 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [{ idfactura: 1 }],
          meta: { total: 1, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: lineItemsWithoutDescription,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);

      // Should only include the one item with valid description
      expect(response.data).toHaveLength(1);
      expect(response.data[0].descripcion).toBe('Valid Product');
    });
  });

  describe('Parameter validation', () => {
    it('should enforce limit bounds', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [],
          meta: { total: 0, limit: 1000, offset: 0, hasMore: false }
        });

      // Test limit too high
      let args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        limit: 2000 // Should be capped at 1000
      };

      let result = await toolProductosMasVendidosImplementation(args, mockClient);
      let response = JSON.parse(result.content[0].text);
      expect(response.meta.limit).toBe(1000);

      // Test limit too low
      args.limit = 0; // Should be set to 1
      result = await toolProductosMasVendidosImplementation(args, mockClient);
      response = JSON.parse(result.content[0].text);
      expect(response.meta.limit).toBe(1);
    });

    it('should enforce offset bounds', async () => {
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 1000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [],
          meta: { total: 0, limit: 1000, offset: 0, hasMore: false }
        });

      const args = {
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        offset: -10 // Should be set to 0
      };

      const result = await toolProductosMasVendidosImplementation(args, mockClient);
      const response = JSON.parse(result.content[0].text);
      expect(response.meta.offset).toBe(0);
    });
  });
});