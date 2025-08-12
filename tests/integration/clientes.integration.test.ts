import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../src/fs/client.js';
import { ClientesResource } from '../../src/resources/clientes.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Clientes Integration Tests', () => {
  let client: FacturaScriptsClient;
  let clientesResource: ClientesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    clientesResource = new ClientesResource(client);
  });

  it('should fetch clientes from real API', async () => {
    const result = await clientesResource.getResource('facturascripts://clientes?limit=5');

    expect(result.uri).toBe('facturascripts://clientes?limit=5');
    expect(result.name).toBe('FacturaScripts Clientes');
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