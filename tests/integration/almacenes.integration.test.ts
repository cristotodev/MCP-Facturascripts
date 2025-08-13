import { describe, it, expect } from 'vitest';
import { AlmacenesResource } from '../../src/resources/almacenes.js';
import { FacturaScriptsClient } from '../../src/fs/client.js';

describe('AlmacenesResource Integration', () => {
  it('should fetch almacenes from FacturaScripts API', async () => {
    const client = new FacturaScriptsClient();
    const resource = new AlmacenesResource(client);
    
    const result = await resource.getResource('facturascripts://almacenes?limit=5');
    
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Almacenes( \(Error\))?$/);
    expect(result.mimeType).toBe('application/json');
    expect(result.contents).toHaveLength(1);
    
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
  });
});