import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CuentabancosResource } from '../../../src/resources/cuentabancos.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('CuentabancosResource', () => {
  let resource: CuentabancosResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new CuentabancosResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts cuentabancos URI', () => {
      expect(resource.matchesUri('facturascripts://cuentabancos')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://cuentabancos')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch cuentabancos with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          descripcion: 'Test Bank Account',
          iban: 'ES9121000418450200051332',
          swift: 'CAIXESBBXXX',
          activa: 1
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://cuentabancos');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/cuentabancos',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts CuentaBancos');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://cuentabancos');
      
      expect(result.name).toBe('FacturaScripts CuentaBancos (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch cuentabancos');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});