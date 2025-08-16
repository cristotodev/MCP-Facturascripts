import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacturaclientesResource, FacturaCliente } from '../../../../src/modules/sales-orders/facturaclientes/resource.js';
import { toolByCifnifImplementation, toolClientesMorososImplementation, toolClientesTopFacturacionImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool.js';
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