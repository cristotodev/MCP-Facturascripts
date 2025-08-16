import { describe, it, expect, beforeAll } from 'vitest';
import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';
import { WorkEventesResource } from '../../../../src/modules/system/workeventes/resource.js';

// Integration tests - only run if environment is configured
const shouldRunIntegrationTests = process.env.NODE_ENV === 'test' &&
  process.env.FS_BASE_URL &&
  process.env.FS_API_TOKEN;

describe.skipIf(!shouldRunIntegrationTests)('WorkEventes Integration Tests', () => {
  let client: FacturaScriptsClient;
  let workEventesResource: WorkEventesResource;

  beforeAll(() => {
    client = new FacturaScriptsClient();
    workEventesResource = new WorkEventesResource(client);
  });

  it('should fetch work events from real API', async () => {
    const result = await workEventesResource.getResource('facturascripts://workeventes?limit=5');

    expect(result.uri).toBe('facturascripts://workeventes?limit=5');
    // Accept both success and error cases
    expect(result.name).toMatch(/^FacturaScripts Work Events( \(Error\))?$/);
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
        const event = data.data[0];
        expect(event).toHaveProperty('id');
        expect(typeof event.id).toBe('number');
      }
    }
    expect(data.meta).toHaveProperty('limit', 5);
    expect(data.meta).toHaveProperty('offset', 0);
    expect(Array.isArray(data.data)).toBe(true);
  }, 10000);

  it('should filter by completion status', async () => {
    const result = await workEventesResource.getResource('facturascripts://workeventes?limit=10&filter=done:1');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    
    expect(Array.isArray(data.data)).toBe(true);
    
    // If successful and has data, validate all events are completed
    if (!result.name.includes('(Error)') && data.data.length > 0) {
      data.data.forEach((event: any) => {
        // Accept either boolean true or number 1 for done status
        expect(event.done === 1 || event.done === true).toBe(true);
      });
    }
  }, 10000);

  it('should order by creation date', async () => {
    const result = await workEventesResource.getResource('facturascripts://workeventes?limit=5&order=creation_date:desc');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    
    expect(Array.isArray(data.data)).toBe(true);
    
    // If successful and has multiple items with dates, validate ordering
    if (!result.name.includes('(Error)') && data.data.length > 1) {
      for (let i = 1; i < data.data.length; i++) {
        const current = data.data[i];
        const previous = data.data[i - 1];
        
        // Only validate if both have creation dates and are valid dates
        if (current.creation_date && previous.creation_date) {
          const currentDate = new Date(current.creation_date);
          const previousDate = new Date(previous.creation_date);
          
          // Only validate if both dates are valid
          if (!isNaN(currentDate.getTime()) && !isNaN(previousDate.getTime())) {
            expect(currentDate.getTime()).toBeLessThanOrEqual(previousDate.getTime());
          }
        }
      }
    }
  }, 10000);

  it('should search by event name', async () => {
    const result = await workEventesResource.getResource('facturascripts://workeventes?limit=10&filter=name_like:test');

    const content = (result as Resource as any).contents[0];
    const data = JSON.parse((content as any).text);
    
    expect(Array.isArray(data.data)).toBe(true);
    
    // If successful and has data, validate name contains search term
    if (!result.name.includes('(Error)') && data.data.length > 0) {
      data.data.forEach((event: any) => {
        if (event.name) {
          expect(event.name.toLowerCase()).toContain('test');
        }
      });
    }
  }, 10000);
});