import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgenciatransportesResource, AgenciaTransporte } from '../../../../src/modules/configuration/agenciatransportes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AgenciatransportesResource', () => {
  let agenciatransportesResource: AgenciatransportesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    agenciatransportesResource = new AgenciatransportesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://agenciatransportes URI', () => {
      expect(agenciatransportesResource.matchesUri('facturascripts://agenciatransportes')).toBe(true);
      expect(agenciatransportesResource.matchesUri('facturascripts://agenciatransportes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(agenciatransportesResource.matchesUri('http://example.com')).toBe(false);
      expect(agenciatransportesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(agenciatransportesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAgenciaTransporte: AgenciaTransporte[] = [
      {
        activo: 1,
        codtrans: 'TEST001',
        nombre: 'Transporte Test',
        telefono: '+34 666 777 888',
        web: 'https://ejemplo.com'
      }
    ];

    it('should return resource with agenciatransportes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAgenciaTransporte
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await agenciatransportesResource.getResource('facturascripts://agenciatransportes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/agenciatransportes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://agenciatransportes');
      expect(result.name).toBe('FacturaScripts Agenciatransportes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 10, offset: 20, hasMore: false },
        data: mockAgenciaTransporte
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await agenciatransportesResource.getResource('facturascripts://agenciatransportes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/agenciatransportes', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAgenciaTransporte
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await agenciatransportesResource.getResource('facturascripts://agenciatransportes?limit=invalid&offset=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/agenciatransportes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValue(new Error(errorMessage));

      const result = await agenciatransportesResource.getResource('facturascripts://agenciatransportes');

      expect(result.name).toBe('FacturaScripts Agenciatransportes (Error)');
      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.error).toBe('Failed to fetch agenciatransportes');
      expect(errorData.message).toBe(errorMessage);
      expect(errorData.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error');

      const result = await agenciatransportesResource.getResource('facturascripts://agenciatransportes');

      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.message).toBe('Unknown error');
    });
  });
});