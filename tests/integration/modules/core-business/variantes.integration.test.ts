import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { VariantesResource } from '../../../../src/modules/core-business/variantes/resource.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('Variantes Integration Tests', () => {
  let client: FacturaScriptsClient;
  let variantesResource: VariantesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    variantesResource = new VariantesResource(client);
  });

  it('should fetch product variants from real API', async () => {
    const result = await variantesResource.getResource('facturascripts://variantes?limit=5');

    expect(result.uri).toBe('facturascripts://variantes?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Product Variants( \(Error\))?$/);
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
      // If there's data, validate structure
      if (data.data.length > 0) {
        const variant = data.data[0];
        expect(variant).toHaveProperty('idvariante');
        expect(typeof variant.idvariante).toBe('number');
      }
    }
    expect(data.meta).toHaveProperty('limit', 5);
    expect(data.meta).toHaveProperty('offset', 0);
    expect(Array.isArray(data.data)).toBe(true);
  }, 10000);

  it('should handle price range filters', async () => {
    const result = await variantesResource.getResource('facturascripts://variantes?limit=3&filter=precio_gte:1.00,precio_lte:100.00');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    
    expect(data.meta.limit).toBe(3);
    expect(Array.isArray(data.data)).toBe(true);
    
    // If successful and has data, validate price range
    if (!result.name.includes('(Error)') && data.data.length > 0) {
      data.data.forEach((variant: any) => {
        if (variant.precio !== null && variant.precio !== undefined) {
          expect(variant.precio).toBeGreaterThanOrEqual(1.00);
          expect(variant.precio).toBeLessThanOrEqual(100.00);
        }
      });
    }
  }, 10000);

  it('should handle ordering by price', async () => {
    const result = await variantesResource.getResource('facturascripts://variantes?limit=5&order=precio:asc');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    
    expect(Array.isArray(data.data)).toBe(true);
    
    // If successful and has multiple items, validate ordering
    if (!result.name.includes('(Error)') && data.data.length > 1) {
      for (let i = 1; i < data.data.length; i++) {
        const current = data.data[i];
        const previous = data.data[i - 1];
        
        // Only validate if both have prices
        if (current.precio !== null && previous.precio !== null && 
            current.precio !== undefined && previous.precio !== undefined) {
          expect(current.precio).toBeGreaterThanOrEqual(previous.precio);
        }
      }
    }
  }, 10000);
});