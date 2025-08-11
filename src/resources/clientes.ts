import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../facturascripts/client.js';

export interface Cliente {
  codcliente: string;
  nombre: string;
  razonsocial?: string;
  cifnif?: string;
  telefono1?: string;
  email?: string;
  fechaalta?: string;
  activo?: boolean;
}

export class ClientesResource {
  constructor(private client: FacturaScriptsClient) {}

  async getResource(uri: string): Promise<Resource> {
    const url = new URL(uri);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    try {
      const result = await this.client.getWithPagination<Cliente>(
        '/clientes',
        limit,
        offset
      );

      return {
        uri,
        name: 'FacturaScripts Clientes',
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
        name: 'FacturaScripts Clientes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch clientes',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'clientes';
    } catch {
      return false;
    }
  }
}