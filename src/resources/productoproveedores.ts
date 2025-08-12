import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';

export interface ProductoProveedor {
  codproveedor: string;
  referencia: string;
  refproveedor?: string;
  precio?: number;
  dtopor?: number;
  actualizado?: string;
}

export class ProductoproveedoresResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    const url = new URL(uri);
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const filterParam = url.searchParams.get('filter');
    const orderParam = url.searchParams.get('order');
    
    const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 50;
    const offset = offsetParam && !isNaN(parseInt(offsetParam)) ? parseInt(offsetParam) : 0;
    
    const additionalParams: Record<string, any> = {};
    if (filterParam) additionalParams.filter = filterParam;
    if (orderParam) additionalParams.order = orderParam;

    try {
      const result = await this.client.getWithPagination<ProductoProveedor>(
        '/productoproveedores',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts ProductoProveedores',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
            uri: uri,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        uri,
        name: 'FacturaScripts ProductoProveedores (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch productoproveedores',
              message: errorMessage,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2),
            uri: uri,
          },
        ],
      };
    }
  }

  matchesUri(uri: string): boolean {
    try {
      const url = new URL(uri);
      return url.protocol === 'facturascripts:' && url.hostname === 'productoproveedores';
    } catch {
      return false;
    }
  }
}