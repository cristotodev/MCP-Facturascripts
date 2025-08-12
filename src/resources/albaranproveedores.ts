import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';

export interface AlbaranProveedor {
  cifnif?: string;
  codalmacen?: string;
  coddivisa?: string;
  codejercicio?: string;
  codigo?: string;
  codpago?: string;
  codproveedor?: string;
  codserie?: string;
  editable?: number;
  dtopor1?: number;
  dtopor2?: number;
  fecha?: string;
  femail?: string;
  hora?: string;
  idalbaran?: number;
  idempresa?: number;
  idestado?: number;
  irpf?: number;
  neto?: number;
  netosindto?: number;
  nick?: string;
  nombre?: string;
  numdocs?: number;
  numero?: string;
  numproveedor?: string;
  observaciones?: string;
  operacion?: string;
  tasaconv?: number;
  total?: number;
  totaleuros?: number;
  totalirpf?: number;
  totaliva?: number;
  totalrecargo?: number;
  totalsuplidos?: number;
}

export class AlbaranproveedoresResource {
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
      const result = await this.client.getWithPagination<AlbaranProveedor>(
        '/albaranproveedores',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts AlbaranProveedores',
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
        name: 'FacturaScripts AlbaranProveedores (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch albaranproveedores',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'albaranproveedores';
    } catch {
      return false;
    }
  }
}