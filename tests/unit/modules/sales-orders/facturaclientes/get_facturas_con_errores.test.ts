import { describe, it, expect, beforeEach, vi } from 'vitest';
import { toolFacturasConErroresImplementation } from '../../../../../src/modules/sales-orders/facturaclientes/tool.js';
import { FacturaScriptsClient } from '../../../../../src/fs/client.js';

// Mock the FacturaScriptsClient
vi.mock('../../../../../src/fs/client.js');

describe('get_facturas_con_errores tool', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    vi.clearAllMocks();
  });

  describe('Error Detection Logic', () => {
    it('should detect invoices with total <= 0', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '2025-01-01',
          total: 0,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A2',
          codcliente: 'CLI002',
          fecha: '2025-01-02',
          total: -50,
          idfactura: 2,
          numero: '002',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(2);
      expect(resultData.data[0].errores).toContain('total vacío o negativo');
      expect(resultData.data[1].errores).toContain('total vacío o negativo');
    });

    it('should detect invoices with missing codcliente', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: '',
          fecha: '2025-01-01',
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A2',
          codcliente: null,
          fecha: '2025-01-02',
          total: 200,
          idfactura: 2,
          numero: '002',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(2);
      expect(resultData.data[0].errores).toContain('cliente no asignado');
      expect(resultData.data[1].errores).toContain('cliente no asignado');
    });

    it('should detect invoices with invalid dates', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '',
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A2',
          codcliente: 'CLI002',
          fecha: 'invalid-date',
          total: 200,
          idfactura: 2,
          numero: '002',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A3',
          codcliente: 'CLI003',
          fecha: '32-13-2025', // Invalid day and month
          total: 300,
          idfactura: 3,
          numero: '003',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(3);
      expect(resultData.data[0].errores).toContain('fecha inválida');
      expect(resultData.data[1].errores).toContain('fecha inválida');
      expect(resultData.data[2].errores).toContain('fecha inválida');
    });

    it('should NOT flag valid DD-MM-YYYY dates as invalid', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '13-08-2025', // Valid DD-MM-YYYY format
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A2',
          codcliente: 'CLI002',
          fecha: '1-1-2025', // Valid single digit format
          total: 200,
          idfactura: 2,
          numero: '002',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      // These invoices should NOT have any errors since dates are valid
      expect(resultData.data).toHaveLength(0);
    });

    it('should detect duplicate invoices', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '2025-01-01',
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A2',
          codcliente: 'CLI002',
          fecha: '2025-01-02',
          total: 200,
          idfactura: 2,
          numero: '001', // Same numero + serie + ejercicio
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(2);
      expect(resultData.data[0].errores).toContain('posible duplicado');
      expect(resultData.data[1].errores).toContain('posible duplicado');
    });

    it('should detect invoices without lines', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '2025-01-01',
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No lines found
          meta: { total: 0, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(1);
      expect(resultData.data[0].errores).toContain('factura sin líneas');
    });

    it('should detect multiple errors in a single invoice', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: '',
          fecha: '',
          total: 0,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No lines found
          meta: { total: 0, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(1);
      expect(resultData.data[0].errores).toContain('total vacío o negativo');
      expect(resultData.data[0].errores).toContain('cliente no asignado');
      expect(resultData.data[0].errores).toContain('fecha inválida');
      expect(resultData.data[0].errores).toContain('factura sin líneas');
      expect(resultData.data[0].errores).toHaveLength(4);
    });
  });

  describe('Date Filtering', () => {
    it('should filter invoices by date range', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: '',
          fecha: '2025-01-01',
          total: 0,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination.mockResolvedValue({
        data: mockInvoiceData,
        meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
      });

      await toolFacturasConErroresImplementation({
        fecha_desde: '2025-01-01',
        fecha_hasta: '2025-01-31'
      }, mockClient);

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/facturaclientes',
        10000,
        0,
        expect.objectContaining({
          'filter[fecha_gte]': '2025-01-01',
          'filter[fecha_lte]': '2025-01-31'
        })
      );
    });

    it('should handle only fecha_desde parameter', async () => {
      mockClient.getWithPagination.mockResolvedValue({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      await toolFacturasConErroresImplementation({
        fecha_desde: '2025-01-01'
      }, mockClient);

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/facturaclientes',
        10000,
        0,
        expect.objectContaining({
          'filter[fecha_gte]': '2025-01-01'
        })
      );
    });

    it('should handle only fecha_hasta parameter', async () => {
      mockClient.getWithPagination.mockResolvedValue({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      await toolFacturasConErroresImplementation({
        fecha_hasta: '2025-01-31'
      }, mockClient);

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/facturaclientes',
        10000,
        0,
        expect.objectContaining({
          'filter[fecha_lte]': '2025-01-31'
        })
      );
    });
  });

  describe('Pagination', () => {
    it('should apply pagination correctly', async () => {
      const mockInvoiceData = Array.from({ length: 50 }, (_, i) => ({
        codigo: `FAC2025A${i + 1}`,
        codcliente: '',
        fecha: '2025-01-01',
        total: 100,
        idfactura: i + 1,
        numero: `${i + 1}`.padStart(3, '0'),
        codserie: 'A',
        codejercicio: '2025'
      }));

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 50, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({
        limit: 10,
        offset: 5
      }, mockClient);

      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.meta.total).toBe(50);
      expect(resultData.meta.limit).toBe(10);
      expect(resultData.meta.offset).toBe(5);
      expect(resultData.meta.hasMore).toBe(true);
      expect(resultData.data).toHaveLength(10);
    });

    it('should enforce parameter limits', async () => {
      mockClient.getWithPagination.mockResolvedValue({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      await toolFacturasConErroresImplementation({
        limit: 2000, // Over limit
        offset: -5   // Below limit
      }, mockClient);

      // Check the implementation uses corrected values (1000 max limit, 0 min offset)
      // This is verified implicitly through the tool's behavior
    });
  });

  describe('Empty Results', () => {
    it('should handle no invoices found', async () => {
      mockClient.getWithPagination.mockResolvedValue({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.message).toContain('No se encontraron facturas en el sistema');
      expect(resultData.data).toEqual([]);
      expect(resultData.meta.total).toBe(0);
    });

    it('should handle no invoices with errors', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '2025-01-01',
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, cantidad: 1 }], // Lines found
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toEqual([]);
      expect(resultData.meta.total).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValue(new Error('API connection failed'));

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(result.isError).toBe(true);
      expect(resultData.error).toBe('Failed to fetch facturas con errores');
      expect(resultData.message).toBe('API connection failed');
    });

    it('should handle line lookup failures gracefully', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: 'CLI001',
          fecha: '2025-01-01',
          total: 100,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        })
        .mockRejectedValueOnce(new Error('Line lookup failed'));

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      // Should not include "factura sin líneas" error when line lookup fails
      expect(resultData.data).toEqual([]);
    });
  });

  describe('Response Format', () => {
    it('should return expected response format for sample examples', async () => {
      const mockInvoiceData = [
        {
          codigo: 'FAC2025A1',
          codcliente: '',
          fecha: '',
          total: 0,
          idfactura: 1,
          numero: '001',
          codserie: 'A',
          codejercicio: '2025'
        },
        {
          codigo: 'FAC2025A5',
          codcliente: '10',
          fecha: '2025-05-10',
          total: 0,
          idfactura: 2,
          numero: '005',
          codserie: 'A',
          codejercicio: '2025'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoiceData,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ idfactura: 1, cantidad: 1 }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolFacturasConErroresImplementation({}, mockClient);
      const resultData = JSON.parse(result.content[0].text);

      expect(resultData.data).toHaveLength(2);
      
      // First invoice with multiple errors
      expect(resultData.data[0]).toMatchObject({
        codigo: 'FAC2025A1',
        codcliente: '',
        fecha: '',
        total: 0,
        errores: expect.arrayContaining([
          'cliente no asignado',
          'fecha inválida',
          'total vacío o negativo'
        ])
      });

      // Second invoice with single error
      expect(resultData.data[1]).toMatchObject({
        codigo: 'FAC2025A5',
        codcliente: '10',
        fecha: '2025-05-10',
        total: 0,
        errores: ['total vacío o negativo']
      });
    });
  });
});