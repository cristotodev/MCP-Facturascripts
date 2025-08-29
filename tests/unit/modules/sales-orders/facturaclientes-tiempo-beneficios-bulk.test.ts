import { describe, it, expect, vi } from 'vitest';
import { toolTiempoBeneficiosBulkImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool-tiempo-beneficios-bulk.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('get_tiempo_beneficios_todos_clientes tool', () => {
  const createMockClient = () => ({
    getWithPagination: vi.fn(),
  }) as unknown as FacturaScriptsClient;

  describe('Success scenarios', () => {
    it('should calculate time to benefits for all clients with statistics', async () => {
      const mockClient = createMockClient();

      // Mock all clients
      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente 1', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente 2', fechaalta: '15-01-2024' }
          ],
          meta: { total: 2, hasMore: false }
        })
        // Facturas CLI001
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // Recibos CLI001
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // Facturas CLI002
        .mockResolvedValueOnce({
          data: [{ idfactura: 2, total: 500 }],
          meta: { total: 1, hasMore: false }
        })
        // Recibos CLI002
        .mockResolvedValueOnce({
          data: [{ fechapago: '25-01-2024', importe: 500 }],
          meta: { total: 1, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: true // Explicitly set to test all clients
      }, mockClient);

      expect(result.content[0].text).toBeDefined();
      const data = JSON.parse(result.content[0].text);
      
      expect(data.resumen_estadisticas).toBeDefined();
      expect(data.resumen_estadisticas.total_clientes_analizados).toBe(2);
      expect(data.resumen_estadisticas.clientes_con_pagos).toBe(2);
      expect(data.resumen_estadisticas.media_dias_primer_pago).toBe(9.5); // (9+10)/2
      expect(data.detalle_clientes).toHaveLength(2);
      expect(data.detalle_clientes[0].codcliente).toBe('CLI001');
    });

    it('should handle clients with no invoices', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{ codcliente: 'CLI001', nombre: 'Cliente Sin Facturas', fechaalta: '01-01-2024' }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No invoices
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: true // Explicitly set to include clients without invoices
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      expect(data.resumen_estadisticas.clientes_sin_facturas).toBe(1);
      expect(data.detalle_clientes[0].total_facturado).toBe(0);
    });

    it('should respect pagination parameters', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente 1', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente 2', fechaalta: '15-01-2024' }
          ],
          meta: { total: 10, hasMore: true }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        limit: 2,
        offset: 5
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      expect(data.meta.total_clientes_disponibles).toBe(10);
      expect(data.meta.limit).toBe(2);
      expect(data.meta.offset).toBe(5);
    });
  });

  describe('Error scenarios', () => {
    it('should handle when no clients exist', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({}, mockClient);

      const data = JSON.parse(result.content[0].text);
      expect(data.resumen_estadisticas.total_clientes_analizados).toBe(0);
      expect(data.detalle_clientes).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockRejectedValueOnce(new Error('API Error'));

      const result = await toolTiempoBeneficiosBulkImplementation({}, mockClient);

      expect(result.isError).toBe(true);
      const data = JSON.parse(result.content[0].text);
      expect(data.error).toBe('Failed to calculate bulk tiempo beneficios');
    });

    it('should validate limit parameter bounds', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{ codcliente: 'CLI001', nombre: 'Test', fechaalta: '01-01-2024' }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      // Test with limit > 50 should be capped to 50 (when incluir_sin_facturas=false by default)
      const result = await toolTiempoBeneficiosBulkImplementation({
        limit: 1000
      }, mockClient);

      expect(vi.mocked(mockClient.getWithPagination)).toHaveBeenCalledWith(
        '/clientes',
        50, // Should be capped to 50 (default incluir_sin_facturas=false)
        0,
        {}
      );
    });
  });

  describe('Statistics calculations', () => {
    it('should calculate comprehensive statistics correctly', async () => {
      const mockClient = createMockClient();

      // Setup data for 3 clients with different scenarios
      vi.mocked(mockClient.getWithPagination)
        // All clients
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente Rapido', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente Lento', fechaalta: '01-01-2024' },
            { codcliente: 'CLI003', nombre: 'Cliente Sin Pagos', fechaalta: '01-01-2024' }
          ],
          meta: { total: 3, hasMore: false }
        })
        // CLI001 facturas
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI001 recibos - pago rápido (5 días)
        .mockResolvedValueOnce({
          data: [{ fechapago: '06-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI002 facturas  
        .mockResolvedValueOnce({
          data: [{ idfactura: 2, total: 2000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI002 recibos - pago lento (15 días)
        .mockResolvedValueOnce({
          data: [{ fechapago: '16-01-2024', importe: 2000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI003 facturas
        .mockResolvedValueOnce({
          data: [{ idfactura: 3, total: 500 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI003 recibos - sin pagos
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: true // Explicitly set to test comprehensive statistics
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      const stats = data.resumen_estadisticas;

      expect(stats.total_clientes_analizados).toBe(3);
      expect(stats.clientes_con_pagos).toBe(2);
      expect(stats.clientes_sin_pagos).toBe(1);
      expect(stats.media_dias_primer_pago).toBe(10); // (5+15)/2
      expect(stats.mediana_dias_primer_pago).toBe(10); // Middle value of [5,15]
      expect(stats.total_facturado_general).toBe(3500);
      expect(stats.total_pagado_general).toBe(3000);
      expect(stats.porcentaje_clientes_con_pagos).toBe(66.67);
    });
  });

  describe('incluir_sin_facturas parameter', () => {
    it('should include clients without invoices when incluir_sin_facturas is true', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente Con Facturas', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente Sin Facturas', fechaalta: '15-01-2024' }
          ],
          meta: { total: 2, hasMore: false }
        })
        // CLI001 facturas
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI001 recibos
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI002 facturas (sin facturas)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: true
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      const stats = data.resumen_estadisticas;

      expect(stats.total_clientes_analizados).toBe(2);
      expect(stats.clientes_sin_facturas).toBe(1);
      expect(data.detalle_clientes).toHaveLength(2);
      
      const clienteSinFacturas = data.detalle_clientes.find(c => c.codcliente === 'CLI002');
      expect(clienteSinFacturas).toBeDefined();
      expect(clienteSinFacturas.numero_facturas).toBe(0);
    });

    it('should exclude clients without invoices when incluir_sin_facturas is false', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente Con Facturas', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente Sin Facturas', fechaalta: '15-01-2024' }
          ],
          meta: { total: 2, hasMore: false }
        })
        // CLI001 facturas
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI001 recibos
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI002 facturas (sin facturas)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: false
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      const stats = data.resumen_estadisticas;

      // Este es el bug - debería ser 1, no 2
      expect(stats.total_clientes_analizados).toBe(1);
      expect(stats.clientes_sin_facturas).toBe(0);
      expect(data.detalle_clientes).toHaveLength(1);
      
      const clienteSinFacturas = data.detalle_clientes.find(c => c.codcliente === 'CLI002');
      expect(clienteSinFacturas).toBeUndefined();
      
      const clienteConFacturas = data.detalle_clientes.find(c => c.codcliente === 'CLI001');
      expect(clienteConFacturas).toBeDefined();
    });

    it('should handle all clients without invoices when incluir_sin_facturas is false', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente Sin Facturas 1', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente Sin Facturas 2', fechaalta: '15-01-2024' }
          ],
          meta: { total: 2, hasMore: false }
        })
        // CLI001 facturas (sin facturas)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        })
        // CLI002 facturas (sin facturas)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: false
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      const stats = data.resumen_estadisticas;

      expect(stats.total_clientes_analizados).toBe(0);
      expect(stats.clientes_sin_facturas).toBe(0);
      expect(data.detalle_clientes).toHaveLength(0);
    });

    it('should demonstrate documented behavior: total_clientes_disponibles vs total_clientes_analizados', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente Con Facturas', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente Sin Facturas', fechaalta: '15-01-2024' }
          ],
          meta: { total: 2, hasMore: false } // Always 2 regardless of incluir_sin_facturas
        })
        // CLI001 facturas
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI001 recibos
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI002 facturas (sin facturas)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const resultWithout = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: false
      }, mockClient);

      const dataWithout = JSON.parse(resultWithout.content[0].text);

      // total_clientes_disponibles should be same in both cases (from API)
      expect(dataWithout.meta.total_clientes_disponibles).toBe(2);
      // But total_clientes_analizados should be different
      expect(dataWithout.resumen_estadisticas.total_clientes_analizados).toBe(1);

      // Reset mock for second call
      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Cliente Con Facturas', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Cliente Sin Facturas', fechaalta: '15-01-2024' }
          ],
          meta: { total: 2, hasMore: false } // Always 2 regardless of incluir_sin_facturas
        })
        // CLI001 facturas
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI001 recibos
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        // CLI002 facturas (sin facturas)
        .mockResolvedValueOnce({
          data: [],
          meta: { total: 0, hasMore: false }
        });

      const resultWith = await toolTiempoBeneficiosBulkImplementation({
        incluir_sin_facturas: true
      }, mockClient);

      const dataWith = JSON.parse(resultWith.content[0].text);

      // total_clientes_disponibles should be same in both cases (from API)
      expect(dataWith.meta.total_clientes_disponibles).toBe(2);
      // But total_clientes_analizados should be different
      expect(dataWith.resumen_estadisticas.total_clientes_analizados).toBe(2);

      // This demonstrates the documented behavior that LLMs should understand:
      // 
      // ✅ total_clientes_disponibles (meta): ALWAYS the same - represents total clients in DB
      // ✅ total_clientes_analizados (estadisticas): CHANGES based on incluir_sin_facturas
      // ✅ detalle_clientes.length: ALWAYS equals total_clientes_analizados
      //
      // When checking if incluir_sin_facturas works, compare:
      // - total_clientes_analizados (should be different)
      // - detalle_clientes.length (should be different) 
      // - clientes_sin_facturas (should be 0 when incluir_sin_facturas=false)
      //
      // DO NOT compare total_clientes_disponibles (always same)
      expect(dataWithout.meta.total_clientes_disponibles).toBe(dataWith.meta.total_clientes_disponibles);
      expect(dataWithout.resumen_estadisticas.total_clientes_analizados).not.toBe(dataWith.resumen_estadisticas.total_clientes_analizados);
      expect(dataWithout.detalle_clientes.length).toBe(dataWithout.resumen_estadisticas.total_clientes_analizados);
      expect(dataWith.detalle_clientes.length).toBe(dataWith.resumen_estadisticas.total_clientes_analizados);
    });

    it('should apply documented automatic limit reduction when incluir_sin_facturas=false (max 50 per request)', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{ codcliente: 'CLI001', nombre: 'Test Client', fechaalta: '01-01-2024' }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }], // Full invoice data
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        limit: 100, // Request 100 but should be reduced to 50
        incluir_sin_facturas: false
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      
      // Verify that the effective limit was applied (50 max when incluir_sin_facturas=false)
      expect(data.meta.limit).toBe(50);
      
      // Verify the first getWithPagination call used the reduced limit
      expect(vi.mocked(mockClient.getWithPagination)).toHaveBeenNthCalledWith(
        1, // First call
        '/clientes',
        50, // Should be reduced to 50
        0,
        {}
      );
    });

    it('should apply new limit reduction for incluir_sin_facturas=true (max 100 per request)', async () => {
      const mockClient = createMockClient();

      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [{ codcliente: 'CLI001', nombre: 'Test Client', fechaalta: '01-01-2024' }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        limit: 500, // Request 500 but should be reduced to 100
        incluir_sin_facturas: true
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      
      // Verify that the effective limit was applied (100 max when incluir_sin_facturas=true)
      expect(data.meta.limit).toBe(100);
      
      // Verify the first getWithPagination call used the reduced limit
      expect(vi.mocked(mockClient.getWithPagination)).toHaveBeenNthCalledWith(
        1, // First call
        '/clientes',
        100, // Should be reduced to 100
        0,
        {}
      );
    });

    it('should demonstrate documented pagination pattern for processing all clients', async () => {
      const mockClient = createMockClient();

      // Simulate hasMore=true scenario (more clients available)
      vi.mocked(mockClient.getWithPagination)
        .mockResolvedValueOnce({
          data: [
            { codcliente: 'CLI001', nombre: 'Client 1', fechaalta: '01-01-2024' },
            { codcliente: 'CLI002', nombre: 'Client 2', fechaalta: '02-01-2024' }
          ],
          meta: { total: 150, hasMore: true } // More clients available
        })
        .mockResolvedValueOnce({
          data: [{ idfactura: 1, total: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [{ fechapago: '10-01-2024', importe: 1000 }],
          meta: { total: 1, hasMore: false }
        })
        .mockResolvedValueOnce({
          data: [], // No invoices for second client
          meta: { total: 0, hasMore: false }
        });

      const result = await toolTiempoBeneficiosBulkImplementation({
        limit: 50,
        offset: 0,
        incluir_sin_facturas: false
      }, mockClient);

      const data = JSON.parse(result.content[0].text);
      
      // Should indicate more data is available for pagination
      expect(data.meta.hasMore).toBe(true);
      expect(data.meta.total_clientes_disponibles).toBe(150);
      expect(data.meta.limit).toBe(50);
      expect(data.meta.offset).toBe(0);
      
      // Should only include clients with invoices (1 out of 2)
      expect(data.resumen_estadisticas.total_clientes_analizados).toBe(1);
      expect(data.detalle_clientes).toHaveLength(1);
      
      // Next call should use offset=50 to continue pagination
      // This demonstrates the documented pattern
    });
  });
});