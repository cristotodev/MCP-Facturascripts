import { describe, it, expect } from 'vitest';
import { AlbaranclientesResource } from '../../src/resources/albaranclientes.js';
import { FacturaScriptsClient } from '../../src/fs/client.js';

describe('AlbaranclientesResource Integration', () => {
  it('should fetch albaranclientes from FacturaScripts API', async () => {
    const client = new FacturaScriptsClient();
    const resource = new AlbaranclientesResource(client);
    
    const result = await resource.getResource('facturascripts://albaranclientes?limit=5');
    
    expect(result.name).toBe('FacturaScripts AlbaranClientes');
    expect(result.mimeType).toBe('application/json');
    expect(result.contents).toHaveLength(1);
    
    const data = JSON.parse(result.contents[0].text);
    expect(data).toHaveProperty('meta');
    expect(data).toHaveProperty('data');
    expect(data.meta).toHaveProperty('total');
    expect(data.meta).toHaveProperty('limit', 5);
    expect(data.meta).toHaveProperty('offset', 0);
    expect(data.meta).toHaveProperty('hasMore');
    expect(Array.isArray(data.data)).toBe(true);
  });
});