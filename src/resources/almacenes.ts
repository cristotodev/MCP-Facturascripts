import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';
import { parseUrlParameters } from '../utils/filterParser.js';

export interface Almacen {
  activo?: number;
  apartado?: string;
  ciudad?: string;
  codpais?: string;
  codalmacen: string;
  codpostal?: string;
  direccion?: string;
  idempresa?: number;
  nombre: string;
  provincia?: string;
  telefono?: string;
}

export class AlmacenesResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    // Parse all URL parameters using the new unified parser
    const { limit, offset, additionalParams } = parseUrlParameters(uri);

    try {
      const result = await this.client.getWithPagination<Almacen>(
        '/almacenes',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Almacenes',
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
        name: 'FacturaScripts Almacenes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch almacenes',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'almacenes';
    } catch {
      return false;
    }
  }
}