import { describe, it, expect, beforeAll } from 'vitest';
import { toolFacturasConErroresImplementation } from '../../../../../src/modules/sales-orders/facturaclientes/tool.js';
import { FacturaScriptsClient } from '../../../../../src/fs/client.js';

// Integration tests - only run if environment is configured and not in CI
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('get_facturas_con_errores integration tests', () => {
  let client: FacturaScriptsClient;

  beforeAll(() => {
    client = new FacturaScriptsClient();
  });

  it('should return error analysis for all invoices', async () => {
    const result = await toolFacturasConErroresImplementation({
      limit: 10
    }, client);

    expect(result).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');

    const resultData = JSON.parse(result.content[0].text);
    
    // Should have meta information
    expect(resultData.meta).toBeDefined();
    expect(resultData.meta.total).toBeTypeOf('number');
    expect(resultData.meta.limit).toBe(10);
    expect(resultData.meta.offset).toBe(0);
    expect(resultData.meta.hasMore).toBeTypeOf('boolean');

    // Should have data array
    expect(resultData.data).toBeDefined();
    expect(Array.isArray(resultData.data)).toBe(true);

    // If there are results, validate structure
    if (resultData.data.length > 0) {
      resultData.data.forEach((factura: any) => {
        expect(factura).toHaveProperty('codigo');
        expect(factura).toHaveProperty('codcliente');
        expect(factura).toHaveProperty('fecha');
        expect(factura).toHaveProperty('total');
        expect(factura).toHaveProperty('errores');
        expect(Array.isArray(factura.errores)).toBe(true);
        expect(factura.errores.length).toBeGreaterThan(0);
        
        // Each invoice should have at least one error type
        const validErrors = [
          'total vacío o negativo',
          'cliente no asignado',
          'fecha inválida',
          'factura sin líneas',
          'posible duplicado'
        ];
        
        factura.errores.forEach((error: string) => {
          expect(validErrors).toContain(error);
        });
      });
    }
  }, 30000);

  it('should handle date range filtering', async () => {
    const result = await toolFacturasConErroresImplementation({
      fecha_desde: '2024-01-01',
      fecha_hasta: '2024-12-31',
      limit: 5
    }, client);

    expect(result).toBeDefined();
    const resultData = JSON.parse(result.content[0].text);
    
    expect(resultData.meta).toBeDefined();
    expect(resultData.meta.limit).toBe(5);
    expect(resultData.data).toBeDefined();
    expect(Array.isArray(resultData.data)).toBe(true);
    
    // Validate that returned invoices are within date range if any exist
    if (resultData.data.length > 0) {
      resultData.data.forEach((factura: any) => {
        if (factura.fecha && factura.fecha !== '') {
          const facturaDate = new Date(factura.fecha);
          const fromDate = new Date('2024-01-01');
          const toDate = new Date('2024-12-31');
          
          // Only validate if date is valid (some invoices might have invalid dates as errors)
          if (!isNaN(facturaDate.getTime())) {
            expect(facturaDate.getTime()).toBeGreaterThanOrEqual(fromDate.getTime());
            expect(facturaDate.getTime()).toBeLessThanOrEqual(toDate.getTime());
          }
        }
      });
    }
  }, 30000);

  it('should handle pagination correctly', async () => {
    // First get total count
    const firstResult = await toolFacturasConErroresImplementation({
      limit: 5,
      offset: 0
    }, client);

    const firstData = JSON.parse(firstResult.content[0].text);
    
    if (firstData.meta.total > 5) {
      // Get second page
      const secondResult = await toolFacturasConErroresImplementation({
        limit: 5,
        offset: 5
      }, client);

      const secondData = JSON.parse(secondResult.content[0].text);
      
      expect(secondData.meta.total).toBe(firstData.meta.total);
      expect(secondData.meta.limit).toBe(5);
      expect(secondData.meta.offset).toBe(5);
      
      // Should have different data on different pages
      if (secondData.data.length > 0 && firstData.data.length > 0) {
        expect(secondData.data[0].codigo).not.toBe(firstData.data[0].codigo);
      }
    }
  }, 30000);

  it('should handle only fecha_desde parameter', async () => {
    const result = await toolFacturasConErroresImplementation({
      fecha_desde: '2020-01-01',
      limit: 3
    }, client);

    expect(result).toBeDefined();
    const resultData = JSON.parse(result.content[0].text);
    
    expect(resultData.meta).toBeDefined();
    expect(resultData.data).toBeDefined();
    expect(Array.isArray(resultData.data)).toBe(true);
  }, 30000);

  it('should handle only fecha_hasta parameter', async () => {
    const result = await toolFacturasConErroresImplementation({
      fecha_hasta: '2030-12-31',
      limit: 3
    }, client);

    expect(result).toBeDefined();
    const resultData = JSON.parse(result.content[0].text);
    
    expect(resultData.meta).toBeDefined();
    expect(resultData.data).toBeDefined();
    expect(Array.isArray(resultData.data)).toBe(true);
  }, 30000);

  it('should handle edge case with no invoices in date range', async () => {
    const result = await toolFacturasConErroresImplementation({
      fecha_desde: '1990-01-01',
      fecha_hasta: '1990-12-31',
      limit: 10
    }, client);

    expect(result).toBeDefined();
    const resultData = JSON.parse(result.content[0].text);
    
    // Should return empty results or proper message
    if (resultData.message) {
      expect(resultData.message).toContain('No se encontraron facturas');
    }
    
    expect(resultData.meta.total).toBe(0);
    expect(resultData.data).toEqual([]);
  }, 30000);

  it('should validate parameter bounds', async () => {
    const result = await toolFacturasConErroresImplementation({
      limit: 2000, // Over limit, should be capped to 1000
      offset: -5   // Below limit, should be set to 0
    }, client);

    expect(result).toBeDefined();
    const resultData = JSON.parse(result.content[0].text);
    
    // Verify the tool properly handled parameter bounds
    expect(resultData.meta.limit).toBeLessThanOrEqual(1000);
    expect(resultData.meta.offset).toBeGreaterThanOrEqual(0);
  }, 30000);

  it('should handle various error types if they exist in data', async () => {
    const result = await toolFacturasConErroresImplementation({
      limit: 50 // Get more results to increase chance of finding different error types
    }, client);

    expect(result).toBeDefined();
    const resultData = JSON.parse(result.content[0].text);
    
    if (resultData.data.length > 0) {
      // Collect all error types found
      const allErrors = new Set<string>();
      resultData.data.forEach((factura: any) => {
        factura.errores.forEach((error: string) => {
          allErrors.add(error);
        });
      });

      // Verify error types are valid
      const validErrors = [
        'total vacío o negativo',
        'cliente no asignado', 
        'fecha inválida',
        'factura sin líneas',
        'posible duplicado'
      ];

      allErrors.forEach(error => {
        expect(validErrors).toContain(error);
      });

      // Log found error types for debugging
      console.log('Error types found:', Array.from(allErrors));
    }
  }, 30000);

  it('should handle invalid date ranges gracefully', async () => {
    // Test with invalid date format to trigger error handling
    const result = await toolFacturasConErroresImplementation({
      fecha_desde: 'invalid-date-format',
      fecha_hasta: 'also-invalid',
      limit: 5
    }, client);

    expect(result).toBeDefined();
    
    // The tool should still return a response (either with results or proper error handling)
    const resultData = JSON.parse(result.content[0].text);
    expect(resultData).toBeDefined();
    
    // Either we get results or an error, both are acceptable for this edge case
    if (resultData.error) {
      expect(resultData.error).toBeDefined();
      expect(resultData.message).toBeDefined();
    } else {
      expect(resultData.meta).toBeDefined();
      expect(resultData.data).toBeDefined();
    }
  }, 30000);
});