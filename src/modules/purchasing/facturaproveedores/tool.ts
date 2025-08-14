import { CallToolRequest, CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import type { FacturaProveedor } from '../../../types/facturascripts.js';

export const facturaProveedoresTool: Tool = {
  name: 'get_facturaproveedores',
  description: 'Obtener facturas de proveedores con paginación y filtros',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Número de registros a devolver (por defecto: 50)',
        default: 50,
      },
      offset: {
        type: 'number',
        description: 'Número de registros a omitir (por defecto: 0)',
        default: 0,
      },
      filter: {
        type: 'string',
        description: 'Filtros en formato campo:valor (ej: estado:pendiente)',
      },
      order: {
        type: 'string',
        description: 'Orden en formato campo:asc|desc (ej: fecha:desc)',
      },
    },
  },
};

export async function handleFacturaProveedoresCall(
  client: FacturaScriptsClient,
  request: CallToolRequest
): Promise<CallToolResult> {
  try {
    const { limit = 50, offset = 0, filter, order } = request.params as {
      limit?: number;
      offset?: number;
      filter?: string;
      order?: string;
    };

    const additionalParams: Record<string, string> = {};
    if (filter) additionalParams.filter = filter;
    if (order) additionalParams.order = order;

    const result = await client.getWithPagination<FacturaProveedor>(
      '/facturaproveedores',
      limit,
      offset,
      additionalParams
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Failed to fetch facturaproveedores',
            message: errorMessage,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}