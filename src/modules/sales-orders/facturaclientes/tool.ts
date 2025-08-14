import { z } from 'zod';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';
import type { FacturaCliente } from './resource.js';

export const toolDefinition = {
  name: 'get_facturaclientes',
  description: 'Obtiene la lista de facturas de clientes con paginación y filtros avanzados',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Número máximo de registros a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de registros a omitir para paginación', minimum: 0, default: 0 },
      filter: { type: 'string', description: 'Filtros en formato campo:valor (ej: codcliente:CLI001)', default: '' },
      order: { type: 'string', description: 'Ordenación en formato campo:asc|desc (ej: fecha:desc)', default: '' }
    }
  }
};

export async function toolImplementation(
  args: { limit?: number; offset?: number; filter?: string; order?: string },
  client: FacturaScriptsClient
) {
  const limit = Math.min(Math.max(args.limit || 50, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);
  
  // Build query string
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  if (args.filter) params.append('filter', args.filter);
  if (args.order) params.append('order', args.order);
  
  const uri = `facturascripts://facturaclientes?${params.toString()}`;
  const { additionalParams } = parseUrlParameters(uri);

  try {
    const result = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      limit,
      offset,
      additionalParams
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
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
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// New tool definition for searching invoices by client CIF/NIF
export const toolByCifnifDefinition = {
  name: 'get_facturas_cliente_por_cifnif',
  description: 'Obtiene las facturas de un cliente específico mediante su CIF/NIF. Busca primero el cliente por CIF/NIF y luego sus facturas.',
  inputSchema: {
    type: 'object',
    properties: {
      cifnif: { type: 'string', description: 'CIF/NIF del cliente (requerido)' },
      limit: { type: 'number', description: 'Número máximo de facturas a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de facturas a omitir para paginación', minimum: 0, default: 0 },
      order: { type: 'string', description: 'Ordenación de facturas en formato campo:asc|desc (ej: fecha:desc)', default: '' }
    },
    required: ['cifnif']
  }
};

export async function toolByCifnifImplementation(
  args: { cifnif: string; limit?: number; offset?: number; order?: string },
  client: FacturaScriptsClient
) {
  const { cifnif } = args;
  const limit = Math.min(Math.max(args.limit || 50, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Search for client by CIF/NIF
    const clientFilter = `cifnif:${cifnif}`;
    const clientParams = new URLSearchParams();
    clientParams.append('limit', '1');
    clientParams.append('offset', '0');
    clientParams.append('filter', clientFilter);
    
    const clientUri = `facturascripts://clientes?${clientParams.toString()}`;
    const { additionalParams: clientAdditionalParams } = parseUrlParameters(clientUri);

    const clientResult = await client.getWithPagination<any>(
      '/clientes',
      1,
      0,
      clientAdditionalParams
    );

    if (!clientResult.data || clientResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Client not found',
              message: `No se encontró ningún cliente con CIF/NIF: ${cifnif}`,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    // Step 2: Get client code from the first result
    const cliente = clientResult.data[0];
    const codcliente = cliente.codcliente;

    if (!codcliente) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Client code not found',
              message: `El cliente encontrado no tiene código de cliente válido`,
              clientData: cliente,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    // Step 3: Search for invoices using the client code
    const invoiceFilter = `codcliente:${codcliente}`;
    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', limit.toString());
    invoiceParams.append('offset', offset.toString());
    invoiceParams.append('filter', invoiceFilter);
    if (args.order) invoiceParams.append('order', args.order);
    
    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams: invoiceAdditionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      limit,
      offset,
      invoiceAdditionalParams
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            clientInfo: {
              cifnif: cliente.cifnif,
              codcliente: cliente.codcliente,
              nombre: cliente.nombre || cliente.razonsocial,
            },
            invoices: invoiceResult,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch invoices by CIF/NIF',
            message: errorMessage,
            cifnif,
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}