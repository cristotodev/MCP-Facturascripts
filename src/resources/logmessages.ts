import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';
import { LogMessage } from '../types/facturascripts.js';
import { parseUrlParameters } from '../utils/filterParser.js';

export class LogMessagesResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    // Parse all URL parameters using the new unified parser
    const { limit, offset, additionalParams } = parseUrlParameters(uri);

    try {
      const result = await this.client.getWithPagination<LogMessage>(
        '/logmessages',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts LogMessages',
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
        name: 'FacturaScripts LogMessages (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch logmessages',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'logmessages';
    } catch {
      return false;
    }
  }
}