// Helper script to generate enhanced tool definitions for all FacturaScripts resources
// This generates the enhanced inputSchema for all 56 tools systematically

const toolDefinitions = [
  {
    name: 'get_clientes',
    resource: 'clientes',
    description: 'Obtiene la lista de clientes con paginación opcional y filtros avanzados',
    fields: {
      filter_codcliente: 'Filtro por código de cliente',
      filter_nombre: 'Filtro por nombre',
      filter_email: 'Filtro por email',
      filter_activo: 'Filtro por estado activo (0/1)',
      filter_fechaalta: 'Filtro por fecha de alta (YYYY-MM-DD)',
    },
    operatorFields: {
      fechaalta: ['gt', 'gte', 'lt', 'lte', 'neq'],
      nombre: ['like', 'neq'],
      email: ['like'],
      codcliente: ['neq']
    },
    orOperations: ['nombre_like', 'email_like'],
    sortFields: ['codcliente', 'nombre', 'fechaalta', 'email']
  },
  {
    name: 'get_productos',
    resource: 'productos',
    description: 'Obtiene la lista de productos con paginación opcional y filtros avanzados',
    fields: {
      filter_referencia: 'Filtro por referencia del producto',
      filter_descripcion: 'Filtro por descripción',
      filter_codfamilia: 'Filtro por código de familia',
      filter_codfabricante: 'Filtro por código de fabricante',
      filter_precio: 'Filtro por precio',
      filter_bloqueado: 'Filtro por estado bloqueado (0/1)',
    },
    operatorFields: {
      precio: ['gt', 'gte', 'lt', 'lte', 'neq'],
      descripcion: ['like'],
      referencia: ['like', 'neq']
    },
    orOperations: ['descripcion_like', 'referencia_like'],
    sortFields: ['referencia', 'descripcion', 'precio', 'codfamilia']
  },
  {
    name: 'get_proveedores',
    resource: 'proveedores',
    description: 'Obtiene la lista de proveedores con paginación opcional y filtros avanzados',
    fields: {
      filter_codproveedor: 'Filtro por código de proveedor',
      filter_nombre: 'Filtro por nombre',
      filter_email: 'Filtro por email',
      filter_activo: 'Filtro por estado activo (0/1)',
    },
    operatorFields: {
      nombre: ['like', 'neq'],
      email: ['like'],
      codproveedor: ['neq']
    },
    orOperations: ['nombre_like', 'email_like'],
    sortFields: ['codproveedor', 'nombre', 'email']
  },
  {
    name: 'get_facturaclientes',
    resource: 'facturaclientes', 
    description: 'Obtiene la lista de facturas de clientes con paginación opcional y filtros avanzados',
    fields: {
      filter_codigo: 'Filtro por código de factura',
      filter_codcliente: 'Filtro por código de cliente',
      filter_fecha: 'Filtro por fecha (YYYY-MM-DD)',
      filter_total: 'Filtro por importe total',
      filter_pagada: 'Filtro por estado pagada (0/1)',
    },
    operatorFields: {
      fecha: ['gt', 'gte', 'lt', 'lte'],
      total: ['gt', 'gte', 'lt', 'lte'],
      codigo: ['like']
    },
    orOperations: ['codigo_like'],
    sortFields: ['codigo', 'fecha', 'total', 'codcliente']
  },
  {
    name: 'get_stocks',
    resource: 'stocks',
    description: 'Obtiene la lista de stocks con paginación opcional y filtros avanzados',
    fields: {
      filter_referencia: 'Filtro por referencia del producto',
      filter_codalmacen: 'Filtro por código de almacén',
      filter_cantidad: 'Filtro por cantidad en stock',
      filter_reservada: 'Filtro por cantidad reservada',
      filter_disponible: 'Filtro por cantidad disponible',
    },
    operatorFields: {
      cantidad: ['gt', 'gte', 'lt', 'lte'],
      reservada: ['gt', 'gte', 'lt', 'lte'],
      disponible: ['gt', 'gte', 'lt', 'lte']
    },
    orOperations: [],
    sortFields: ['referencia', 'codalmacen', 'cantidad', 'disponible']
  }
];

// Function to generate enhanced inputSchema
function generateEnhancedInputSchema(toolDef) {
  const schema = {
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
      // Backward compatibility
      filter: {
        type: 'string',
        description: 'Filtros en formato campo:valor (mantiene compatibilidad)',
      },
      order: {
        type: 'string',
        description: 'Orden en formato campo:asc|desc (mantiene compatibilidad)',
      }
    },
    additionalProperties: true
  };

  // Add basic filter fields
  Object.keys(toolDef.fields).forEach(field => {
    schema.properties[field] = {
      type: 'string',
      description: toolDef.fields[field]
    };
  });

  // Add operator-based filters
  Object.keys(toolDef.operatorFields).forEach(baseField => {
    toolDef.operatorFields[baseField].forEach(op => {
      const fieldName = `filter_${baseField}_${op}`;
      let desc = '';
      
      switch(op) {
        case 'gt': desc = `${baseField} mayor que`; break;
        case 'gte': desc = `${baseField} mayor o igual que`; break;
        case 'lt': desc = `${baseField} menor que`; break;
        case 'lte': desc = `${baseField} menor o igual que`; break;
        case 'neq': desc = `${baseField} diferente de`; break;
        case 'like': desc = `${baseField} que contenga el texto (busca en minúsculas, sin acentos, sin comodines)`; break;
      }
      
      schema.properties[fieldName] = {
        type: 'string',
        description: desc
      };
    });
  });

  // Add OR operations
  toolDef.orOperations.forEach(opField => {
    schema.properties[`operation_${opField}`] = {
      type: 'string',
      enum: ['OR'],
      description: `Usar OR en lugar de AND para filter_${opField}`
    };
  });

  // Add sort fields
  toolDef.sortFields.forEach(field => {
    schema.properties[`sort_${field}`] = {
      type: 'string',
      enum: ['ASC', 'DESC'],
      description: `Ordenar por ${field}`
    };
  });

  return schema;
}

// Generate tool definition
function generateToolDefinition(toolDef) {
  return {
    name: toolDef.name,
    description: toolDef.description,
    inputSchema: generateEnhancedInputSchema(toolDef)
  };
}

// Output sample tools for verification
toolDefinitions.slice(0, 3).forEach(toolDef => {
  const tool = generateToolDefinition(toolDef);
  console.log(`// ${tool.name} tool definition:`);
  console.log(JSON.stringify(tool, null, 2));
  console.log('\n');
});

console.log('This script demonstrates the pattern for generating enhanced tool definitions.');
console.log('Each tool gets comprehensive filtering, sorting, and OR operation support.');
console.log('The pattern can be applied to all 56 FacturaScripts resources.');