export const toolDefinition = {
  name: 'get_productos',
  description: 'Obtiene la lista de productos con paginación y filtros avanzados',
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
  const uri = buildUri('productos');
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

export const noVendidosToolDefinition = {
  name: 'get_productos_no_vendidos',
  description: 'Obtiene productos que no han sido vendidos (no aparecen en líneas de facturas de clientes) en un período específico',
  inputSchema: {
    type: 'object',
    properties: {
      fecha_desde: {
        type: 'string',
        description: 'Fecha de inicio para filtrar ventas (formato: YYYY-MM-DD). Si no se especifica, analiza todo el historial',
      },
      fecha_hasta: {
        type: 'string',
        description: 'Fecha de fin para filtrar ventas (formato: YYYY-MM-DD). Si no se especifica, analiza hasta la fecha actual',
      },
      limit: {
        type: 'number',
        description: 'Número máximo de productos no vendidos a devolver (1-1000, por defecto: 100)',
        default: 100,
        minimum: 1,
        maximum: 1000,
      },
      offset: {
        type: 'number',
        description: 'Número de registros a omitir (por defecto: 0)',
        default: 0,
        minimum: 0,
      },
    },
  },
};

export const noVendidosToolImplementation = async (args: any, client: any) => {
  try {
    // Validate and sanitize parameters
    const limit = Math.min(Math.max(args.limit || 100, 1), 1000);
    const offset = Math.max(args.offset || 0, 0);
    const fechaDesde = args.fecha_desde;
    const fechaHasta = args.fecha_hasta;

    // Step 1: Get all products that are sellable
    let allProducts = [];
    let productOffset = 0;
    const batchSize = 1000;
    
    while (true) {
      const productsResult = await client.getWithPagination('/productos', batchSize, productOffset, {
        'filter[sevende]': '1'
      });
      
      if (!productsResult.data || productsResult.data.length === 0) break;
      
      allProducts.push(...productsResult.data);
      
      if (productsResult.data.length < batchSize) break;
      productOffset += batchSize;
    }

    if (allProducts.length === 0) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            error: 'No sellable products found',
            message: 'No se encontraron productos con sevende=true en el sistema'
          })
        }],
        isError: true
      };
    }

    // Step 2: Get all invoice line items with date filtering
    let soldProductRefs = new Set();
    let lineOffset = 0;
    const lineBatchSize = 2000;
    
    // Build filters for date range
    const lineFilters: any = {};
    if (fechaDesde) {
      lineFilters['filter[fecha_gte]'] = fechaDesde;
    }
    if (fechaHasta) {
      lineFilters['filter[fecha_lte]'] = fechaHasta;
    }

    while (true) {
      const linesResult = await client.getWithPagination('/lineafacturaclientes', lineBatchSize, lineOffset, lineFilters);
      
      if (!linesResult.data || linesResult.data.length === 0) break;

      // Collect all unique product references from sold items
      linesResult.data.forEach((line: any) => {
        if (line.referencia) {
          soldProductRefs.add(line.referencia);
        }
      });

      if (linesResult.data.length < lineBatchSize) break;
      lineOffset += lineBatchSize;
    }

    // Step 3: Filter products to find unsold ones
    const unsoldProducts = allProducts.filter(product => 
      product.referencia && !soldProductRefs.has(product.referencia)
    );

    // Step 4: Apply pagination
    const totalUnsold = unsoldProducts.length;
    const paginatedProducts = unsoldProducts.slice(offset, offset + limit);

    // Step 5: Format response
    const responseData = paginatedProducts.map(product => ({
      referencia: product.referencia,
      descripcion: product.descripcion,
      idproducto: product.idproducto,
      fechaalta: product.fechaalta,
      stockfis: product.stockfis || 0
    }));

    const response = {
      periodo: {
        fecha_desde: fechaDesde || null,
        fecha_hasta: fechaHasta || null,
        descripcion: fechaDesde || fechaHasta ? 
          `Análisis de productos no vendidos ${fechaDesde ? 'desde ' + fechaDesde : ''}${fechaDesde && fechaHasta ? ' ' : ''}${fechaHasta ? 'hasta ' + fechaHasta : ''}` :
          'Análisis de productos no vendidos (todo el historial)'
      },
      resumen: {
        total_productos_vendibles: allProducts.length,
        total_productos_vendidos: soldProductRefs.size,
        total_productos_no_vendidos: totalUnsold,
        porcentaje_no_vendidos: allProducts.length > 0 ? ((totalUnsold / allProducts.length) * 100).toFixed(2) + '%' : '0%'
      },
      meta: {
        total: totalUnsold,
        limit: limit,
        offset: offset,
        hasMore: offset + limit < totalUnsold
      },
      data: responseData
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(response, null, 2)
      }]
    };

  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'API Error',
          message: error instanceof Error ? error.message : 'Error desconocido al obtener productos no vendidos'
        })
      }],
      isError: true
    };
  }
};