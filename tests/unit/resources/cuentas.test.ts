import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CuentasResource } from '../../../src/resources/cuentas.js';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

describe('CuentasResource', () => {
  let resource: CuentasResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new CuentasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts cuentas URI', () => {
      expect(resource.matchesUri('facturascripts://cuentas')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://cuentas')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch cuentas with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ 
          idcuenta: 1,
          codcuenta: '1000',
          descripcion: 'Test Account',
          saldo: 1000.50
        }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://cuentas');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/cuentas',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts Cuentas');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://cuentas');
      
      expect(result.name).toBe('FacturaScripts Cuentas (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch cuentas');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });
  });
});