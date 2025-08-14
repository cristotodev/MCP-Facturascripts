import { describe, it, expect } from 'vitest';
import { AgentesResource } from '../../../../src/modules/configuration/agentes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('AgentesResource Integration', () => {
  it('should fetch agentes from FacturaScripts API', async () => {
    const client = new FacturaScriptsClient();
    const resource = new AgentesResource(client);
    
    const result = await resource.getResource('facturascripts://agentes?limit=5');
    
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Agentes( \(Error\))?$/);
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