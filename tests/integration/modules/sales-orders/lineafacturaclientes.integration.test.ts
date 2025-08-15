import { describe, it, expect, beforeAll } from 'vitest';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { toolProductosMasVendidosImplementation } from '../../../../src/modules/sales-orders/line-items/lineafacturaclientes/tool.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('LineaFacturaClientes Integration Tests', () => {
  let client: FacturaScriptsClient;

  beforeAll(() => {
    client = new FacturaScriptsClient();
  });

  describe('get_productos_mas_vendidos tool with real API', () => {
    it('should handle no invoices found in period gracefully', async () => {
      // Use a date range far in the future where no invoices should exist
      const result = await toolProductosMasVendidosImplementation(
        {
          fecha_desde: '2030-01-01',
          fecha_hasta: '2030-01-31',
          limit: 10
        },
        client
      );

      expect(result.content[0].type).toBe('text');
      
      const parsedResult = JSON.parse(result.content[0].text);
      
      // Should gracefully handle no invoices found
      expect(parsedResult.message).toBe('No se encontraron facturas en el período especificado');
      expect(parsedResult.period).toEqual({
        fecha_desde: '2030-01-01',
        fecha_hasta: '2030-01-31'
      });

      // Verify response structure
      expect(parsedResult).toHaveProperty('meta');
      expect(parsedResult.meta).toHaveProperty('total', 0);
      expect(parsedResult.meta).toHaveProperty('limit', 10);
      expect(parsedResult.meta).toHaveProperty('offset', 0);
      expect(parsedResult.meta).toHaveProperty('hasMore', false);
      expect(Array.isArray(parsedResult.data)).toBe(true);
      expect(parsedResult.data).toHaveLength(0);
    }, 15000);

    it('should handle a realistic date range with real data structure', async () => {
      // Use a reasonable date range that might have data
      const result = await toolProductosMasVendidosImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-12-31',
          limit: 5,
          order: 'cantidad_total:desc'
        },
        client
      );

      expect(result.content[0].type).toBe('text');
      
      const parsedResult = JSON.parse(result.content[0].text);
      
      // Verify response structure regardless of whether data exists
      expect(parsedResult).toHaveProperty('period');
      expect(parsedResult.period).toEqual({
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-12-31'
      });

      expect(parsedResult).toHaveProperty('meta');
      expect(parsedResult.meta).toHaveProperty('total');
      expect(parsedResult.meta).toHaveProperty('limit', 5);
      expect(parsedResult.meta).toHaveProperty('offset', 0);
      expect(parsedResult.meta).toHaveProperty('hasMore');
      expect(Array.isArray(parsedResult.data)).toBe(true);

      // If there is data, verify it has the expected structure
      if (parsedResult.data.length > 0) {
        const firstProduct = parsedResult.data[0];
        expect(firstProduct).toHaveProperty('descripcion');
        expect(firstProduct).toHaveProperty('cantidad_total');
        expect(firstProduct).toHaveProperty('total_facturado');
        expect(typeof firstProduct.cantidad_total).toBe('number');
        expect(typeof firstProduct.total_facturado).toBe('number');
        expect(typeof firstProduct.descripcion).toBe('string');
        // referencia can be string or null
        expect(['string', 'object']).toContain(typeof firstProduct.referencia);
      }

      // Verify pagination limits are respected
      expect(parsedResult.data.length).toBeLessThanOrEqual(5);
    }, 20000);

    it('should respect limit parameter bounds', async () => {
      // Test with various limit values
      const result = await toolProductosMasVendidosImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-12-31',
          limit: 2000, // Should be capped at 1000
          offset: -5   // Should be set to 0
        },
        client
      );

      expect(result.content[0].type).toBe('text');
      
      const parsedResult = JSON.parse(result.content[0].text);
      
      // Verify limits are enforced
      expect(parsedResult.meta.limit).toBe(1000); // Capped at maximum
      expect(parsedResult.meta.offset).toBe(0);   // Minimum enforced
    }, 15000);

    it('should handle different sorting options', async () => {
      // Test sorting by total_facturado
      const result = await toolProductosMasVendidosImplementation(
        {
          fecha_desde: '2024-01-01',
          fecha_hasta: '2024-12-31',
          limit: 3,
          order: 'total_facturado:desc'
        },
        client
      );

      expect(result.content[0].type).toBe('text');
      
      const parsedResult = JSON.parse(result.content[0].text);
      
      // Verify response structure
      expect(parsedResult).toHaveProperty('period');
      expect(parsedResult).toHaveProperty('meta');
      expect(Array.isArray(parsedResult.data)).toBe(true);

      // If there are multiple products, verify sorting
      if (parsedResult.data.length > 1) {
        for (let i = 0; i < parsedResult.data.length - 1; i++) {
          expect(parsedResult.data[i].total_facturado).toBeGreaterThanOrEqual(
            parsedResult.data[i + 1].total_facturado
          );
        }
      }
    }, 15000);

    it('should handle malformed date parameters gracefully', async () => {
      // Test with invalid date format to trigger parameter validation
      const result = await toolProductosMasVendidosImplementation(
        {
          fecha_desde: 'invalid-date',
          fecha_hasta: 'also-invalid'
        },
        client
      );

      expect(result.content[0].type).toBe('text');
      
      const parsedResult = JSON.parse(result.content[0].text);
      
      // Should return valid response structure even with invalid dates
      expect(parsedResult).toHaveProperty('period');
      expect(parsedResult.period).toEqual({
        fecha_desde: 'invalid-date',
        fecha_hasta: 'also-invalid'
      });
      expect(parsedResult).toHaveProperty('meta');
      expect(Array.isArray(parsedResult.data)).toBe(true);
      
      // The API should handle date validation, so we might get empty results 
      // or an error message, both are acceptable
      if (parsedResult.error) {
        expect(parsedResult.error).toBeTruthy();
        expect(parsedResult.data).toHaveLength(0);
      }
    }, 10000);
  });
});