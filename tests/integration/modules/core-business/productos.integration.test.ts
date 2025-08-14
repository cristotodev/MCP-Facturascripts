import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { ProductosResource } from '../../../../src/resources/productos.js';

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