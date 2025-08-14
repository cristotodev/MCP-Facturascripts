import { z } from 'zod';
import { FacturaScriptsClient } from '../../../../fs/client.js';
import { parseUrlParameters } from '../../../../utils/filterParser.js';
import type { LineaPresupuestoCliente } from '../../../../types/facturascripts.js';

export const toolDefinition = {
  name: 'get_lineapresupuestoclientes',
  description: 'Obtiene la lista de líneas de presupuestos de clientes con paginación y filtros avanzados',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Número máximo de registros a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de registros a omitir para paginación', minimum: 0, default: 0 },
      filter: { type: 'string', description: 'Filtros en formato campo:valor (ej: idpresupuesto:123)', default: '' },
      order: { type: 'string', description: 'Ordenación en formato campo:asc|desc (ej: orden:asc)', default: '' }
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
  
  const uri = `facturascripts://lineapresupuestoclientes?${params.toString()}`;
  const { additionalParams } = parseUrlParameters(uri);

  try {
    const result = await client.getWithPagination<LineaPresupuestoCliente>(
      '/lineapresupuestoclientes',
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
            error: 'Failed to fetch lineapresupuestoclientes',
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