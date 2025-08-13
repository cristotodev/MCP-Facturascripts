import axios, { AxiosInstance } from 'axios';
import { env } from '../env.js';

export class FacturaScriptsClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${env.FS_BASE_URL}/api/${env.FS_API_VERSION}`,
      headers: {
        'token': env.FS_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async getWithPagination<T>(
    endpoint: string,
    limit: number = 50,
    offset: number = 0,
    additionalParams?: Record<string, any>
  ): Promise<{
    meta: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    data: T[];
  }> {
    const params = {
      limit,
      offset,
      ...additionalParams,
    };

    const response = await this.client.get<T[]>(endpoint, { params });

    // FacturaScripts returns data directly as an array
    const dataArray = Array.isArray(response.data) ? response.data : [];
    
    // Extract total count from X-Total-Count header if available
    const totalCountHeader = response.headers['x-total-count'];
    const totalFromHeader = totalCountHeader ? parseInt(totalCountHeader, 10) : null;
    
    // Use header total if available, otherwise fall back to data length
    const total = totalFromHeader !== null && !isNaN(totalFromHeader) 
      ? totalFromHeader 
      : dataArray.length;
    
    // Calculate if there are more records based on total count
    const hasMore = totalFromHeader !== null 
      ? (offset + limit < total)
      : (dataArray.length === limit); // If we got a full page, assume there might be more

    return {
      meta: {
        total,
        limit,
        offset,
        hasMore,
      },
      data: dataArray,
    };
  }
}