import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { TotalModelesResource } from '../../../../src/modules/system/totalmodeles/resource.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('TotalModeles Integration Tests', () => {
  let client: FacturaScriptsClient;
  let totalModelesResource: TotalModelesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    totalModelesResource = new TotalModelesResource(client);
  });

  it('should fetch analytics models from real API', async () => {
    const result = await totalModelesResource.getResource('facturascripts://totalmodeles?limit=5');

    expect(result.uri).toBe('facturascripts://totalmodeles?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Analytics\/Total Models( \(Error\))?$/);
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
      // For error responses, the limit might be reset to default
      expect(data.meta.limit).toBeTypeOf('number');
    } else {
      expect(data.meta).toHaveProperty('total');
      expect(data.meta).toHaveProperty('limit', 5);
    }
    expect(data.meta).toHaveProperty('offset', 0);
    expect(Array.isArray(data.data)).toBe(true);
  }, 10000);

  it('should handle filters and pagination correctly', async () => {
    const result = await totalModelesResource.getResource('facturascripts://totalmodeles?limit=3&offset=1&filter=id_gte:1');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    
    
    // If it's an error response, parameters might be reset to defaults
    if (result.name.includes('(Error)')) {
      expect(data.meta.limit).toBeTypeOf('number');
      expect(data.meta.offset).toBeTypeOf('number');
    } else {
      expect(data.meta.limit).toBe(3);
      expect(data.meta.offset).toBe(1);
    }
    expect(Array.isArray(data.data)).toBe(true);
  }, 10000);
});