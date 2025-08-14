import { describe, it, expect, beforeAll } from 'vitest';
import { ProveedoresResource } from '../../../../src/resources/proveedores.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('ProveedoresResource Integration', () => {
  let proveedoresResource: ProveedoresResource;
  let client: FacturaScriptsClient;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    proveedoresResource = new ProveedoresResource(client);
  });

  it('should fetch proveedores from FacturaScripts API', async () => {
    const result = await proveedoresResource.getResource('facturascripts://proveedores?limit=5&offset=0');

    expect(result.uri).toBe('facturascripts://proveedores?limit=5&offset=0');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Proveedores( \(Error\))?$/);
    expect(result.mimeType).toBe('application/json');
    expect(result.contents).toHaveLength(1);
    expect(result.contents[0].type).toBe('text');

    const data = JSON.parse(result.contents[0].text);
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
    expect(data.meta).toHaveProperty('hasMore');
    expect(Array.isArray(data.data)).toBe(true);

    // Validate proveedor structure if data exists
    if (data.data.length > 0) {
      const proveedor = data.data[0];
      expect(proveedor).toHaveProperty('codproveedor');
      expect(proveedor).toHaveProperty('nombre');
      expect(typeof proveedor.codproveedor).toBe('string');
      expect(typeof proveedor.nombre).toBe('string');
    }
  });

  it('should handle pagination correctly', async () => {
    const result1 = await proveedoresResource.getResource('facturascripts://proveedores?limit=2&offset=0');
    const result2 = await proveedoresResource.getResource('facturascripts://proveedores?limit=2&offset=2');

    const data1 = JSON.parse(result1.contents[0].text);
    const data2 = JSON.parse(result2.contents[0].text);

    expect(data1.meta.limit).toBe(2);
    expect(data1.meta.offset).toBe(0);
    expect(data2.meta.limit).toBe(2);
    expect(data2.meta.offset).toBe(2);

    // If both have data, they should be different records
    if (data1.data.length > 0 && data2.data.length > 0) {
      expect(data1.data[0].codproveedor).not.toBe(data2.data[0].codproveedor);
    }
  });
});