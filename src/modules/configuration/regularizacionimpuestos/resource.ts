import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { RegularizacionImpuesto } from '../../../types/facturascripts.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

export class RegularizacionimpuestosResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    try {
      const { limit, offset, additionalParams } = parseUrlParameters(uri);
      
      const result = await this.client.getWithPagination<RegularizacionImpuesto>(
        '/regularizacionimpuestos',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Tax Regularizations',
        mimeType: 'application/json',
        contents: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        uri,
        name: 'FacturaScripts Tax Regularizations (Error)',
        mimeType: 'application/json',
        contents: [{
          type: 'text',
          text: JSON.stringify({
            error: 'Failed to fetch regularizacionimpuestos',
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
    return uri.startsWith('facturascripts://regularizacionimpuestos');
  }
}