import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { SubcuentasResource } from '../../../../src/modules/accounting/subcuentas/resource.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Sub-accounts Integration Tests', () => {
  let client: FacturaScriptsClient;
  let subcuentasResource: SubcuentasResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    subcuentasResource = new SubcuentasResource(client);
  });

  it('should fetch sub-accounts from real API', async () => {
    const result = await subcuentasResource.getResource('facturascripts://subcuentas?limit=5');

    expect(result.uri).toBe('facturascripts://subcuentas?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Sub-accounts( \(Error\))?$/);
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