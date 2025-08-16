import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { FacturaclientesResource } from '../../../../src/modules/sales-orders/facturaclientes/resource.js';
import { toolByCifnifImplementation, toolClientesMorososImplementation, toolClientesTopFacturacionImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Facturaclientes Integration Tests', () => {
  let client: FacturaScriptsClient;
  let facturaclientesResource: FacturaclientesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    facturaclientesResource = new FacturaclientesResource(client);
  });

  it('should fetch facturaclientes from real API', async () => {
    const result = await facturaclientesResource.getResource('facturascripts://facturaclientes?limit=5');

    expect(result.uri).toBe('facturascripts://facturaclientes?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts FacturaClientes( \(Error\))?$/);
    expect(result.mimeType).toBe('application/json');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    expect(data).toHaveProperty('meta');
    expect(data).toHaveProperty('data');
    // If it's an error response, check error structure
    if (result.name.includes('(Error)')) {
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('message');
      expect(data.meta.total).toBe(0);
    } else {
      expect(data.meta).toHaveProperty('total');
    }
    expect(data.meta).toHaveProperty('limit', 5);
    expect(data.meta).toHaveProperty('offset', 0);
    expect(Array.isArray(data.data)).toBe(true);
  }, 10000);

  it('should handle get_facturas_cliente_por_cifnif tool with real API', async () => {
    // Test with a non-existent CIF/NIF to ensure error handling works
    const result = await toolByCifnifImplementation(
      { cifnif: 'NONEXISTENT123' },
      client
    );

    // Should return an error response for non-existent client
    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // This should be an error case (client not found)
    if (result.isError) {
      expect(parsedResult.error).toBe('Client not found');
      expect(parsedResult.message).toContain('NONEXISTENT123');
    }

    // Verify response structure
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult.meta).toHaveProperty('total', 0);
    expect(parsedResult.meta).toHaveProperty('limit');
    expect(parsedResult.meta).toHaveProperty('offset');
    expect(parsedResult.meta).toHaveProperty('hasMore', false);
    expect(Array.isArray(parsedResult.data)).toBe(true);
    expect(parsedResult.data).toHaveLength(0);
  }, 15000);

  it('should handle get_clientes_morosos tool with real API', async () => {
    // Test the tool with real API - should return either data or proper error
    const result = await toolClientesMorososImplementation(
      { limit: 10, offset: 0 },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Should have proper response structure regardless of whether there are morosos or not
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult.meta).toHaveProperty('total');
    expect(parsedResult.meta).toHaveProperty('limit', 10);
    expect(parsedResult.meta).toHaveProperty('offset', 0);
    expect(parsedResult.meta).toHaveProperty('hasMore');
    expect(Array.isArray(parsedResult.data)).toBe(true);

    // If there are morosos clients, verify structure
    if (parsedResult.data.length > 0) {
      const firstClient = parsedResult.data[0];
      expect(firstClient).toHaveProperty('codcliente');
      expect(firstClient).toHaveProperty('nombre');
      expect(firstClient).toHaveProperty('cifnif');
      expect(firstClient).toHaveProperty('email');
      expect(firstClient).toHaveProperty('total_pendiente');
      expect(firstClient).toHaveProperty('facturas_vencidas');
      expect(firstClient).toHaveProperty('codigos_facturas');
      expect(Array.isArray(firstClient.codigos_facturas)).toBe(true);
      expect(typeof firstClient.total_pendiente).toBe('number');
      expect(typeof firstClient.facturas_vencidas).toBe('number');
      expect(firstClient.facturas_vencidas).toBeGreaterThan(0);
      expect(firstClient.total_pendiente).toBeGreaterThan(0);
    }

    // If no morosos, should have appropriate message
    if (parsedResult.data.length === 0) {
      // Could be either no invoices or no overdue unpaid invoices
      if (parsedResult.message) {
        expect(parsedResult.message).toMatch(/No se encontraron/);
      }
    }

    // Verify sorting (if multiple clients, should be sorted by total_pendiente desc)
    if (parsedResult.data.length > 1) {
      for (let i = 1; i < parsedResult.data.length; i++) {
        expect(parsedResult.data[i-1].total_pendiente).toBeGreaterThanOrEqual(
          parsedResult.data[i].total_pendiente
        );
      }
    }
  }, 20000);

  it('should handle pagination with get_clientes_morosos tool', async () => {
    // Test pagination with small limit
    const result = await toolClientesMorososImplementation(
      { limit: 1, offset: 0 },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Verify pagination structure
    expect(parsedResult.meta).toHaveProperty('total');
    expect(parsedResult.meta).toHaveProperty('limit', 1);
    expect(parsedResult.meta).toHaveProperty('offset', 0);
    expect(parsedResult.meta).toHaveProperty('hasMore');
    
    // Should return at most 1 result
    expect(parsedResult.data.length).toBeLessThanOrEqual(1);
    
    // If there's data and total > 1, hasMore should be true
    if (parsedResult.data.length === 1 && parsedResult.meta.total > 1) {
      expect(parsedResult.meta.hasMore).toBe(true);
    }
  }, 15000);

  it('should handle get_clientes_top_facturacion tool with real API', async () => {
    // Test with a recent date range that should return results or proper error handling
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = thirtyDaysAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesTopFacturacionImplementation(
      {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        limit: 5,
        offset: 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Should have proper response structure regardless of whether there are invoices or not
    expect(parsedResult).toHaveProperty('periodo');
    expect(parsedResult.periodo).toEqual({
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta,
      solo_pagadas: false
    });
    
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult.meta).toHaveProperty('total');
    expect(parsedResult.meta).toHaveProperty('limit', 5);
    expect(parsedResult.meta).toHaveProperty('offset', 0);
    expect(parsedResult.meta).toHaveProperty('hasMore');
    expect(Array.isArray(parsedResult.data)).toBe(true);

    // If there are top billing clients, verify structure
    if (parsedResult.data.length > 0) {
      const firstClient = parsedResult.data[0];
      expect(firstClient).toHaveProperty('codcliente');
      expect(firstClient).toHaveProperty('nombre');
      expect(firstClient).toHaveProperty('cifnif');
      expect(firstClient).toHaveProperty('total_facturado');
      expect(firstClient).toHaveProperty('numero_facturas');
      expect(typeof firstClient.total_facturado).toBe('number');
      expect(typeof firstClient.numero_facturas).toBe('number');
      expect(firstClient.numero_facturas).toBeGreaterThan(0);
      expect(firstClient.total_facturado).toBeGreaterThan(0);
    }

    // If no invoices, should have appropriate message
    if (parsedResult.data.length === 0) {
      expect(parsedResult.message).toMatch(/No se encontraron facturas/);
    }

    // Verify sorting (if multiple clients, should be sorted by total_facturado desc)
    if (parsedResult.data.length > 1) {
      for (let i = 1; i < parsedResult.data.length; i++) {
        expect(parsedResult.data[i-1].total_facturado).toBeGreaterThanOrEqual(
          parsedResult.data[i].total_facturado
        );
      }
    }
  }, 20000);

  it('should handle get_clientes_top_facturacion with solo_pagadas filter', async () => {
    // Test with paid invoices only
    const today = new Date();
    const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = ninetyDaysAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesTopFacturacionImplementation(
      {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        solo_pagadas: true,
        limit: 3,
        offset: 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Verify solo_pagadas filter is reflected in response
    expect(parsedResult.periodo.solo_pagadas).toBe(true);
    expect(parsedResult.periodo.fecha_desde).toBe(fechaDesde);
    expect(parsedResult.periodo.fecha_hasta).toBe(fechaHasta);
    
    // Should have proper pagination
    expect(parsedResult.meta.limit).toBe(3);
    expect(parsedResult.meta.offset).toBe(0);
    
    // If there are results, they should only include paid invoices data
    if (parsedResult.data.length > 0) {
      const firstClient = parsedResult.data[0];
      expect(firstClient).toHaveProperty('codcliente');
      expect(firstClient).toHaveProperty('nombre');
      expect(firstClient).toHaveProperty('cifnif');
      expect(firstClient).toHaveProperty('total_facturado');
      expect(firstClient).toHaveProperty('numero_facturas');
      expect(firstClient.total_facturado).toBeGreaterThan(0);
      expect(firstClient.numero_facturas).toBeGreaterThan(0);
    }

    // If no paid invoices, should have appropriate message
    if (parsedResult.data.length === 0) {
      expect(parsedResult.message).toMatch(/No se encontraron facturas/);
    }
  }, 20000);

  it('should handle pagination with get_clientes_top_facturacion tool', async () => {
    // Test pagination with small limit
    const today = new Date();
    const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = sixMonthsAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesTopFacturacionImplementation(
      {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        limit: 1,
        offset: 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Verify pagination structure
    expect(parsedResult.meta).toHaveProperty('total');
    expect(parsedResult.meta).toHaveProperty('limit', 1);
    expect(parsedResult.meta).toHaveProperty('offset', 0);
    expect(parsedResult.meta).toHaveProperty('hasMore');
    
    // Should return at most 1 result
    expect(parsedResult.data.length).toBeLessThanOrEqual(1);
    
    // If there's data and total > 1, hasMore should be true
    if (parsedResult.data.length === 1 && parsedResult.meta.total > 1) {
      expect(parsedResult.meta.hasMore).toBe(true);
    }
  }, 15000);

  it('should handle edge case date ranges', async () => {
    // Test with a date range that likely has no invoices (far future)
    const futureDate = '2030-01-01';
    const futureDateEnd = '2030-01-31';

    const result = await toolClientesTopFacturacionImplementation(
      {
        fecha_desde: futureDate,
        fecha_hasta: futureDateEnd,
        limit: 10,
        offset: 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Should return no data for future dates
    expect(parsedResult.periodo.fecha_desde).toBe(futureDate);
    expect(parsedResult.periodo.fecha_hasta).toBe(futureDateEnd);
    expect(parsedResult.meta.total).toBe(0);
    expect(parsedResult.data).toHaveLength(0);
    expect(parsedResult.message).toMatch(/No se encontraron facturas/);
  }, 15000);

  it('should handle parameter validation edge cases', async () => {
    // Test with extreme parameters that should be normalized
    const today = new Date();
    const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = oneYearAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesTopFacturacionImplementation(
      {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        limit: 5000, // Should be capped to 1000
        offset: -10  // Should be normalized to 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Parameters should be normalized
    expect(parsedResult.meta.limit).toBe(1000); // Capped
    expect(parsedResult.meta.offset).toBe(0);   // Normalized
    
    // Should still work correctly
    expect(parsedResult).toHaveProperty('periodo');
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult).toHaveProperty('data');
    expect(Array.isArray(parsedResult.data)).toBe(true);
  }, 15000);
});