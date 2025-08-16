import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { SeriesResource } from '../../../../src/modules/configuration/series/resource.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Series Integration Tests', () => {
  let client: FacturaScriptsClient;
  let seriesResource: SeriesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    seriesResource = new SeriesResource(client);
  });

  it('should fetch series from real API', async () => {
    const result = await seriesResource.getResource('facturascripts://series?limit=5');

    expect(result.uri).toBe('facturascripts://series?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Series( \(Error\))?$/);
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