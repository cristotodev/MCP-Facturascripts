import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { FacturaScriptsClient } from '../../../src/fs/client.js';

vi.mock('axios');
vi.mock('../../../src/env.js', () => ({
  env: {
    FS_BASE_URL: 'https://test.facturascripts.com',
    FS_API_VERSION: '3',
    FS_API_TOKEN: 'test-token'
  }
}));

const mockedAxios = vi.mocked(axios);

describe('FacturaScriptsClient', () => {
  let client: FacturaScriptsClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      get: vi.fn()
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    client = new FacturaScriptsClient();
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://test.facturascripts.com/api/3',
        headers: {
          'token': 'test-token',
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('get', () => {
    it('should make GET request and return data', async () => {
      const mockData = { test: 'data' };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await client.get('/test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { params: undefined });
      expect(result).toEqual(mockData);
    });

    it('should pass params to axios', async () => {
      const mockData = { test: 'data' };
      const params = { limit: 10, offset: 0 };
      mockAxiosInstance.get.mockResolvedValue({ data: mockData });

      await client.get('/test-endpoint', params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { params });
    });
  });

  describe('getWithPagination', () => {
    it('should return paginated response with meta information', async () => {
      const mockData = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' }
      ];
      mockAxiosInstance.get.mockResolvedValue({ 
        data: mockData,
        headers: {}
      });

      const result = await client.getWithPagination('/test-endpoint', 10, 0);

      expect(result).toEqual({
        meta: {
          total: 2,
          limit: 10,
          offset: 0,
          hasMore: false, // 2 < 10, so hasMore is false
        },
        data: mockData,
      });
    });

    it('should use default limit and offset', async () => {
      const mockData = [];
      mockAxiosInstance.get.mockResolvedValue({ 
        data: mockData,
        headers: {}
      });

      await client.getWithPagination('/test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', {
        params: {
          limit: 50,
          offset: 0,
        },
      });
    });

    it('should handle additional params', async () => {
      const mockData = [];
      const additionalParams = { filter: 'active' };
      mockAxiosInstance.get.mockResolvedValue({ 
        data: mockData,
        headers: {}
      });

      await client.getWithPagination('/test-endpoint', 10, 0, additionalParams);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', {
        params: {
          limit: 10,
          offset: 0,
          filter: 'active',
        },
      });
    });

    it('should calculate hasMore correctly with X-Total-Count header', async () => {
      const mockData = Array(50).fill(0).map((_, i) => ({ id: i }));
      mockAxiosInstance.get.mockResolvedValue({ 
        data: mockData,
        headers: {
          'x-total-count': '100'
        }
      });

      const result = await client.getWithPagination('/test-endpoint', 50, 0);

      expect(result.meta.hasMore).toBe(true);
      expect(result.meta.total).toBe(100);
    });

    it('should calculate hasMore correctly without X-Total-Count header', async () => {
      const mockData = Array(30).fill(0).map((_, i) => ({ id: i }));
      mockAxiosInstance.get.mockResolvedValue({ 
        data: mockData,
        headers: {}
      });

      const result = await client.getWithPagination('/test-endpoint', 50, 0);

      expect(result.meta.hasMore).toBe(false); // Less than limit, so no more data
      expect(result.meta.total).toBe(30);
    });

    it('should handle non-array response', async () => {
      mockAxiosInstance.get.mockResolvedValue({ 
        data: null,
        headers: {}
      });

      const result = await client.getWithPagination('/test-endpoint');

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });
  });
});