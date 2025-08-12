import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../facturascripts/client.js';

export interface PedidoCliente {
  codigo: string;
  numero?: string;
  codcliente: string;
  nombrecliente?: string;
  fecha: string;
  total?: number;
  totaliva?: number;
  servido?: boolean;
}

export class PedidoclientesResource {
  constructor(private client: FacturaScriptsClient) {}

  async getResource(uri: string): Promise<Resource> {
    const url = new URL(uri);
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    const limit = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : 50;
    const offset = offsetParam && !isNaN(parseInt(offsetParam)) ? parseInt(offsetParam) : 0;

    try {
      const result = await this.client.getWithPagination<PedidoCliente>(
        '/pedidoclientes',
        limit,
        offset
      );

      return {
        uri,
        name: 'FacturaScripts PedidoClientes',
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
        name: 'FacturaScripts PedidoClientes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch pedidoclientes',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'pedidoclientes';
    } catch {
      return false;
    }
  }
}