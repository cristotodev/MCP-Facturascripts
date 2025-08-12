import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../src/fs/client.js';
import { PedidoclientesResource } from '../../src/resources/pedidoclientes.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Pedidoclientes Integration Tests', () => {
  let client: FacturaScriptsClient;
  let pedidoclientesResource: PedidoclientesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    pedidoclientesResource = new PedidoclientesResource(client);
  });

  it('should fetch pedidoclientes from real API', async () => {
    const result = await pedidoclientesResource.getResource('facturascripts://pedidoclientes?limit=5');

    expect(result.uri).toBe('facturascripts://pedidoclientes?limit=5');
    expect(result.name).toBe('FacturaScripts PedidoClientes');
    expect(result.mimeType).toBe('application/json');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    expect(data).toHaveProperty('meta');
    expect(data).toHaveProperty('data');
    expect(data.meta).toHaveProperty('total');
    expect(data.meta).toHaveProperty('limit', 5);
    expect(data.meta).toHaveProperty('offset', 0);
    expect(Array.isArray(data.data)).toBe(true);
  }, 10000);
});