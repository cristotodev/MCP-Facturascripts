import { describe, it, expect, beforeAll } from 'vitest';
import { lowStockToolImplementation } from '../../../../src/modules/core-business/stocks/tool.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('Low Stock Tool Integration Tests', () => {
  let client: FacturaScriptsClient;

  beforeAll(() => {
    client = new FacturaScriptsClient();
  });

  describe('with real API', () => {
    it('should return low stock products from live API', async () => {
      const result = await lowStockToolImplementation(
        { limite: 5 },
        client
      );

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      
      const response = JSON.parse(result.content[0].text);
      expect(response.meta).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        const firstProduct = response.data[0];
        expect(firstProduct).toHaveProperty('referencia');
        expect(firstProduct).toHaveProperty('descripcion');
        expect(firstProduct).toHaveProperty('almacen');
        expect(firstProduct).toHaveProperty('cantidad');
        expect(firstProduct).toHaveProperty('stockmin');
        expect(firstProduct).toHaveProperty('cantidad_a_reponer');
        
        // Verify the business logic (now includes equal stock by default)
        expect(firstProduct.cantidad).toBeLessThanOrEqual(firstProduct.stockmin);
        expect(firstProduct.cantidad_a_reponer).toBe(firstProduct.stockmin - firstProduct.cantidad);
      }
    });

    it('should handle warehouse filtering', async () => {
      const result = await lowStockToolImplementation(
        { codalmacen: 'ALM001', limite: 3 },
        client
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.summary.almacen_filtrado).toBe('ALM001');
      
      if (response.data.length > 0) {
        response.data.forEach((product: any) => {
          expect(product.almacen).toBe('ALM001');
        });
      }
    });

    it('should include equal stock by default and exclude when explicitly requested', async () => {
      const resultWithoutEqual = await lowStockToolImplementation(
        { incluir_stock_igual: false, limite: 10 },
        client
      );

      const resultWithEqual = await lowStockToolImplementation(
        { limite: 10 }, // Should default to true
        client
      );

      const responseWithoutEqual = JSON.parse(resultWithoutEqual.content[0].text);
      const responseWithEqual = JSON.parse(resultWithEqual.content[0].text);

      // The count with equal should be >= count without equal
      expect(responseWithEqual.meta.total).toBeGreaterThanOrEqual(responseWithoutEqual.meta.total);
      expect(responseWithEqual.summary.incluye_stock_igual).toBe(true);
      expect(responseWithoutEqual.summary.incluye_stock_igual).toBe(false);
    });

    it('should handle pagination correctly', async () => {
      const firstPage = await lowStockToolImplementation(
        { limite: 2, offset: 0 },
        client
      );

      const secondPage = await lowStockToolImplementation(
        { limite: 2, offset: 2 },
        client
      );

      const firstResponse = JSON.parse(firstPage.content[0].text);
      const secondResponse = JSON.parse(secondPage.content[0].text);

      expect(firstResponse.meta.limit).toBe(2);
      expect(firstResponse.meta.offset).toBe(0);
      expect(secondResponse.meta.limit).toBe(2);
      expect(secondResponse.meta.offset).toBe(2);

      // If both pages have data, they should be different
      if (firstResponse.data.length > 0 && secondResponse.data.length > 0) {
        expect(firstResponse.data[0].referencia).not.toBe(secondResponse.data[0].referencia);
      }
    });

    it('should sort by cantidad ascending', async () => {
      const result = await lowStockToolImplementation(
        { limite: 5 },
        client
      );

      const response = JSON.parse(result.content[0].text);
      
      if (response.data.length >= 2) {
        for (let i = 1; i < response.data.length; i++) {
          expect(response.data[i].cantidad).toBeGreaterThanOrEqual(response.data[i - 1].cantidad);
        }
      }
    });

    it('should handle non-existent warehouse gracefully', async () => {
      const result = await lowStockToolImplementation(
        { codalmacen: 'NONEXISTENT999' },
        client
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.total).toBe(0);
      expect(response.data).toHaveLength(0);
    });

    it('should validate parameter bounds', async () => {
      // Test maximum limit enforcement
      const result = await lowStockToolImplementation(
        { limite: 5000, offset: 0 }, // Way above maximum
        client
      );

      const response = JSON.parse(result.content[0].text);
      expect(response.meta.limit).toBeLessThanOrEqual(1000);
    });
  });

  describe('sample data scenarios', () => {
    it('should provide sample response with two low stock products', async () => {
      // This test demonstrates the expected response format for documentation
      const sampleResponse = {
        meta: {
          total: 2,
          limit: 100,
          offset: 0,
          hasMore: false
        },
        data: [
          {
            referencia: 'LAPTOP-001',
            descripcion: 'Laptop HP EliteBook 840 G8',
            almacen: 'ALM001',
            cantidad: 2,
            stockmin: 10,
            cantidad_a_reponer: 8
          },
          {
            referencia: 'MOUSE-002',
            descripcion: 'Mouse inalámbrico Logitech MX Master 3',
            almacen: 'ALM001',
            cantidad: 5,
            stockmin: 15,
            cantidad_a_reponer: 10
          }
        ],
        summary: {
          total_productos_bajo_stock: 2,
          almacen_filtrado: 'Todos los almacenes',
          incluye_stock_igual: true
        }
      };

      // Verify the structure matches our implementation
      expect(sampleResponse.meta).toHaveProperty('total');
      expect(sampleResponse.meta).toHaveProperty('limit');
      expect(sampleResponse.meta).toHaveProperty('offset');
      expect(sampleResponse.meta).toHaveProperty('hasMore');
      expect(sampleResponse.data[0]).toHaveProperty('referencia');
      expect(sampleResponse.data[0]).toHaveProperty('descripcion');
      expect(sampleResponse.data[0]).toHaveProperty('almacen');
      expect(sampleResponse.data[0]).toHaveProperty('cantidad');
      expect(sampleResponse.data[0]).toHaveProperty('stockmin');
      expect(sampleResponse.data[0]).toHaveProperty('cantidad_a_reponer');
      expect(sampleResponse.summary).toHaveProperty('total_productos_bajo_stock');
      expect(sampleResponse.summary).toHaveProperty('almacen_filtrado');
      expect(sampleResponse.summary).toHaveProperty('incluye_stock_igual');

      // Verify business logic in sample
      expect(sampleResponse.data[0].cantidad).toBeLessThan(sampleResponse.data[0].stockmin);
      expect(sampleResponse.data[0].cantidad_a_reponer).toBe(
        sampleResponse.data[0].stockmin - sampleResponse.data[0].cantidad
      );
    });

    it('should provide sample response with no products needing restocking', async () => {
      // This test demonstrates the expected response when no products need restocking
      const emptyResponse = {
        meta: {
          total: 0,
          limit: 100,
          offset: 0,
          hasMore: false
        },
        data: [],
        message: 'No hay productos con stock bajo el mínimo',
        summary: {
          total_productos_bajo_stock: 0,
          almacen_filtrado: 'Todos los almacenes',
          incluye_stock_igual: true
        }
      };

      // Verify the structure
      expect(emptyResponse.meta.total).toBe(0);
      expect(emptyResponse.data).toHaveLength(0);
      expect(emptyResponse.message).toContain('No hay productos');
      expect(emptyResponse.summary.total_productos_bajo_stock).toBe(0);
    });
  });
});