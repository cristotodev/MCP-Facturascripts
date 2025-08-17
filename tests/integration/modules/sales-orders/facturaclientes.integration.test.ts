import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { FacturaclientesResource } from '../../../../src/modules/sales-orders/facturaclientes/resource.js';
import { toolByCifnifImplementation, toolClientesMorososImplementation, toolClientesTopFacturacionImplementation, toolClientesSinComprasImplementation, toolClientesFrecuenciaComprasImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool.js';

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

  it('should handle get_clientes_sin_compras tool with real API', async () => {
    // Test with a recent date range
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = thirtyDaysAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesSinComprasImplementation(
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
    
    // Should have proper response structure regardless of whether there are clients without purchases
    expect(parsedResult).toHaveProperty('periodo');
    expect(parsedResult.periodo).toEqual({
      fecha_desde: fechaDesde,
      fecha_hasta: fechaHasta
    });
    
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult.meta).toHaveProperty('total');
    expect(parsedResult.meta).toHaveProperty('limit', 5);
    expect(parsedResult.meta).toHaveProperty('offset', 0);
    expect(parsedResult.meta).toHaveProperty('hasMore');
    expect(Array.isArray(parsedResult.data)).toBe(true);

    // If there are clients without purchases, verify structure
    if (parsedResult.data.length > 0) {
      const firstClient = parsedResult.data[0];
      expect(firstClient).toHaveProperty('codcliente');
      expect(firstClient).toHaveProperty('nombre');
      expect(firstClient).toHaveProperty('email');
      expect(firstClient).toHaveProperty('telefono1');
      expect(typeof firstClient.codcliente).toBe('string');
      expect(typeof firstClient.nombre).toBe('string');
      // email and telefono1 can be null
      expect(firstClient.email === null || typeof firstClient.email === 'string').toBe(true);
      expect(firstClient.telefono1 === null || typeof firstClient.telefono1 === 'string').toBe(true);
    }

    // If no clients exist, should have appropriate message
    if (parsedResult.data.length === 0 && parsedResult.message) {
      expect(parsedResult.message).toMatch(/No se encontraron clientes/);
    }
  }, 20000);

  it('should handle get_clientes_sin_compras with different date ranges', async () => {
    // Test with a historical date range that might have more inactive clients
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const elevenMonthsAgo = new Date();
    elevenMonthsAgo.setFullYear(elevenMonthsAgo.getFullYear() - 1);
    elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() + 1);
    
    const fechaDesde = oneYearAgo.toISOString().split('T')[0];
    const fechaHasta = elevenMonthsAgo.toISOString().split('T')[0];

    const result = await toolClientesSinComprasImplementation(
      {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        limit: 3,
        offset: 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Verify date range is reflected in response
    expect(parsedResult.periodo.fecha_desde).toBe(fechaDesde);
    expect(parsedResult.periodo.fecha_hasta).toBe(fechaHasta);
    
    // Should have proper pagination
    expect(parsedResult.meta.limit).toBe(3);
    expect(parsedResult.meta.offset).toBe(0);
    
    // Should work correctly regardless of results
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult).toHaveProperty('data');
    expect(Array.isArray(parsedResult.data)).toBe(true);
  }, 20000);

  it('should handle pagination with get_clientes_sin_compras tool', async () => {
    // Test pagination with small limit
    const today = new Date();
    const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = sixMonthsAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesSinComprasImplementation(
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

  it('should handle edge case scenarios for get_clientes_sin_compras', async () => {
    // Test with a very recent date range (last 7 days) - most clients likely won't have purchases
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = sevenDaysAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesSinComprasImplementation(
      {
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        limit: 10,
        offset: 0
      },
      client
    );

    expect(result.content[0].type).toBe('text');
    
    const parsedResult = JSON.parse(result.content[0].text);
    
    // Should work correctly - most clients likely haven't purchased in the last 7 days
    expect(parsedResult.periodo.fecha_desde).toBe(fechaDesde);
    expect(parsedResult.periodo.fecha_hasta).toBe(fechaHasta);
    expect(parsedResult.meta.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(parsedResult.data)).toBe(true);
    
    // Should handle the case where all or most clients haven't made purchases recently
    if (parsedResult.data.length > 0) {
      // Each client should have proper structure
      parsedResult.data.forEach(client => {
        expect(client).toHaveProperty('codcliente');
        expect(client).toHaveProperty('nombre');
        expect(client).toHaveProperty('email');
        expect(client).toHaveProperty('telefono1');
      });
    }
  }, 15000);

  it('should handle parameter validation for get_clientes_sin_compras', async () => {
    // Test with extreme parameters that should be normalized
    const today = new Date();
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const fechaDesde = oneMonthAgo.toISOString().split('T')[0];
    const fechaHasta = today.toISOString().split('T')[0];

    const result = await toolClientesSinComprasImplementation(
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

  it('should handle get_clientes_frecuencia_compras tool with real API', async () => {
    // Use a recent date range to potentially find data
    const fechaDesde = '2024-01-01';
    const fechaHasta = '2024-12-31';
    
    const result = await toolClientesFrecuenciaComprasImplementation(
      { 
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        limit: 5
      },
      client
    );

    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);

    const parsedResult = JSON.parse(result.content[0].text);
    
    // Should have proper structure regardless of whether data is found
    expect(parsedResult).toHaveProperty('periodo');
    expect(parsedResult.periodo.fecha_desde).toBe(fechaDesde);
    expect(parsedResult.periodo.fecha_hasta).toBe(fechaHasta);
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult.meta).toHaveProperty('total');
    expect(parsedResult.meta).toHaveProperty('limit', 5);
    expect(parsedResult.meta).toHaveProperty('offset', 0);
    expect(parsedResult.meta).toHaveProperty('hasMore');
    expect(parsedResult).toHaveProperty('data');
    expect(Array.isArray(parsedResult.data)).toBe(true);

    // If data is found, validate structure
    if (parsedResult.data.length > 0) {
      const cliente = parsedResult.data[0];
      expect(cliente).toHaveProperty('codcliente');
      expect(cliente).toHaveProperty('nombre');
      expect(cliente).toHaveProperty('numero_compras');
      expect(cliente).toHaveProperty('fecha_primera_compra');
      expect(cliente).toHaveProperty('fecha_ultima_compra');
      expect(cliente).toHaveProperty('frecuencia_dias');
      
      // Validate data types
      expect(typeof cliente.codcliente).toBe('string');
      expect(typeof cliente.nombre).toBe('string');
      expect(typeof cliente.numero_compras).toBe('number');
      expect(typeof cliente.fecha_primera_compra).toBe('string');
      expect(typeof cliente.fecha_ultima_compra).toBe('string');
      // frecuencia_dias can be number or null
      expect(cliente.frecuencia_dias === null || typeof cliente.frecuencia_dias === 'number').toBe(true);
      
      // Business logic validation
      expect(cliente.numero_compras).toBeGreaterThan(0);
      if (cliente.numero_compras === 1) {
        expect(cliente.frecuencia_dias).toBeNull();
        expect(cliente.fecha_primera_compra).toBe(cliente.fecha_ultima_compra);
      } else {
        expect(cliente.frecuencia_dias).toBeGreaterThan(0);
      }
    }
  }, 15000);

  it('should handle get_clientes_frecuencia_compras with no data period', async () => {
    // Use a future date range where no data should exist
    const fechaDesde = '2030-01-01';
    const fechaHasta = '2030-01-31';
    
    const result = await toolClientesFrecuenciaComprasImplementation(
      { 
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta
      },
      client
    );

    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);

    const parsedResult = JSON.parse(result.content[0].text);
    
    // Should have proper error/empty message
    expect(parsedResult).toHaveProperty('message');
    expect(parsedResult.message).toContain('No se encontraron facturas en el período');
    expect(parsedResult).toHaveProperty('meta');
    expect(parsedResult.meta.total).toBe(0);
    expect(parsedResult.data).toEqual([]);
  }, 15000);

  it('should handle get_clientes_frecuencia_compras parameter validation with real API', async () => {
    const result = await toolClientesFrecuenciaComprasImplementation(
      { 
        fecha_desde: '2024-01-01',
        fecha_hasta: '2024-01-31',
        limit: 5000, // Should be capped to 1000
        offset: -10  // Should be normalized to 0
      },
      client
    );

    expect(result).toHaveProperty('content');
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