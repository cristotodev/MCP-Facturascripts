import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';
import { parseUrlParameters } from '../utils/filterParser.js';

export interface FacturaCliente {
  codigo: string;
  numero?: string;
  codcliente: string;
  nombrecliente?: string;
  fecha: string;
  total?: number;
  totaliva?: number;
  pagada?: boolean;
  vencimiento?: string;
}

export class FacturaclientesResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    // Parse all URL parameters using the new unified parser
    const { limit, offset, additionalParams } = parseUrlParameters(uri);

    try {
      const result = await this.client.getWithPagination<FacturaCliente>(
        '/facturaclientes',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts FacturaClientes',
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
        name: 'FacturaScripts FacturaClientes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch facturaclientes',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'facturaclientes';
    } catch {
      return false;
    }
  }
}