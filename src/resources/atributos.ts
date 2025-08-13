import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';
import { Atributo } from '../types/facturascripts.js';
import { parseUrlParameters } from '../utils/filterParser.js';

export class AtributosResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    // Parse all URL parameters using the new unified parser
    const { limit, offset, additionalParams } = parseUrlParameters(uri);

    try {
      const result = await this.client.getWithPagination<Atributo>(
        '/atributos',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Attributes',
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
        name: 'FacturaScripts Attributes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch atributos',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'atributos';
    } catch {
      return false;
    }
  }
}