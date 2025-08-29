import { describe, it, expect, vi } from 'vitest';
import { toolTiempoBeneficiosImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool-tiempo-beneficios.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('get_tiempo_beneficios_cliente tool', () => {
  const createMockClient = () => ({
    getWithPagination: vi.fn(),
  }) as unknown as FacturaScriptsClient;

  describe('Success scenarios', () => {
    it('should calculate time to benefits for a client with paid invoices', async () => {
      const mockClient = createMockClient();

      // Mock cliente data
      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{
            codcliente: 'CLI001',
            nombre: 'Test Client',
            fechaalta: '15-01-2024',
            email: 'test@client.com',
            telefono1: '600123456'
          }],
          meta: { total: 1, hasMore: false }
        })
        // Mock facturaclientes data  
        .mockResolvedValueOnce({
          data: [
            { idfactura: 1, codigo: 'FAC001', fecha: '20-01-2024', total: 1000 },
            { idfactura: 2, codigo: 'FAC002', fecha: '25-01-2024', total: 1500 }
          ],
          meta: { total: 2, hasMore: false }
        })
        // Mock reciboclientes data
        .mockResolvedValueOnce({
          data: [
            { idfactura: 1, fechapago: '25-01-2024', importe: 1000 },
            { idfactura: 2, fechapago: '02-02-2024', importe: 1500 }
          ],
          meta: { total: 2, hasMore: false }
        });

      const result = await toolTiempoBeneficiosImplementation({
        codcliente: 'CLI001'
      }, mockClient);

      expect(result.content[0].text).toBeDefined();
      const data = JSON.parse(result.content[0].text);
      
      expect(data.codcliente).toBe('CLI001');
      expect(data.tiempo_hasta_primer_pago_dias).toBe(10); // 15-01 a 25-01
      expect(data.tiempo_hasta_ultimo_pago_dias).toBe(18); // 15-01 a 02-02
      expect(data.total_facturado).toBe(2500);
      expect(data.total_pagado).toBe(2500);
    });

    it('should handle client with unpaid invoices', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{
            codcliente: 'CLI002',
            nombre: 'Client with debt',
            fechaalta: '01-02-2024'
          }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [
            { idfactura: 3, codigo: 'FAC003', fecha: '05-02-2024', total: 800 }
          ],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No payments
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosImplementation({
        codcliente: 'CLI002'
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      expect(data.tiempo_hasta_primer_pago_dias).toBeNull();
      expect(data.tiempo_hasta_ultimo_pago_dias).toBeNull();
      expect(data.total_pagado).toBe(0);
      expect(data.pendiente_pago).toBe(800);
    });
  });

  describe('Error scenarios', () => {
    it('should return error for non-existent client', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosImplementation({
        codcliente: 'NOEXISTE'
      }, mockClient);

      expect(result.isError).toBe(true);
      const data = JSON.parse(result.content[0].text);
      expect(data.error).toBe('Client not found');
    });

    it('should handle API errors gracefully', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await toolTiempoBeneficiosImplementation({
        codcliente: 'CLI001'
      }, mockClient);

      expect(result.isError).toBe(true);
      const data = JSON.parse(result.content[0].text);
      expect(data.error).toBe('Failed to calculate tiempo beneficios');
    });

    it('should require codcliente parameter', async () => {
      const mockClient = createMockClient();

      const result = await toolTiempoBeneficiosImplementation({}, mockClient);

      expect(result.isError).toBe(true);
      const data = JSON.parse(result.content[0].text);
      expect(data.error).toBe('Parameter validation failed');
      expect(data.message).toContain('codcliente');
    });
  });

  describe('Date calculations', () => {
    it('should handle different date formats correctly', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{
            codcliente: 'CLI003',
            fechaalta: '01-12-2023' // DD-MM-YYYY
          }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 4, fecha: '15-12-2023', total: 100 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 4, fechapago: '20-12-2023', importe: 100 }],
          meta: { total: 1, hasMore: false }
        });

      const result = await toolTiempoBeneficiosImplementation({
        codcliente: 'CLI003'
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      expect(data.tiempo_hasta_primer_pago_dias).toBe(19); // 01-12 to 20-12
    });
  });
});