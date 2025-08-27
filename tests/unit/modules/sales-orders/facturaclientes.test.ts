import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacturaclientesResource, FacturaCliente } from '../../../../src/modules/sales-orders/facturaclientes/resource.js';
import { toolByCifnifImplementation, toolClientesMorososImplementation, toolClientesTopFacturacionImplementation, toolClientesSinComprasImplementation, toolClientesFrecuenciaComprasImplementation, toolClientesPerdidosImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

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

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaclientes', 50, 0, {});
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

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaclientes', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 0, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await facturaclientesResource.getResource('facturascripts://facturaclientes?limit=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/facturaclientes', 50, 0, {});
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

describe('toolByCifnifImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('successful scenarios', () => {
    it('should find client by CIF/NIF and return their invoices', async () => {
      const mockClientData = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        nombre: 'Test Client',
        razonsocial: 'Test Client S.L.'
      };

      const mockInvoices = [
        {
          codigo: 'FAC001',
          codcliente: 'CLI001',
          nombrecliente: 'Test Client',
          fecha: '2024-01-15',
          total: 100.50,
          pagada: false
        },
        {
          codigo: 'FAC002',
          codcliente: 'CLI001',
          nombrecliente: 'Test Client',
          fecha: '2024-02-10',
          total: 250.00,
          pagada: true
        }
      ];

      // Mock client search response
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        // Mock invoices response
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 2, limit: 50, offset: 0, hasMore: false }
        });

      const result = await toolByCifnifImplementation(
        { cifnif: '12345678A' },
        mockClient
      );

      // Verify client search was called correctly
      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        1,
        '/clientes',
        1,
        0,
        { 'filter[cifnif]': '12345678A' }
      );

      // Verify invoice search was called correctly
      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        2,
        '/facturaclientes',
        50,
        0,
        { 'filter[codcliente]': 'CLI001' }
      );

      // Verify response structure
      expect(result.content[0].type).toBe('text');
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.clientInfo).toEqual({
        cifnif: '12345678A',
        codcliente: 'CLI001',
        nombre: 'Test Client'
      });
      expect(parsedResult.invoices.data).toEqual(mockInvoices);
      expect(parsedResult.invoices.meta.total).toBe(2);
    });

    it('should handle custom pagination parameters', async () => {
      const mockClientData = {
        codcliente: 'CLI002',
        cifnif: '87654321B',
        nombre: 'Another Client'
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 10, offset: 5, hasMore: false }
        });

      const result = await toolByCifnifImplementation(
        { 
          cifnif: '87654321B', 
          limit: 10, 
          offset: 5,
          order: 'fecha:desc'
        },
        mockClient
      );

      // Verify invoice search used custom parameters
      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        2,
        '/facturaclientes',
        10,
        5,
        { 
          'filter[codcliente]': 'CLI002',
          'sort[fecha]': 'DESC'
        }
      );

      expect(result.content[0].type).toBe('text');
    });

    it('should handle client with razonsocial but no nombre', async () => {
      const mockClientData = {
        codcliente: 'CLI003',
        cifnif: '11111111C',
        razonsocial: 'Test Company Ltd.'
        // no nombre field
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 50, offset: 0, hasMore: false }
        });

      const result = await toolByCifnifImplementation(
        { cifnif: '11111111C' },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.clientInfo.nombre).toBe('Test Company Ltd.');
    });

    it('should handle additional filter parameter for invoices', async () => {
      const mockClientData = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        nombre: 'Test Client'
      };

      const mockInvoices = [
        {
          codigo: 'FAC001',
          codcliente: 'CLI001',
          fecha: '2024-01-15',
          total: 100.00,
          pagada: false
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 50, offset: 0, hasMore: false }
        });

      const result = await toolByCifnifImplementation(
        { 
          cifnif: '12345678A',
          filter: 'fecha_gte:2024-01-01,total_gt:50.00',
          order: 'fecha:desc'
        },
        mockClient
      );

      // Verify invoice search was called with combined filters
      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        2,
        '/facturaclientes',
        50,
        0,
        { 
          'filter[codcliente]': 'CLI001',
          'filter[fecha_gte]': '2024-01-01',
          'filter[total_gt]': '50.00',
          'sort[fecha]': 'DESC'
        }
      );

      expect(result.content[0].type).toBe('text');
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.clientInfo.codcliente).toBe('CLI001');
      expect(parsedResult.invoices.data).toEqual(mockInvoices);
    });
  });

  describe('error scenarios', () => {
    it('should return error when client is not found', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 1, offset: 0, hasMore: false }
      });

      const result = await toolByCifnifImplementation(
        { cifnif: 'NONEXISTENT' },
        mockClient
      );

      expect(mockClient.getWithPagination).toHaveBeenCalledTimes(1);
      expect(result.isError).toBe(true);
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Client not found');
      expect(parsedResult.message).toBe('No se encontró ningún cliente con CIF/NIF: NONEXISTENT');
    });

    it('should return error when client has no codcliente', async () => {
      const mockClientData = {
        cifnif: '12345678A',
        nombre: 'Test Client'
        // no codcliente field
      };

      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [mockClientData],
        meta: { total: 1, limit: 1, offset: 0, hasMore: false }
      });

      const result = await toolByCifnifImplementation(
        { cifnif: '12345678A' },
        mockClient
      );

      expect(mockClient.getWithPagination).toHaveBeenCalledTimes(1);
      expect(result.isError).toBe(true);
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Client code not found');
      expect(parsedResult.message).toBe('El cliente encontrado no tiene código de cliente válido');
      expect(parsedResult.clientData).toEqual(mockClientData);
    });

    it('should handle API errors during client search', async () => {
      const apiError = new Error('Connection failed');
      mockClient.getWithPagination.mockRejectedValue(apiError);

      const result = await toolByCifnifImplementation(
        { cifnif: '12345678A' },
        mockClient
      );

      expect(result.isError).toBe(true);
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Failed to fetch invoices by CIF/NIF');
      expect(parsedResult.message).toBe('Connection failed');
      expect(parsedResult.cifnif).toBe('12345678A');
    });

    it('should handle API errors during invoice search', async () => {
      const mockClientData = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        nombre: 'Test Client'
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockRejectedValueOnce(new Error('Invoice API failed'));

      const result = await toolByCifnifImplementation(
        { cifnif: '12345678A' },
        mockClient
      );

      expect(result.isError).toBe(true);
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Failed to fetch invoices by CIF/NIF');
      expect(parsedResult.message).toBe('Invoice API failed');
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error type');

      const result = await toolByCifnifImplementation(
        { cifnif: '12345678A' },
        mockClient
      );

      expect(result.isError).toBe(true);
      
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('Unknown error');
    });
  });

  describe('parameter validation', () => {
    it('should handle minimum and maximum limits', async () => {
      const mockClientData = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        nombre: 'Test Client'
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 1000, offset: 0, hasMore: false }
        });

      // Test maximum limit (should be capped at 1000)
      await toolByCifnifImplementation(
        { cifnif: '12345678A', limit: 5000 },
        mockClient
      );

      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        2,
        '/facturaclientes',
        1000, // should be capped
        0,
        { 'filter[codcliente]': 'CLI001' }
      );

      mockClient.getWithPagination.mockClear();

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 1, offset: 0, hasMore: false }
        });

      // Test minimum limit (should be set to 1)
      await toolByCifnifImplementation(
        { cifnif: '12345678A', limit: -5 },
        mockClient
      );

      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        2,
        '/facturaclientes',
        1, // should be set to minimum
        0,
        { 'filter[codcliente]': 'CLI001' }
      );
    });

    it('should handle negative offset values', async () => {
      const mockClientData = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        nombre: 'Test Client'
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: [mockClientData],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 50, offset: 0, hasMore: false }
        });

      await toolByCifnifImplementation(
        { cifnif: '12345678A', offset: -10 },
        mockClient
      );

      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        2,
        '/facturaclientes',
        50,
        0, // should be set to 0
        { 'filter[codcliente]': 'CLI001' }
      );
    });
  });
});

describe('toolClientesMorososImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('successful scenarios', () => {
    it('should return clients with overdue unpaid invoices', async () => {
      const mockInvoices = [
        {
          codigo: 'FAC001',
          codcliente: 'CLI001',
          nombrecliente: 'Cliente Test 1',
          fecha: '2024-01-15',
          total: 100.50,
          pagada: false,
          vencida: true
        },
        {
          codigo: 'FAC002',
          codcliente: 'CLI001',
          nombrecliente: 'Cliente Test 1',
          fecha: '2024-01-20',
          total: 200.00,
          pagada: false,
          vencida: true
        },
        {
          codigo: 'FAC003',
          codcliente: 'CLI002',
          nombrecliente: 'Cliente Test 2',
          fecha: '2024-01-10',
          total: 500.00,
          pagada: false,
          vencida: true
        },
        {
          codigo: 'FAC004',
          codcliente: 'CLI001',
          nombrecliente: 'Cliente Test 1',
          fecha: '2024-01-25',
          total: 150.00,
          pagada: true,
          vencida: false
        }
      ];

      const mockCliente1 = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        nombre: 'Cliente Test 1',
        email: 'cliente1@test.com'
      };

      const mockCliente2 = {
        codcliente: 'CLI002',
        cifnif: '87654321B',
        nombre: 'Cliente Test 2',
        email: null
      };

      // Mock invoices response
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 4, limit: 5000, offset: 0, hasMore: false }
        })
        // Mock client lookup responses
        .mockResolvedValueOnce({
          data: [mockCliente1],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockCliente2],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesMorososImplementation(
        { limit: 50, offset: 0 },
        mockClient
      );

      // Verify invoice call
      expect(mockClient.getWithPagination).toHaveBeenNthCalledWith(
        1,
        '/facturaclientes',
        5000,
        0,
        {}
      );

      // Verify client lookup calls - order may vary due to Map iteration
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/clientes',
        1,
        0,
        { 'filter[codcliente]': 'CLI002' }
      );

      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/clientes',
        1,
        0,
        { 'filter[codcliente]': 'CLI001' }
      );

      // Verify response structure
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.meta.total).toBe(2);
      expect(parsedResult.data).toHaveLength(2);

      // CLI002 should be first (higher debt)
      expect(parsedResult.data[0]).toEqual({
        codcliente: 'CLI002',
        nombre: 'Cliente Test 2',
        cifnif: '87654321B',
        email: null,
        total_pendiente: 500.00,
        facturas_vencidas: 1,
        codigos_facturas: ['FAC003']
      });

      // CLI001 should be second
      expect(parsedResult.data[1]).toEqual({
        codcliente: 'CLI001',
        nombre: 'Cliente Test 1',
        cifnif: '12345678A',
        email: 'cliente1@test.com',
        total_pendiente: 300.50, // FAC001 + FAC002
        facturas_vencidas: 2,
        codigos_facturas: ['FAC001', 'FAC002']
      });
    });

    it('should handle pagination correctly', async () => {
      const mockInvoices = [
        {
          codigo: 'FAC001',
          codcliente: 'CLI001',
          total: 100.00,
          pagada: false,
          vencida: true
        },
        {
          codigo: 'FAC002',
          codcliente: 'CLI002',
          total: 200.00,
          pagada: false,
          vencida: true
        },
        {
          codigo: 'FAC003',
          codcliente: 'CLI003',
          total: 300.00,
          pagada: false,
          vencida: true
        }
      ];

      const mockClientes = [
        { codcliente: 'CLI003', nombre: 'Cliente 3', cifnif: 'CIF3', email: null },
        { codcliente: 'CLI002', nombre: 'Cliente 2', cifnif: 'CIF2', email: null },
        { codcliente: 'CLI001', nombre: 'Cliente 1', cifnif: 'CIF1', email: null }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({ data: mockInvoices, meta: { total: 3, limit: 5000, offset: 0, hasMore: false } })
        .mockResolvedValueOnce({ data: [mockClientes[0]], meta: { total: 1, limit: 1, offset: 0, hasMore: false } })
        .mockResolvedValueOnce({ data: [mockClientes[1]], meta: { total: 1, limit: 1, offset: 0, hasMore: false } })
        .mockResolvedValueOnce({ data: [mockClientes[2]], meta: { total: 1, limit: 1, offset: 0, hasMore: false } });

      // Get second page (limit=1, offset=1)
      const result = await toolClientesMorososImplementation(
        { limit: 1, offset: 1 },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.meta).toEqual({
        total: 3,
        limit: 1,
        offset: 1,
        hasMore: true
      });
      
      // Should return the second client (CLI002) based on sorting by total_pendiente desc
      expect(parsedResult.data).toHaveLength(1);
      expect(parsedResult.data[0].codcliente).toBe('CLI002');
    });
  });

  describe('edge cases', () => {
    it('should handle no invoices in system', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 5000, offset: 0, hasMore: false }
      });

      const result = await toolClientesMorososImplementation({}, mockClient);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('No se encontraron facturas en el sistema');
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle no overdue unpaid invoices', async () => {
      const mockInvoices = [
        { codigo: 'FAC001', codcliente: 'CLI001', pagada: true, vencida: false },
        { codigo: 'FAC002', codcliente: 'CLI001', pagada: false, vencida: false },
        { codigo: 'FAC003', codcliente: 'CLI001', pagada: true, vencida: true }
      ];

      mockClient.getWithPagination.mockResolvedValueOnce({
        data: mockInvoices,
        meta: { total: 3, limit: 5000, offset: 0, hasMore: false }
      });

      const result = await toolClientesMorososImplementation({}, mockClient);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('No se encontraron clientes con facturas vencidas y no pagadas');
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle client lookup failures gracefully', async () => {
      const mockInvoices = [
        {
          codigo: 'FAC001',
          codcliente: 'CLI_MISSING',
          total: 100.00,
          pagada: false,
          vencida: true
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({ data: mockInvoices, meta: { total: 1, limit: 5000, offset: 0, hasMore: false } })
        .mockRejectedValueOnce(new Error('Client not found'));

      const result = await toolClientesMorososImplementation({}, mockClient);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.data).toHaveLength(1);
      expect(parsedResult.data[0]).toEqual({
        codcliente: 'CLI_MISSING',
        nombre: 'Error al obtener datos del cliente',
        cifnif: 'Error',
        email: null,
        total_pendiente: 100.00,
        facturas_vencidas: 1,
        codigos_facturas: ['FAC001']
      });
    });

    it('should handle missing client names gracefully', async () => {
      const mockInvoices = [
        {
          codigo: 'FAC001',
          codcliente: 'CLI001',
          total: 100.00,
          pagada: false,
          vencida: true
        }
      ];

      const mockClienteWithoutName = {
        codcliente: 'CLI001',
        cifnif: '12345678A',
        // no nombre or razonsocial
        email: 'test@test.com'
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({ data: mockInvoices, meta: { total: 1, limit: 5000, offset: 0, hasMore: false } })
        .mockResolvedValueOnce({ data: [mockClienteWithoutName], meta: { total: 1, limit: 1, offset: 0, hasMore: false } });

      const result = await toolClientesMorososImplementation({}, mockClient);

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.data[0].nombre).toBe('Sin nombre');
      expect(parsedResult.data[0].cifnif).toBe('12345678A');
    });
  });

  describe('parameter validation', () => {
    it('should handle parameter bounds correctly', async () => {
      const mockInvoices = [
        { codigo: 'FAC001', codcliente: 'CLI001', total: 100, pagada: false, vencida: true }
      ];

      const mockCliente = {
        codcliente: 'CLI001',
        nombre: 'Test',
        cifnif: 'TEST',
        email: null
      };

      mockClient.getWithPagination
        .mockResolvedValue({ data: mockInvoices, meta: { total: 1, limit: 5000, offset: 0, hasMore: false } })
        .mockResolvedValue({ data: [mockCliente], meta: { total: 1, limit: 1, offset: 0, hasMore: false } });

      // Test limit bounds
      await toolClientesMorososImplementation({ limit: 5000, offset: -10 }, mockClient);

      // Verify limit was capped and offset was normalized
      const result = await toolClientesMorososImplementation({ limit: 0, offset: -5 }, mockClient);
      
      // Should work without errors - parameters are normalized internally
      expect(result.content[0].type).toBe('text');
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValueOnce(new Error('API Error'));

      const result = await toolClientesMorososImplementation({}, mockClient);

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Failed to fetch clientes morosos');
      expect(parsedResult.message).toBe('API Error');
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValueOnce('Unknown error');

      const result = await toolClientesMorososImplementation({}, mockClient);

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('Unknown error');
    });
  });
});

describe('toolClientesTopFacturacionImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('successful scenarios', () => {
    it('should return top billing clients ranking', async () => {
      const mockInvoices = [
        {
          codcliente: 'CLI001',
          fecha: '2024-01-15',
          total: 1500.00,
          pagada: true
        },
        {
          codcliente: 'CLI002',
          fecha: '2024-01-20',
          total: 2500.00,
          pagada: true
        },
        {
          codcliente: 'CLI001',
          fecha: '2024-01-25',
          total: 800.00,
          pagada: false
        }
      ];

      const mockCliente1 = {
        codcliente: 'CLI001',
        nombre: 'Cliente Uno',
        cifnif: '12345678A'
      };

      const mockCliente2 = {
        codcliente: 'CLI002',
        nombre: 'Cliente Dos',
        cifnif: '87654321B'
      };

      // Mock invoice fetch
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 5000, offset: 0, hasMore: false }
        })
        // Mock client lookups
        .mockResolvedValueOnce({
          data: [mockCliente1],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockCliente2],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 10,
          offset: 0
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.periodo).toEqual({
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        solo_pagadas: false
      });
      expect(parsedResult.meta.total).toBe(2);
      expect(parsedResult.data).toHaveLength(2);
      
      // Check sorting (CLI002 should be first with 2500.00 total, then CLI001 with 2300.00)
      expect(parsedResult.data[0]).toEqual({
        codcliente: 'CLI002',
        nombre: 'Cliente Dos',
        cifnif: '87654321B',
        total_facturado: 2500.00,
        numero_facturas: 1
      });
      
      expect(parsedResult.data[1]).toEqual({
        codcliente: 'CLI001',
        nombre: 'Cliente Uno',
        cifnif: '12345678A',
        total_facturado: 2300.00,
        numero_facturas: 2
      });
    });

    it('should filter by payment status when solo_pagadas is true', async () => {
      const mockInvoices = [
        {
          codcliente: 'CLI001',
          fecha: '2024-01-15',
          total: 1000.00,
          pagada: true
        },
        {
          codcliente: 'CLI001',
          fecha: '2024-01-20',
          total: 500.00,
          pagada: false
        },
        {
          codcliente: 'CLI002',
          fecha: '2024-01-25',
          total: 2000.00,
          pagada: true
        }
      ];

      const mockCliente1 = {
        codcliente: 'CLI001',
        nombre: 'Cliente Uno',
        cifnif: '12345678A'
      };

      const mockCliente2 = {
        codcliente: 'CLI002',
        nombre: 'Cliente Dos',
        cifnif: '87654321B'
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockCliente2],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockCliente1],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          solo_pagadas: true
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.periodo.solo_pagadas).toBe(true);
      expect(parsedResult.data).toHaveLength(2);
      
      // Only paid invoices should be included
      expect(parsedResult.data[0].total_facturado).toBe(2000.00);
      expect(parsedResult.data[1].total_facturado).toBe(1000.00);
    });

    it('should handle pagination correctly', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-15', total: 1000, pagada: true },
        { codcliente: 'CLI002', fecha: '2024-01-15', total: 2000, pagada: true },
        { codcliente: 'CLI003', fecha: '2024-01-15', total: 3000, pagada: true }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValue({
          data: [{ codcliente: 'CLI001', nombre: 'Cliente', cifnif: '123' }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 2,
          offset: 1
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.meta.total).toBe(3);
      expect(parsedResult.meta.limit).toBe(2);
      expect(parsedResult.meta.offset).toBe(1);
      expect(parsedResult.meta.hasMore).toBe(false);
      expect(parsedResult.data).toHaveLength(2);
    });
  });

  describe('error scenarios', () => {
    it('should handle no invoices found in date range', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 5000, offset: 0, hasMore: false }
      });

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('No se encontraron facturas en el período del 2024-01-01 al 2024-01-31');
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle no paid invoices when solo_pagadas is true', async () => {
      const mockInvoices = [
        {
          codcliente: 'CLI001',
          fecha: '2024-01-15',
          total: 1000.00,
          pagada: false
        }
      ];

      mockClient.getWithPagination.mockResolvedValueOnce({
        data: mockInvoices,
        meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
      });

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          solo_pagadas: true
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('No se encontraron facturas pagadas en el período del 2024-01-01 al 2024-01-31');
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle client lookup failures gracefully', async () => {
      const mockInvoices = [
        {
          codcliente: 'CLI_MISSING',
          fecha: '2024-01-15',
          total: 1000.00,
          pagada: true
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
        })
        .mockRejectedValueOnce(new Error('Client not found'));

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.data).toHaveLength(1);
      expect(parsedResult.data[0]).toEqual({
        codcliente: 'CLI_MISSING',
        nombre: 'Error al obtener datos del cliente',
        cifnif: 'Error',
        total_facturado: 1000.00,
        numero_facturas: 1
      });
    });

    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValueOnce(new Error('API Error'));

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Failed to fetch clientes top facturación');
      expect(parsedResult.message).toBe('API Error');
    });
  });

  describe('parameter validation', () => {
    it('should normalize limit and offset parameters', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-15', total: 1000, pagada: true }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ codcliente: 'CLI001', nombre: 'Cliente', cifnif: '123' }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      // Test with out-of-bounds parameters
      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 5000, // Should be capped to 1000
          offset: -10  // Should be normalized to 0
        },
        mockClient
      );

      // Should work without errors - parameters are normalized internally
      expect(result.content[0].type).toBe('text');
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.meta.limit).toBe(1000); // Capped
      expect(parsedResult.meta.offset).toBe(0);   // Normalized
    });

    it('should use default values correctly', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-15', total: 1000, pagada: true }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ codcliente: 'CLI001', nombre: 'Cliente', cifnif: '123' }],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesTopFacturacionImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
          // No limit, offset, or solo_pagadas - should use defaults
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.meta.limit).toBe(100);    // Default limit
      expect(parsedResult.meta.offset).toBe(0);     // Default offset
      expect(parsedResult.periodo.solo_pagadas).toBe(false); // Default solo_pagadas
    });
  });
});

describe('toolClientesSinComprasImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('successful scenarios', () => {
    it('should return clients without purchases in date range', async () => {
      const mockClients = [
        {
          codcliente: 'CLI001',
          nombre: 'Cliente Activo',
          email: 'activo@example.com',
          telefono1: '123456789'
        },
        {
          codcliente: 'CLI002',
          nombre: 'Cliente Inactivo',
          email: 'inactivo@example.com',
          telefono1: '987654321'
        },
        {
          codcliente: 'CLI003',
          nombre: 'Cliente Sin Datos',
          email: null,
          telefono1: null
        }
      ];

      const mockInvoices = [
        {
          codcliente: 'CLI001',
          fecha: '2024-01-15',
          total: 1000.00
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 3, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.periodo).toEqual({
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
      });
      expect(parsedResult.meta.total).toBe(2);
      expect(parsedResult.data).toHaveLength(2);
      
      // CLI001 should be excluded (has invoices), CLI002 and CLI003 should be included
      expect(parsedResult.data.find(c => c.codcliente === 'CLI001')).toBeUndefined();
      expect(parsedResult.data.find(c => c.codcliente === 'CLI002')).toBeDefined();
      expect(parsedResult.data.find(c => c.codcliente === 'CLI003')).toBeDefined();
    });

    it('should return all clients when no invoices exist in date range', async () => {
      const mockClients = [
        {
          codcliente: 'CLI001',
          nombre: 'Cliente 1',
          email: 'cliente1@example.com',
          telefono1: '123456789'
        },
        {
          codcliente: 'CLI002',
          nombre: 'Cliente 2',
          email: 'cliente2@example.com',
          telefono1: '987654321'
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 2, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No invoices in date range
          meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.meta.total).toBe(2);
      expect(parsedResult.data).toHaveLength(2);
      expect(parsedResult.data[0].codcliente).toBe('CLI001');
      expect(parsedResult.data[1].codcliente).toBe('CLI002');
    });

    it('should return empty array when all clients have purchases', async () => {
      const mockClients = [
        {
          codcliente: 'CLI001',
          nombre: 'Cliente 1',
          email: 'cliente1@example.com',
          telefono1: '123456789'
        },
        {
          codcliente: 'CLI002',
          nombre: 'Cliente 2',
          email: 'cliente2@example.com',
          telefono1: '987654321'
        }
      ];

      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-15', total: 1000.00 },
        { codcliente: 'CLI002', fecha: '2024-01-20', total: 2000.00 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 2, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.meta.total).toBe(0);
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle pagination correctly', async () => {
      const mockClients = Array.from({ length: 5 }, (_, i) => ({
        codcliente: `CLI00${i + 1}`,
        nombre: `Cliente ${i + 1}`,
        email: `cliente${i + 1}@example.com`,
        telefono1: `12345678${i}`
      }));

      // Only CLI001 has invoices
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-15', total: 1000.00 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 5, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 2,
          offset: 1
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.meta.total).toBe(4); // 5 clients - 1 with purchases
      expect(parsedResult.meta.limit).toBe(2);
      expect(parsedResult.meta.offset).toBe(1);
      expect(parsedResult.meta.hasMore).toBe(true);
      expect(parsedResult.data).toHaveLength(2);
      
      // Should get CLI003 and CLI004 (skipping CLI002 due to offset)
      expect(parsedResult.data[0].codcliente).toBe('CLI003');
      expect(parsedResult.data[1].codcliente).toBe('CLI004');
    });

    it('should handle clients with missing names gracefully', async () => {
      const mockClients = [
        {
          codcliente: 'CLI001',
          nombre: null,
          razonsocial: 'Empresa Test S.L.',
          email: 'empresa@example.com',
          telefono1: '123456789'
        },
        {
          codcliente: 'CLI002',
          nombre: null,
          razonsocial: null,
          email: 'sin-nombre@example.com',
          telefono1: null
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 2, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No invoices
          meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      
      expect(parsedResult.data[0].nombre).toBe('Empresa Test S.L.');
      expect(parsedResult.data[1].nombre).toBe('Sin nombre');
    });
  });

  describe('error scenarios', () => {
    it('should handle no clients in system', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 5000, offset: 0, hasMore: false }
      });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.message).toBe('No se encontraron clientes en el sistema');
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValueOnce(new Error('API Error'));

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Failed to fetch clientes sin compras');
      expect(parsedResult.message).toBe('API Error');
      expect(parsedResult.periodo).toEqual({
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31'
      });
    });

    it('should handle invoice API errors gracefully', async () => {
      const mockClients = [
        { codcliente: 'CLI001', nombre: 'Cliente Test' }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
        })
        .mockRejectedValueOnce(new Error('Invoice API Error'));

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.error).toBe('Failed to fetch clientes sin compras');
      expect(parsedResult.message).toBe('Invoice API Error');
    });
  });

  describe('parameter validation', () => {
    it('should normalize limit and offset parameters', async () => {
      const mockClients = [
        { codcliente: 'CLI001', nombre: 'Cliente Test', email: null, telefono1: null }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 5000, // Should be capped to 1000
          offset: -10  // Should be normalized to 0
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.meta.limit).toBe(1000); // Capped
      expect(parsedResult.meta.offset).toBe(0);   // Normalized
    });

    it('should use default values correctly', async () => {
      const mockClients = [
        { codcliente: 'CLI001', nombre: 'Cliente Test', email: null, telefono1: null }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockClients,
          meta: { total: 1, limit: 5000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
        });

      const result = await toolClientesSinComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
          // No limit or offset - should use defaults
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      expect(parsedResult.meta.limit).toBe(100);  // Default limit
      expect(parsedResult.meta.offset).toBe(0);   // Default offset
    });
  });
});

describe('toolClientesFrecuenciaComprasImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('successful scenarios', () => {
    it('should calculate purchase frequency for clients with multiple invoices', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-10', total: 100 },
        { codcliente: 'CLI001', fecha: '2024-01-25', total: 150 }, // 15 days later
        { codcliente: 'CLI001', fecha: '2024-02-10', total: 200 }, // 16 days later (avg: 15.5 days)
        { codcliente: 'CLI002', fecha: '2024-01-15', total: 300 }  // Single purchase
      ];

      const mockClients = [
        { codcliente: 'CLI001', nombre: 'Juan Pérez', email: 'juan@example.com', telefono1: '600123456' },
        { codcliente: 'CLI002', nombre: 'Ana Gómez', email: 'ana@example.com', telefono1: '600654321' }
      ];

      // Mock invoice retrieval
      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 4, limit: 10000, offset: 0, hasMore: false }
        })
        // Mock client lookups
        .mockResolvedValueOnce({
          data: [mockClients[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-02-28'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.periodo.fecha_desde).toBe('2024-01-01');
      expect(parsedResult.periodo.fecha_hasta).toBe('2024-02-28');
      expect(parsedResult.meta.total).toBe(2);
      expect(parsedResult.data).toHaveLength(2);

      // Check client with multiple purchases (sorted first by numero_compras)
      const cli001 = parsedResult.data[0];
      expect(cli001.codcliente).toBe('CLI001');
      expect(cli001.numero_compras).toBe(3);
      expect(cli001.fecha_primera_compra).toBe('2024-01-10');
      expect(cli001.fecha_ultima_compra).toBe('2024-02-10');
      expect(cli001.frecuencia_dias).toBe(16); // Rounded average: (15 + 16) / 2 = 15.5 ≈ 16

      // Check client with single purchase
      const cli002 = parsedResult.data[1];
      expect(cli002.codcliente).toBe('CLI002');
      expect(cli002.numero_compras).toBe(1);
      expect(cli002.fecha_primera_compra).toBe('2024-01-15');
      expect(cli002.fecha_ultima_compra).toBe('2024-01-15');
      expect(cli002.frecuencia_dias).toBeNull();
    });

    it('should handle clients with exactly 2 invoices', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-01', total: 100 },
        { codcliente: 'CLI001', fecha: '2024-01-31', total: 150 } // 30 days later
      ];

      const mockClient1 = { codcliente: 'CLI001', nombre: 'Cliente Test', email: 'test@example.com', telefono1: '123456789' };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClient1],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);
      const cliente = parsedResult.data[0];

      expect(cliente.numero_compras).toBe(2);
      expect(cliente.frecuencia_dias).toBe(30); // Exact 30 days between purchases
    });

    it('should apply pagination correctly', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-10', total: 100 },
        { codcliente: 'CLI002', fecha: '2024-01-15', total: 150 },
        { codcliente: 'CLI003', fecha: '2024-01-20', total: 200 }
      ];

      const mockClients = [
        { codcliente: 'CLI001', nombre: 'Cliente 1' },
        { codcliente: 'CLI002', nombre: 'Cliente 2' },
        { codcliente: 'CLI003', nombre: 'Cliente 3' }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 3, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[2]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 2,
          offset: 1
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.total).toBe(3); // Total clients
      expect(parsedResult.meta.limit).toBe(2);
      expect(parsedResult.meta.offset).toBe(1);
      expect(parsedResult.meta.hasMore).toBe(false); // 3 total, offset 1, limit 2 → items 1,2 → no more
      expect(parsedResult.data).toHaveLength(2); // Only 2 results due to pagination
    });
  });

  describe('error scenarios', () => {
    it('should handle no invoices found in date range', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.message).toContain('No se encontraron facturas en el período');
      expect(parsedResult.meta.total).toBe(0);
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle client lookup failures gracefully', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-10', total: 100 },
        { codcliente: 'CLI001', fecha: '2024-01-25', total: 150 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockRejectedValueOnce(new Error('Client lookup failed'));

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.data).toHaveLength(1);
      const cliente = parsedResult.data[0];
      expect(cliente.codcliente).toBe('CLI001');
      expect(cliente.nombre).toBe('Error al obtener datos del cliente');
      expect(cliente.numero_compras).toBe(2);
      expect(cliente.frecuencia_dias).toBe(15); // Still calculated correctly
    });

    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValueOnce(new Error('API Error'));

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.error).toBe('Failed to fetch clientes frecuencia compras');
      expect(parsedResult.message).toBe('API Error');
      expect(parsedResult.periodo.fecha_desde).toBe('2024-01-01');
      expect(parsedResult.periodo.fecha_hasta).toBe('2024-01-31');
    });

    it('should handle missing client data', async () => {
      const mockInvoices = [
        { codcliente: 'CLI001', fecha: '2024-01-10', total: 100 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No client found
          meta: { total: 0, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.data).toHaveLength(0); // Client not included if lookup fails with empty data
    });
  });

  describe('parameter validation', () => {
    it('should normalize limit and offset parameters', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31',
          limit: 5000, // Should be capped to 1000
          offset: -10  // Should be normalized to 0
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.limit).toBe(1000); // Capped limit
      expect(parsedResult.meta.offset).toBe(0);   // Normalized offset
    });

    it('should use default parameters when not provided', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
          // No limit or offset - should use defaults
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.limit).toBe(100);  // Default limit
      expect(parsedResult.meta.offset).toBe(0);   // Default offset
    });
  });

  describe('sorting logic', () => {
    it('should sort by numero_compras descending, then by frecuencia_dias ascending', async () => {
      const mockInvoices = [
        // CLI001: 3 purchases, frequency: 15 days
        { codcliente: 'CLI001', fecha: '2024-01-01', total: 100 },
        { codcliente: 'CLI001', fecha: '2024-01-16', total: 150 },
        { codcliente: 'CLI001', fecha: '2024-01-31', total: 200 },
        // CLI002: 2 purchases, frequency: 20 days
        { codcliente: 'CLI002', fecha: '2024-01-01', total: 100 },
        { codcliente: 'CLI002', fecha: '2024-01-21', total: 150 },
        // CLI003: 2 purchases, frequency: 10 days (should come before CLI002)
        { codcliente: 'CLI003', fecha: '2024-01-01', total: 100 },
        { codcliente: 'CLI003', fecha: '2024-01-11', total: 150 }
      ];

      const mockClients = [
        { codcliente: 'CLI001', nombre: 'Cliente 1' },
        { codcliente: 'CLI002', nombre: 'Cliente 2' },
        { codcliente: 'CLI003', nombre: 'Cliente 3' }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockInvoices,
          meta: { total: 7, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClients[2]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesFrecuenciaComprasImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-01-31'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.data).toHaveLength(3);
      
      // Should be sorted by numero_compras desc, then frecuencia_dias asc
      expect(parsedResult.data[0].codcliente).toBe('CLI001'); // 3 purchases
      expect(parsedResult.data[1].codcliente).toBe('CLI003'); // 2 purchases, 10 days
      expect(parsedResult.data[2].codcliente).toBe('CLI002'); // 2 purchases, 20 days
    });
  });
});

describe('toolClientesPerdidosImplementation', () => {
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
  });

  describe('successful scenarios', () => {
    it('should return clients who had invoices but none since fecha_desde', async () => {
      const mockAllInvoices = [
        // CLI001: had invoices before fecha_desde, none after → lost client
        { codcliente: 'CLI001', fecha: '2023-12-15', total: 1000 },
        { codcliente: 'CLI001', fecha: '2023-11-10', total: 500 },
        // CLI002: had invoices before AND after fecha_desde → not lost
        { codcliente: 'CLI002', fecha: '2023-12-01', total: 800 },
        { codcliente: 'CLI002', fecha: '2024-02-15', total: 1200 }, // After fecha_desde
        // CLI003: had invoices before fecha_desde, none after → lost client
        { codcliente: 'CLI003', fecha: '2023-10-20', total: 300 }
      ];

      const mockClientesPerdidos = [
        {
          codcliente: 'CLI001',
          nombre: 'Cliente Perdido Uno',
          email: 'perdido1@example.com',
          telefono1: '600111111'
        },
        {
          codcliente: 'CLI003', 
          nombre: 'Cliente Perdido Tres',
          email: 'perdido3@example.com',
          telefono1: '600333333'
        }
      ];

      mockClient.getWithPagination
        // Get all invoices
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 5, limit: 10000, offset: 0, hasMore: false }
        })
        // Client lookups for lost clients
        .mockResolvedValueOnce({
          data: [mockClientesPerdidos[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientesPerdidos[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.fecha_corte).toBe('2024-01-01');
      expect(parsedResult.meta.total).toBe(2);
      expect(parsedResult.data).toHaveLength(2);

      // Check lost client CLI001 (more recent last invoice should be first)
      const cli001 = parsedResult.data[0];
      expect(cli001.codcliente).toBe('CLI001');
      expect(cli001.nombre).toBe('Cliente Perdido Uno');
      expect(cli001.email).toBe('perdido1@example.com');
      expect(cli001.fecha_ultima_factura).toBe('2023-12-15'); // Most recent invoice
      expect(cli001.total_facturas_historicas).toBe(2);
      expect(cli001.total_facturado_historico).toBe(1500);

      // Check lost client CLI003  
      const cli003 = parsedResult.data[1];
      expect(cli003.codcliente).toBe('CLI003');
      expect(cli003.nombre).toBe('Cliente Perdido Tres');
      expect(cli003.fecha_ultima_factura).toBe('2023-10-20');
      expect(cli003.total_facturas_historicas).toBe(1);
      expect(cli003.total_facturado_historico).toBe(300);
    });

    it('should exclude clients who never had invoices', async () => {
      const mockAllInvoices = [
        // Only CLI001 has invoices, but after fecha_desde
        { codcliente: 'CLI001', fecha: '2024-02-15', total: 1000 }
      ];

      mockClient.getWithPagination.mockResolvedValueOnce({
        data: mockAllInvoices,
        meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.total).toBe(0);
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle clients with missing invoice dates gracefully', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '', total: 1000 }, // Empty fecha
        { codcliente: 'CLI002', fecha: null, total: 500 }, // Null fecha
        { codcliente: 'CLI003', fecha: '2023-12-15', total: 800 } // Valid fecha - lost client
      ];

      // Need mock clients for all clients that have invoices (even with invalid dates)
      const mockClientes = [
        {
          codcliente: 'CLI001',
          nombre: 'Cliente Uno',
          email: null,
          telefono1: null
        },
        {
          codcliente: 'CLI002',
          nombre: 'Cliente Dos',
          email: null,
          telefono1: null
        },
        {
          codcliente: 'CLI003',
          nombre: 'Cliente Tres',
          email: null,
          telefono1: null
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 3, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[2]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      // All clients should be returned (they all have historical invoices but none since fecha_desde)
      // CLI001 and CLI002 have invalid dates, CLI003 has valid date before cutoff
      expect(parsedResult.meta.total).toBe(3);
      
      // CLI003 should be first (has valid fecha_ultima_factura for sorting)
      const cli003 = parsedResult.data.find(c => c.codcliente === 'CLI003');
      expect(cli003).toBeDefined();
      expect(cli003.codcliente).toBe('CLI003');
      
      // CLI001 and CLI002 should also be present
      const cli001 = parsedResult.data.find(c => c.codcliente === 'CLI001');
      const cli002 = parsedResult.data.find(c => c.codcliente === 'CLI002');
      expect(cli001).toBeDefined();
      expect(cli002).toBeDefined();
    });

    it('should apply pagination correctly', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '2023-12-15', total: 1000 },
        { codcliente: 'CLI002', fecha: '2023-11-10', total: 500 },
        { codcliente: 'CLI003', fecha: '2023-10-05', total: 800 },
        { codcliente: 'CLI004', fecha: '2023-09-20', total: 300 },
        { codcliente: 'CLI005', fecha: '2023-08-15', total: 600 }
      ];

      const mockClientes = [
        { codcliente: 'CLI001', nombre: 'Cliente 1' },
        { codcliente: 'CLI002', nombre: 'Cliente 2' },
        { codcliente: 'CLI003', nombre: 'Cliente 3' },
        { codcliente: 'CLI004', nombre: 'Cliente 4' },
        { codcliente: 'CLI005', nombre: 'Cliente 5' }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 5, limit: 10000, offset: 0, hasMore: false }
        });

      // Mock client lookups
      mockClientes.forEach(cliente => {
        mockClient.getWithPagination.mockResolvedValueOnce({
          data: [cliente],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });
      });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01',
          limit: 3,
          offset: 1
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.total).toBe(5); // Total lost clients
      expect(parsedResult.meta.limit).toBe(3);
      expect(parsedResult.meta.offset).toBe(1);
      expect(parsedResult.meta.hasMore).toBe(true);
      expect(parsedResult.data).toHaveLength(3);

      // Results should be sorted by fecha_ultima_factura desc, so offset 1 skips CLI001
      expect(parsedResult.data[0].codcliente).toBe('CLI002');
      expect(parsedResult.data[1].codcliente).toBe('CLI003'); 
      expect(parsedResult.data[2].codcliente).toBe('CLI004');
    });

    it('should sort by fecha_ultima_factura descending (most recent lost clients first)', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '2023-08-15', total: 1000 }, // Oldest
        { codcliente: 'CLI002', fecha: '2023-12-01', total: 500 },  // Most recent
        { codcliente: 'CLI003', fecha: '2023-10-10', total: 800 }   // Middle
      ];

      const mockClientes = [
        { codcliente: 'CLI001', nombre: 'Cliente 1' },
        { codcliente: 'CLI002', nombre: 'Cliente 2' },
        { codcliente: 'CLI003', nombre: 'Cliente 3' }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 3, limit: 10000, offset: 0, hasMore: false }
        });

      mockClientes.forEach(cliente => {
        mockClient.getWithPagination.mockResolvedValueOnce({
          data: [cliente],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });
      });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.data).toHaveLength(3);
      // Should be sorted by fecha_ultima_factura descending
      expect(parsedResult.data[0].codcliente).toBe('CLI002'); // 2023-12-01
      expect(parsedResult.data[1].codcliente).toBe('CLI003'); // 2023-10-10
      expect(parsedResult.data[2].codcliente).toBe('CLI001'); // 2023-08-15
    });

    it('should handle clients with missing names gracefully', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '2023-12-15', total: 1000 },
        { codcliente: 'CLI002', fecha: '2023-11-10', total: 500 }
      ];

      const mockClientes = [
        {
          codcliente: 'CLI001',
          nombre: null,
          razonsocial: 'Empresa Test S.L.',
          email: 'empresa@example.com',
          telefono1: '123456789'
        },
        {
          codcliente: 'CLI002',
          nombre: null,
          razonsocial: null, // Both null - should use 'Sin nombre'
          email: null,
          telefono1: null
        }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 2, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.data[0].nombre).toBe('Empresa Test S.L.');
      expect(parsedResult.data[1].nombre).toBe('Sin nombre');
    });
  });

  describe('error scenarios', () => {
    it('should handle no invoices in system', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.message).toBe('No se encontraron facturas en el sistema. No hay historial de clientes.');
      expect(parsedResult.meta.total).toBe(0);
      expect(parsedResult.data).toEqual([]);
    });

    it('should handle client lookup failures gracefully', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '2023-12-15', total: 1000 }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 1, limit: 10000, offset: 0, hasMore: false }
        })
        .mockRejectedValueOnce(new Error('Client lookup failed'));

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.data).toHaveLength(1);
      expect(parsedResult.data[0]).toEqual({
        codcliente: 'CLI001',
        nombre: 'Error al obtener datos del cliente',
        email: null,
        telefono1: null,
        fecha_ultima_factura: '2023-12-15',
        total_facturas_historicas: 1,
        total_facturado_historico: 1000
      });
    });

    it('should handle API errors gracefully', async () => {
      mockClient.getWithPagination.mockRejectedValueOnce(new Error('API Error'));

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      expect(result.isError).toBe(true);
      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.error).toBe('Failed to fetch clientes perdidos');
      expect(parsedResult.message).toBe('API Error');
      expect(parsedResult.fecha_corte).toBe('2024-01-01');
    });

    it('should skip invoices without codcliente', async () => {
      const mockAllInvoices = [
        { codcliente: null, fecha: '2023-12-15', total: 1000 }, // No codcliente
        { codcliente: '', fecha: '2023-11-10', total: 500 },    // Empty codcliente  
        { codcliente: 'CLI001', fecha: '2023-10-05', total: 800 } // Valid codcliente
      ];

      const mockCliente = {
        codcliente: 'CLI001',
        nombre: 'Cliente Valido',
        email: null,
        telefono1: null
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 3, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockCliente],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      // Only CLI001 should be processed
      expect(parsedResult.meta.total).toBe(1);
      expect(parsedResult.data[0].codcliente).toBe('CLI001');
    });
  });

  describe('parameter validation', () => {
    it('should normalize limit and offset parameters', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01',
          limit: 5000, // Should be capped to 1000
          offset: -10  // Should be normalized to 0
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.limit).toBe(1000); // Capped
      expect(parsedResult.meta.offset).toBe(0);   // Normalized
    });

    it('should use default values when not provided', async () => {
      mockClient.getWithPagination.mockResolvedValueOnce({
        data: [],
        meta: { total: 0, limit: 10000, offset: 0, hasMore: false }
      });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
          // No limit or offset - should use defaults
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      expect(parsedResult.meta.limit).toBe(100);  // Default limit
      expect(parsedResult.meta.offset).toBe(0);   // Default offset
    });
  });

  describe('date handling', () => {
    it('should correctly filter invoices by fecha_desde', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '2023-12-31', total: 1000 }, // Before fecha_desde
        { codcliente: 'CLI001', fecha: '2024-01-01', total: 500 },  // Exactly fecha_desde - not lost
        { codcliente: 'CLI002', fecha: '2023-11-15', total: 800 },  // Before fecha_desde
        { codcliente: 'CLI002', fecha: '2024-01-02', total: 300 },  // After fecha_desde - not lost
        { codcliente: 'CLI003', fecha: '2023-10-20', total: 600 }   // Before fecha_desde - lost
      ];

      const mockCliente3 = {
        codcliente: 'CLI003',
        nombre: 'Cliente Perdido',
        email: null,
        telefono1: null
      };

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 5, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockCliente3],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2024-01-01'
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      // Only CLI003 should be returned as lost (only has invoices before fecha_desde)
      expect(parsedResult.meta.total).toBe(1);
      expect(parsedResult.data[0].codcliente).toBe('CLI003');
    });

    it('should handle FacturaScripts DD-MM-YYYY date format correctly', async () => {
      const mockAllInvoices = [
        { codcliente: 'CLI001', fecha: '15-12-2023', total: 1000 }, // DD-MM-YYYY before fecha_desde
        { codcliente: 'CLI001', fecha: '17-08-2025', total: 500 },  // DD-MM-YYYY after fecha_desde - not lost
        { codcliente: 'CLI002', fecha: '10-07-2025', total: 800 },  // DD-MM-YYYY before fecha_desde (July < August) - lost
        { codcliente: 'CLI003', fecha: '20-12-2024', total: 600 }   // DD-MM-YYYY before fecha_desde - lost
      ];

      const mockClientes = [
        { codcliente: 'CLI002', nombre: 'Cliente Dos', email: null, telefono1: null },
        { codcliente: 'CLI003', nombre: 'Cliente Tres', email: null, telefono1: null }
      ];

      mockClient.getWithPagination
        .mockResolvedValueOnce({
          data: mockAllInvoices,
          meta: { total: 4, limit: 10000, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[0]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [mockClientes[1]],
          meta: { total: 1, limit: 1, offset: 0, hasMore: false }
        });

      const result = await toolClientesPerdidosImplementation(
        {
          fecha_desde: '2025-08-01' // ISO format
        },
        mockClient
      );

      const parsedResult = JSON.parse(result.content[0].text);

      // CLI002 and CLI003 should be returned as lost
      // CLI001 has invoice '17-08-2025' which converts to '2025-08-17' >= '2025-08-01' so NOT lost
      // CLI002 has invoice '10-07-2025' which converts to '2025-07-10' < '2025-08-01' so lost
      expect(parsedResult.meta.total).toBe(2); 
      expect(parsedResult.data.some(c => c.codcliente === 'CLI002')).toBe(true);
      expect(parsedResult.data.some(c => c.codcliente === 'CLI003')).toBe(true);
      // CLI001 should NOT be in results (has recent invoice '17-08-2025')
      expect(parsedResult.data.some(c => c.codcliente === 'CLI001')).toBe(false);
    });
  });
});