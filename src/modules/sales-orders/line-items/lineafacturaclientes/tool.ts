import { z } from 'zod';
import { FacturaScriptsClient } from '../../../../fs/client.js';
import { parseUrlParameters } from '../../../../utils/filterParser.js';
import type { LineaFacturaCliente } from '../../../../types/facturascripts.js';

export const toolDefinition = {
  name: 'get_lineafacturaclientes',
  description: 'Obtiene la lista de líneas de facturas de clientes con paginación y filtros avanzados',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Número máximo de registros a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de registros a omitir para paginación', minimum: 0, default: 0 },
      filter: { type: 'string', description: 'Filtros en formato campo:valor (ej: idfactura:123)', default: '' },
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
  
  const uri = `facturascripts://lineafacturaclientes?${params.toString()}`;
  const { additionalParams } = parseUrlParameters(uri);

  try {
    const result = await client.getWithPagination<LineaFacturaCliente>(
      '/lineafacturaclientes',
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
            error: 'Failed to fetch lineafacturaclientes',
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

// Interface for grouped product data
interface ProductoVendido {
  referencia: string | null;
  descripcion: string;
  cantidad_total: number;
  total_facturado: number;
}

// New tool definition for best-selling products
export const toolProductosMasVendidosDefinition = {
  name: 'get_productos_mas_vendidos',
  description: 'Obtiene un ranking de los productos más vendidos en un período determinado basado en líneas de facturas de clientes. Agrupa por referencia y descripción, sumando cantidades e importes facturados.',
  inputSchema: {
    type: 'object',
    properties: {
      fecha_desde: { 
        type: 'string', 
        format: 'date',
        description: 'Fecha de inicio del período (YYYY-MM-DD, requerida)' 
      },
      fecha_hasta: { 
        type: 'string', 
        format: 'date',
        description: 'Fecha de fin del período (YYYY-MM-DD, requerida)' 
      },
      limit: { 
        type: 'number', 
        description: 'Número máximo de productos a devolver en el ranking (1-1000)', 
        minimum: 1, 
        maximum: 1000, 
        default: 50 
      },
      offset: { 
        type: 'number', 
        description: 'Número de productos a omitir para paginación', 
        minimum: 0, 
        default: 0 
      },
      order: { 
        type: 'string', 
        description: 'Ordenación del ranking: "cantidad_total:desc", "total_facturado:desc", etc.', 
        default: 'cantidad_total:desc' 
      }
    },
    required: ['fecha_desde', 'fecha_hasta']
  }
};

export async function toolProductosMasVendidosImplementation(
  args: { 
    fecha_desde: string; 
    fecha_hasta: string; 
    limit?: number; 
    offset?: number; 
    order?: string 
  },
  client: FacturaScriptsClient
) {
  const { fecha_desde, fecha_hasta } = args;
  const limit = Math.min(Math.max(args.limit ?? 50, 1), 1000);
  const offset = Math.max(args.offset ?? 0, 0);
  const order = args.order || 'cantidad_total:desc';

  try {
    // Step 1: Get all invoices within the date range
    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', '1000'); // Get a large number of invoices
    invoiceParams.append('offset', '0');
    invoiceParams.append('filter', `fecha_gte:${fecha_desde},fecha_lte:${fecha_hasta}`);
    
    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams: invoiceAdditionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<any>(
      '/facturaclientes',
      1000,
      0,
      invoiceAdditionalParams
    );

    if (!invoiceResult.data || invoiceResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'No se encontraron facturas en el período especificado',
              period: { fecha_desde, fecha_hasta },
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Get invoice IDs
    const invoiceIds = invoiceResult.data.map((invoice: any) => invoice.idfactura).filter(Boolean);
    
    if (invoiceIds.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'No se encontraron IDs de facturas válidos',
              period: { fecha_desde, fecha_hasta },
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 3: Get all line items for those invoices
    const lineItemsPromises = invoiceIds.map(async (invoiceId: number) => {
      const lineParams = new URLSearchParams();
      lineParams.append('limit', '1000');
      lineParams.append('offset', '0');
      lineParams.append('filter', `idfactura:${invoiceId}`);
      
      const lineUri = `facturascripts://lineafacturaclientes?${lineParams.toString()}`;
      const { additionalParams: lineAdditionalParams } = parseUrlParameters(lineUri);

      return client.getWithPagination<LineaFacturaCliente>(
        '/lineafacturaclientes',
        1000,
        0,
        lineAdditionalParams
      );
    });

    const lineItemsResults = await Promise.all(lineItemsPromises);
    const allLineItems = lineItemsResults.flatMap(result => result.data || []);

    // Step 4: Group and aggregate data
    const productMap = new Map<string, ProductoVendido>();

    allLineItems.forEach(line => {
      if (!line.descripcion) return; // Skip lines without description

      // Use referencia if available, otherwise use a normalized description as key
      const key = line.referencia || line.descripcion;
      const cantidad = line.cantidad || 0;
      const pvptotal = line.pvptotal || 0;

      if (productMap.has(key)) {
        const existing = productMap.get(key)!;
        existing.cantidad_total += cantidad;
        existing.total_facturado += pvptotal;
      } else {
        productMap.set(key, {
          referencia: line.referencia || null,
          descripcion: line.descripcion,
          cantidad_total: cantidad,
          total_facturado: pvptotal
        });
      }
    });

    // Step 5: Convert to array and sort
    let productos = Array.from(productMap.values());

    // Apply sorting
    const [sortField, sortDirection] = order.split(':');
    const isDesc = sortDirection === 'desc';

    productos.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortField) {
        case 'cantidad_total':
          aValue = a.cantidad_total;
          bValue = b.cantidad_total;
          break;
        case 'total_facturado':
          aValue = a.total_facturado;
          bValue = b.total_facturado;
          break;
        default:
          aValue = a.cantidad_total;
          bValue = b.cantidad_total;
      }

      return isDesc ? bValue - aValue : aValue - bValue;
    });

    // Step 6: Apply pagination
    const total = productos.length;
    const paginatedProducts = productos.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            period: { fecha_desde, fecha_hasta },
            meta: {
              total,
              limit,
              offset,
              hasMore,
            },
            data: paginatedProducts,
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
            error: 'Failed to fetch productos más vendidos',
            message: errorMessage,
            period: { fecha_desde, fecha_hasta },
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