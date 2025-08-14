import { CallToolRequest, CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import type { Divisa } from '../../../types/facturascripts.js';

export const divisasTool: Tool = {
  name: 'get_divisas',
  description: 'Obtener divisas con paginación y filtros',
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
        description: 'Filtros en formato campo:valor (ej: coddivisa:EUR)',
      },
      order: {
        type: 'string',
        description: 'Orden en formato campo:asc|desc (ej: descripcion:asc)',
      },
    },
  },
};

export async function handleDivisasCall(
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

    const result = await client.getWithPagination<Divisa>(
      '/divisas',
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
            error: 'Failed to fetch divisas',
            message: errorMessage,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}