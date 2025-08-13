import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';
import { Cuenta } from '../types/facturascripts.js';

export class CuentasResource {
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
      const result = await this.client.getWithPagination<Cuenta>(
        '/cuentas',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Cuentas',
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
        name: 'FacturaScripts Cuentas (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch cuentas',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'cuentas';
    } catch {
      return false;
    }
  }
}