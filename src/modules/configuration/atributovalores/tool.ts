import { Tool, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { AtributoValor } from '../../../types/facturascripts.js';

export const atributovaloresTool: Tool = {
  name: 'get_atributovalores',
  description: 'Obtener valores de atributos con paginación y filtros',
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
        description: 'Filtros en formato campo:valor (ej: activo:1)',
      },
      order: {
        type: 'string',
        description: 'Ordenación en formato campo:asc|desc (ej: nombre:asc)',
      },
    },
  },
};

export async function handleAtributovaloresTool(
  client: FacturaScriptsClient,
  args: any
): Promise<any> {
  const limit = args.limit || 50;
  const offset = args.offset || 0;
  const additionalParams: Record<string, string> = {};

  if (args.filter) {
    additionalParams.filter = args.filter;
  }
  if (args.order) {
    additionalParams.order = args.order;
  }

  try {
    const result = await client.getWithPagination<AtributoValor>(
      '/atributovalores',
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
          text: JSON.stringify(
            {
              error: 'Failed to fetch atributovalores',
              message: errorMessage,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}