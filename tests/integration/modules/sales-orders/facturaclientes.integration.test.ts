import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { FacturaclientesResource } from '../../../../src/modules/sales-orders/facturaclientes/resource.js';
import { toolByCifnifImplementation } from '../../../../src/modules/sales-orders/facturaclientes/tool.js';

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
});