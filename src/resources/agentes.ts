import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';

export interface Agente {
  cargo?: string;
  cifnif?: string;
  codagente: string;
  debaja?: number;
  email?: string;
  fechabaja?: string;
  fechaalta?: string;
  idcontacto?: number;
  idproducto?: number;
  nombre: string;
  observaciones?: string;
  telefono1?: string;
  telefono2?: string;
  tipoidfiscal?: string;
}

export class AgentesResource {
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
      const result = await this.client.getWithPagination<Agente>(
        '/agentes',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts Agentes',
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
        name: 'FacturaScripts Agentes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch agentes',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'agentes';
    } catch {
      return false;
    }
  }
}