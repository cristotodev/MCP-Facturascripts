import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { Tarifa } from '../../../types/facturascripts.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

export class TarifasResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    try {
      const { limit, offset, additionalParams } = parseUrlParameters(uri);
      
      const result = await this.client.getWithPagination<Tarifa>(
        '/tarifas',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Tariffs/Price Lists',
        mimeType: 'application/json',
        contents: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        uri,
        name: 'FacturaScripts Tariffs/Price Lists (Error)',
        mimeType: 'application/json',
        contents: [{
          type: 'text',
          text: JSON.stringify({
            error: 'Failed to fetch tarifas',
            message: error instanceof Error ? error.message : 'Unknown error',
            meta: {
              total: 0,
              limit: 50,
              offset: 0,
              hasMore: false
            },
            data: []
          }, null, 2)
        }]
      };
    }
  }

  matchesUri(uri: string): boolean {
    return uri.startsWith('facturascripts://tarifas');
  }
}