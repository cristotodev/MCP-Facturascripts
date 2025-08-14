import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacturaclientesResource, FacturaCliente } from '../../../../src/modules/sales-orders/facturaclientes/resource.js';
import { toolByCifnifImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool.js';
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