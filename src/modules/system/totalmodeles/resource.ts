import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { TotalModel } from '../../../types/facturascripts.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

export class TotalModelesResource {
  constructor(private client: FacturaScriptsClient) {}

  async getResource(uri: string): Promise<Resource> {
    try {
      const { limit, offset, additionalParams } = parseUrlParameters(uri);
      
      const result = await this.client.getWithPagination<TotalModel>(
        '/totalmodeles',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Analytics/Total Models',
        mimeType: 'application/json',
        contents: [{
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      return {
        uri,
        name: 'FacturaScripts Analytics/Total Models (Error)',
        mimeType: 'application/json',
        contents: [{
          type: 'text',
          text: JSON.stringify({
            error: 'Failed to fetch analytics models',
            message: error instanceof Error ? error.message : 'Unknown error',
            meta: { total: 0, limit: 50, offset: 0, hasMore: false },
            data: []
          }, null, 2)
        }]
      };
    }
  }

  matchesUri(uri: string): boolean {
    return uri.startsWith('facturascripts://totalmodeles');
  }
}