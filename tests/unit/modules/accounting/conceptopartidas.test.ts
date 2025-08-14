import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConceptopartidasResource } from '../../../../src/resources/conceptopartidas.js';
import { FacturaScriptsClient } from '../../../../src/fs/client.js';

describe('ConceptopartidasResource', () => {
  let resource: ConceptopartidasResource;
  let mockClient: FacturaScriptsClient;

  beforeEach(() => {
    mockClient = {
      getWithPagination: vi.fn(),
    } as unknown as FacturaScriptsClient;
    
    resource = new ConceptopartidasResource(mockClient);
  });

  describe('matchesUri', () => {
    it('should match valid facturascripts conceptopartidas URI', () => {
      expect(resource.matchesUri('facturascripts://conceptopartidas')).toBe(true);
    });

    it('should not match invalid protocol', () => {
      expect(resource.matchesUri('http://conceptopartidas')).toBe(false);
    });

    it('should not match different hostname', () => {
      expect(resource.matchesUri('facturascripts://clientes')).toBe(false);
    });

    it('should handle malformed URIs', () => {
      expect(resource.matchesUri('invalid-uri')).toBe(false);
    });
  });

  describe('getResource', () => {
    it('should fetch conceptopartidas with default pagination', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: [{ codconcepto: 'TEST', descripcion: 'Test Concept' }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://conceptopartidas');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/conceptopartidas',
        50,
        0,
        {}
      );
      
      expect(result.name).toBe('FacturaScripts ConceptoPartidas');
      expect(result.mimeType).toBe('application/json');
      expect(result.contents).toHaveLength(1);
      
      const content = JSON.parse(result.contents[0].text);
      expect(content).toEqual(mockData);
    });

    it('should fetch conceptopartidas with custom pagination', async () => {
      const mockData = {
        meta: { total: 100, limit: 10, offset: 5, hasMore: true },
        data: [{ codconcepto: 'CONCEPT1', descripcion: 'Concept 1' }]
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://conceptopartidas?limit=10&offset=5');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/conceptopartidas',
        10,
        5,
        {}
      );
    });

    it('should fetch conceptopartidas with filters and ordering', async () => {
      const mockData = {
        meta: { total: 50, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      const result = await resource.getResource('facturascripts://conceptopartidas?filter=activo:1&order=descripcion:asc');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/conceptopartidas',
        50,
        0,
        { 'filter[activo]': '1', 'sort[descripcion]': 'ASC' }
      );
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(mockClient.getWithPagination).mockRejectedValue(new Error('API Error'));
      
      const result = await resource.getResource('facturascripts://conceptopartidas');
      
      expect(result.name).toBe('FacturaScripts ConceptoPartidas (Error)');
      expect(result.mimeType).toBe('application/json');
      
      const content = JSON.parse(result.contents[0].text);
      expect(content.error).toBe('Failed to fetch conceptopartidas');
      expect(content.message).toBe('API Error');
      expect(content.meta.total).toBe(0);
    });

    it('should handle invalid limit and offset values', async () => {
      const mockData = {
        meta: { total: 1, limit: 50, offset: 0, hasMore: false },
        data: []
      };
      
      vi.mocked(mockClient.getWithPagination).mockResolvedValue(mockData);
      
      await resource.getResource('facturascripts://conceptopartidas?limit=invalid&offset=also-invalid');
      
      expect(mockClient.getWithPagination).toHaveBeenCalledWith(
        '/conceptopartidas',
        50,
        0,
        {}
      );
    });
  });
});