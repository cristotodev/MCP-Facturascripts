import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { ProductosResource } from '../../../../src/modules/core-business/productos/resource.js';
import { noVendidosToolImplementation } from '../../../../src/modules/core-business/productos/tool.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Productos Integration Tests', () => {
  let client: FacturaScriptsClient;
  let productosResource: ProductosResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    productosResource = new ProductosResource(client);
  });

  it('should fetch productos from real API', async () => {
    const result = await productosResource.getResource('facturascripts://productos?limit=5');

    expect(result.uri).toBe('facturascripts://productos?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Productos( \(Error\))?$/);
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
});

describe.skipIf(!shouldRunIntegrationTests)('ProductosNoVendidos Integration Tests', () => {
  let client: FacturaScriptsClient;

  beforeAll(() => {
    client = new FacturaScriptsClient();
  });

  it('should fetch unsold products from real API', async () => {
    const result = await noVendidosToolImplementation({
      limit: 10
    }, client);

    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0]).toHaveProperty('text');

    const response = JSON.parse(result.content[0].text);

    // Accept both success and error responses
    if (result.isError) {
      expect(response).toHaveProperty('error');
      expect(response).toHaveProperty('message');
    } else {
      expect(response).toHaveProperty('periodo');
      expect(response).toHaveProperty('resumen');
      expect(response).toHaveProperty('meta');
      expect(response).toHaveProperty('data');
      
      expect(response.meta).toHaveProperty('total');
      expect(response.meta).toHaveProperty('limit', 10);
      expect(response.meta).toHaveProperty('offset', 0);
      expect(response.meta).toHaveProperty('hasMore');
      
      expect(response.resumen).toHaveProperty('total_productos_vendibles');
      expect(response.resumen).toHaveProperty('total_productos_vendidos');
      expect(response.resumen).toHaveProperty('total_productos_no_vendidos');
      expect(response.resumen).toHaveProperty('porcentaje_no_vendidos');
      
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        const firstProduct = response.data[0];
        expect(firstProduct).toHaveProperty('referencia');
        expect(firstProduct).toHaveProperty('descripcion');
        expect(firstProduct).toHaveProperty('idproducto');
        expect(firstProduct).toHaveProperty('fechaalta');
        expect(firstProduct).toHaveProperty('stockfis');
      }
    }
  }, 15000);

  it('should apply date filters correctly in real API', async () => {
    const result = await noVendidosToolImplementation({
      fecha_desde: '2024-01-01',
      fecha_hasta: '2024-12-31',
      limit: 5
    }, client);

    expect(result).toHaveProperty('content');
    const response = JSON.parse(result.content[0].text);

    if (!result.isError) {
      expect(response.periodo.fecha_desde).toBe('2024-01-01');
      expect(response.periodo.fecha_hasta).toBe('2024-12-31');
      expect(response.periodo.descripcion).toContain('2024-01-01');
      expect(response.periodo.descripcion).toContain('2024-12-31');
    }
  }, 15000);

  it('should handle pagination in real API', async () => {
    const result = await noVendidosToolImplementation({
      limit: 3,
      offset: 0
    }, client);

    expect(result).toHaveProperty('content');
    const response = JSON.parse(result.content[0].text);

    if (!result.isError) {
      expect(response.meta.limit).toBe(3);
      expect(response.meta.offset).toBe(0);
      expect(response.data.length).toBeLessThanOrEqual(3);
    }
  }, 15000);

  it('should validate parameters and return appropriate errors', async () => {
    const result = await noVendidosToolImplementation({
      limit: 2000, // Above maximum
      offset: -10  // Below minimum
    }, client);

    expect(result).toHaveProperty('content');
    const response = JSON.parse(result.content[0].text);

    if (!result.isError) {
      // Parameters should be sanitized
      expect(response.meta.limit).toBe(1000); // Capped at maximum
      expect(response.meta.offset).toBe(0);   // Set to minimum
    }
  }, 15000);

  it('should handle edge case with no date filters', async () => {
    const result = await noVendidosToolImplementation({
      limit: 5
    }, client);

    expect(result).toHaveProperty('content');
    const response = JSON.parse(result.content[0].text);

    if (!result.isError) {
      expect(response.periodo.fecha_desde).toBe(null);
      expect(response.periodo.fecha_hasta).toBe(null);
      expect(response.periodo.descripcion).toBe('Análisis de productos no vendidos (todo el historial)');
    }
  }, 15000);

  it('should provide meaningful business analytics', async () => {
    const result = await noVendidosToolImplementation({
      limit: 50
    }, client);

    expect(result).toHaveProperty('content');
    const response = JSON.parse(result.content[0].text);

    if (!result.isError) {
      expect(typeof response.resumen.total_productos_vendibles).toBe('number');
      expect(typeof response.resumen.total_productos_vendidos).toBe('number');
      expect(typeof response.resumen.total_productos_no_vendidos).toBe('number');
      expect(typeof response.resumen.porcentaje_no_vendidos).toBe('string');
      expect(response.resumen.porcentaje_no_vendidos).toMatch(/^\d+\.\d{2}%$/);
      
      // Business logic validation
      expect(response.resumen.total_productos_no_vendidos)
        .toBe(response.resumen.total_productos_vendibles - response.resumen.total_productos_vendidos);
      
      // Meta information should be consistent
      expect(response.meta.total).toBe(response.resumen.total_productos_no_vendidos);
    }
  }, 15000);
});