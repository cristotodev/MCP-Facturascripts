import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../fs/client.js';
import { parseUrlParameters } from '../utils/filterParser.js';

export interface AlbaranCliente {
  apartado?: string;
  cifnif?: string;
  ciudad?: string;
  codagente?: string;
  codalmacen?: string;
  codcliente?: string;
  coddivisa?: string;
  codejercicio?: string;
  codigo?: string;
  codigoenv?: string;
  codpago?: string;
  codpais?: string;
  codpostal?: string;
  codserie?: string;
  codtrans?: string;
  direccion?: string;
  dtopor1?: number;
  dtopor2?: number;
  editable?: number;
  fecha?: string;
  femail?: string;
  hora?: string;
  idalbaran?: number;
  idcontactoenv?: number;
  idcontactofact?: number;
  idempresa?: number;
  idestado?: number;
  irpf?: number;
  neto?: number;
  netosindto?: number;
  nick?: string;
  nombrecliente?: string;
  numdocs?: number;
  numero?: string;
  numero2?: string;
  observaciones?: string;
  operacion?: string;
  provincia?: string;
  tasaconv?: number;
  total?: number;
  totalbeneficio?: number;
  totalcoste?: number;
  totaleuros?: number;
  totalirpf?: number;
  totaliva?: number;
}

export class AlbaranclientesResource {
  constructor(private client: FacturaScriptsClient) { }

  async getResource(uri: string): Promise<Resource> {
    // Parse all URL parameters using the new unified parser
    const { limit, offset, additionalParams } = parseUrlParameters(uri);

    try {
      const result = await this.client.getWithPagination<AlbaranCliente>(
        '/albaranclientes',
        limit,
        offset,
        additionalParams
      );

      return {
        uri,
        name: 'FacturaScripts AlbaranClientes',
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
        name: 'FacturaScripts AlbaranClientes (Error)',
        mimeType: 'application/json',
        contents: [
          {
            type: 'text',
            text: JSON.stringify({
              error: 'Failed to fetch albaranclientes',
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
      return url.protocol === 'facturascripts:' && url.hostname === 'albaranclientes';
    } catch {
      return false;
    }
  }
}