import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlmacenesResource, Almacen } from '../../../../src/resources/almacenes.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AlmacenesResource', () => {
  let almacenesResource: AlmacenesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    almacenesResource = new AlmacenesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://almacenes URI', () => {
      expect(almacenesResource.matchesUri('facturascripts://almacenes')).toBe(true);
      expect(almacenesResource.matchesUri('facturascripts://almacenes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(almacenesResource.matchesUri('http://example.com')).toBe(false);
      expect(almacenesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(almacenesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAlmacenes: Almacen[] = [
      {
        activo: 1,
        codalmacen: 'ALM001',
        nombre: 'Almacen Principal',
        direccion: 'Calle Test 123',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        codpostal: '28001',
        codpais: 'ESP',
        telefono: '+34 666 777 888'
      }
    ];

    it('should return resource with almacenes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAlmacenes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await almacenesResource.getResource('facturascripts://almacenes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/almacenes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://almacenes');
      expect(result.name).toBe('FacturaScripts Almacenes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 15, offset: 5, hasMore: false },
        data: mockAlmacenes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await almacenesResource.getResource('facturascripts://almacenes?limit=15&offset=5');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/almacenes', 15, 5, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAlmacenes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await almacenesResource.getResource('facturascripts://almacenes?limit=invalid&offset=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/almacenes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValue(new Error(errorMessage));

      const result = await almacenesResource.getResource('facturascripts://almacenes');

      expect(result.name).toBe('FacturaScripts Almacenes (Error)');
      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.error).toBe('Failed to fetch almacenes');
      expect(errorData.message).toBe(errorMessage);
      expect(errorData.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error');

      const result = await almacenesResource.getResource('facturascripts://almacenes');

      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.message).toBe('Unknown error');
    });
  });
});