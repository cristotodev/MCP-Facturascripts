import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';

interface Stock {
  idstock: number;
  referencia: string;
  codalmacen: string;
  descripcion?: string;
  cantidad: number;
  stockmin?: number;
}

interface Producto {
  referencia: string;
  descripcion: string;
  idproducto?: number;
}

interface LowStockProduct {
  referencia: string;
  descripcion: string;
  almacen: string;
  cantidad: number;
  stockmin: number;
  cantidad_a_reponer: number;
}

export const toolDefinition = {
  name: 'get_stocks',
  description: 'Obtiene la lista de stocks con paginación y filtros avanzados',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Número máximo de registros a devolver (por defecto: 50)',
        default: 50,
      },
      offset: {
        type: 'number',
        description: 'Número de registros a omitir (por defecto: 0)',
        default: 0,
      },
      filter: {
        type: 'string',
        description: 'Filtros dinámicos. Formato: "campo:valor" o "campo1:valor1,campo2:valor2". Soporta operadores avanzados: campo_gt:valor, campo_like:texto, etc.',
      },
      order: {
        type: 'string',
        description: 'Orden en formato "campo:asc|desc" o múltiple "campo1:asc,campo2:desc"',
      },
    },
  },
};

export const toolImplementation = async (resource: any, buildUri: (resourceName: string) => string) => {
  const uri = buildUri('stocks');
  const result = await resource.getResource(uri);
  return {
    content: [
      {
        type: 'text',
        text: (result as any).contents?.[0]?.text || 'No data',
      },
    ],
  };
};

// Low stock products tool definition
export const lowStockToolDefinition = {
  name: 'get_productos_bajo_stock',
  description: 'Obtiene una lista de productos cuyo stock actual está por debajo del stock mínimo definido. Identifica productos que necesitan reposición urgente para evitar roturas de stock. Útil para gestión de inventarios, compras y planificación de almacén.',
  inputSchema: {
    type: 'object',
    properties: {
      incluir_stock_igual: {
        type: 'boolean',
        description: 'Si incluir productos cuyo stock actual es igual al mínimo (por defecto: true)',
        default: true
      },
      codalmacen: {
        type: 'string',
        description: 'Código de almacén para filtrar productos (opcional). Si se omite, revisa todos los almacenes'
      },
      limite: {
        type: 'number',
        description: 'Número máximo de productos a devolver (1-1000)',
        minimum: 1,
        maximum: 1000,
        default: 100
      },
      offset: {
        type: 'number',
        description: 'Número de productos a omitir para paginación',
        minimum: 0,
        default: 0
      }
    }
  }
};

export async function lowStockToolImplementation(
  args: { incluir_stock_igual?: boolean; codalmacen?: string; limite?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const incluirStockIgual = args.incluir_stock_igual !== undefined ? args.incluir_stock_igual : true;
  const limite = Math.min(Math.max(args.limite || 100, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get all stocks with optional warehouse filter
    let stockFilter = '';
    if (args.codalmacen) {
      stockFilter = `codalmacen:${args.codalmacen}`;
    }

    const stockParams = new URLSearchParams();
    stockParams.append('limit', '1000'); // Get a large number to analyze
    stockParams.append('offset', '0');
    if (stockFilter) stockParams.append('filter', stockFilter);

    const stockUri = `facturascripts://stocks?${stockParams.toString()}`;
    const { additionalParams: stockAdditionalParams } = parseUrlParameters(stockUri);

    const stockResult = await client.getWithPagination<Stock>(
      '/stocks',
      1000,
      0,
      stockAdditionalParams
    );

    if (!stockResult.data || stockResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              meta: {
                total: 0,
                limit: limite,
                offset,
                hasMore: false,
              },
              data: [],
              message: args.codalmacen 
                ? `No se encontraron stocks en el almacén: ${args.codalmacen}`
                : 'No se encontraron stocks en ningún almacén',
              summary: {
                total_productos_bajo_stock: 0,
                almacen_filtrado: args.codalmacen || 'Todos los almacenes',
                incluye_stock_igual: incluirStockIgual
              }
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Filter stocks that are below minimum (or equal if requested)
    const lowStockItems = stockResult.data.filter(stock => {
      if (stock.stockmin === undefined || stock.stockmin === null) {
        return false; // Skip items without minimum stock defined
      }
      
      if (incluirStockIgual) {
        return stock.cantidad <= stock.stockmin;
      } else {
        return stock.cantidad < stock.stockmin;
      }
    });

    if (lowStockItems.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              meta: {
                total: 0,
                limit: limite,
                offset,
                hasMore: false,
              },
              data: [],
              message: incluirStockIgual 
                ? 'No hay productos con stock bajo o igual al mínimo'
                : 'No hay productos con stock bajo el mínimo',
              summary: {
                total_productos_bajo_stock: 0,
                almacen_filtrado: args.codalmacen || 'Todos los almacenes',
                incluye_stock_igual: incluirStockIgual
              }
            }, null, 2)
          }
        ]
      };
    }

    // Step 3: Get product details for each low stock item
    const lowStockProducts: LowStockProduct[] = [];
    
    for (const stock of lowStockItems) {
      try {
        // Get product details by referencia
        const productParams = new URLSearchParams();
        productParams.append('limit', '1');
        productParams.append('offset', '0');
        productParams.append('filter', `referencia:${stock.referencia}`);

        const productUri = `facturascripts://productos?${productParams.toString()}`;
        const { additionalParams: productAdditionalParams } = parseUrlParameters(productUri);

        const productResult = await client.getWithPagination<Producto>(
          '/productos',
          1,
          0,
          productAdditionalParams
        );

        let descripcion = stock.descripcion || 'Sin descripción';
        if (productResult.data && productResult.data.length > 0) {
          descripcion = productResult.data[0].descripcion || descripcion;
        }

        lowStockProducts.push({
          referencia: stock.referencia,
          descripcion,
          almacen: stock.codalmacen,
          cantidad: stock.cantidad,
          stockmin: stock.stockmin!,
          cantidad_a_reponer: stock.stockmin! - stock.cantidad
        });
      } catch (error) {
        // If we can't get product details, use stock info
        lowStockProducts.push({
          referencia: stock.referencia,
          descripcion: stock.descripcion || 'Sin descripción',
          almacen: stock.codalmacen,
          cantidad: stock.cantidad,
          stockmin: stock.stockmin!,
          cantidad_a_reponer: stock.stockmin! - stock.cantidad
        });
      }
    }

    // Step 4: Sort by cantidad ascending (lowest stock first)
    lowStockProducts.sort((a, b) => a.cantidad - b.cantidad);

    // Step 5: Apply pagination
    const paginatedProducts = lowStockProducts.slice(offset, offset + limite);
    const hasMore = lowStockProducts.length > offset + limite;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            meta: {
              total: lowStockProducts.length,
              limit: limite,
              offset,
              hasMore,
            },
            data: paginatedProducts,
            summary: {
              total_productos_bajo_stock: lowStockProducts.length,
              almacen_filtrado: args.codalmacen || 'Todos los almacenes',
              incluye_stock_igual: incluirStockIgual
            }
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
            error: 'Failed to fetch low stock products',
            message: errorMessage,
            meta: {
              total: 0,
              limit: limite,
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