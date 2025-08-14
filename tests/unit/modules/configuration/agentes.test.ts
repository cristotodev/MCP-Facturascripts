import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentesResource, Agente } from '../../../../src/modules/configuration/agentes/resource.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

vi.mock('../../../../src/fs/client.js');

describe('AgentesResource', () => {
  let agentesResource: AgentesResource;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn()
    };
    agentesResource = new AgentesResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts://agentes URI', () => {
      expect(agentesResource.matchesUri('facturascripts://agentes')).toBe(true);
      expect(agentesResource.matchesUri('facturascripts://agentes?limit=10')).toBe(true);
    });

    it('should not match invalid URIs', () => {
      expect(agentesResource.matchesUri('http://example.com')).toBe(false);
      expect(agentesResource.matchesUri('facturascripts://productos')).toBe(false);
      expect(agentesResource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    const mockAgentes: Agente[] = [
      {
        cargo: 'Vendedor',
        cifnif: '12345678A',
        codagente: 'AGT001',
        debaja: 0,
        email: 'agente@example.com',
        fechabaja: '',
        fechaalta: '2024-01-01',
        idcontacto: 1,
        idproducto: 1,
        nombre: 'Agente Test',
        observaciones: 'Test agent',
        telefono1: '+34 666 777 888',
        telefono2: '',
        tipoidfiscal: 'NIF'
      }
    ];

    it('should return resource with agentes data', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAgentes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      const result = await agentesResource.getResource('facturascripts://agentes');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/agentes', 50, 0, {});
      expect(result.uri).toBe('facturascripts://agentes');
      expect(result.name).toBe('FacturaScripts Agentes');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    });

    it('should parse limit and offset from URI params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 10, offset: 20, hasMore: false },
        data: mockAgentes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await agentesResource.getResource('facturascripts://agentes?limit=10&offset=20');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/agentes', 10, 20, {});
    });

    it('should use default values for missing params', async () => {
      const mockResponse = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: mockAgentes
      };
      mockClient.getWithPagination.mockResolvedValue(mockResponse);

      await agentesResource.getResource('facturascripts://agentes?limit=invalid&offset=invalid');

      expect(mockClient.getWithPagination).toHaveBeenCalledWith('/agentes', 50, 0, {});
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API Error';
      mockClient.getWithPagination.mockRejectedValue(new Error(errorMessage));

      const result = await agentesResource.getResource('facturascripts://agentes');

      expect(result.name).toBe('FacturaScripts Agentes (Error)');
      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.error).toBe('Failed to fetch agentes');
      expect(errorData.message).toBe(errorMessage);
      expect(errorData.data).toEqual([]);
    });

    it('should handle unknown errors', async () => {
      mockClient.getWithPagination.mockRejectedValue('Unknown error');

      const result = await agentesResource.getResource('facturascripts://agentes');

      const errorData = JSON.parse(result.contents[0].text);
      expect(errorData.message).toBe('Unknown error');
    });
  });
});