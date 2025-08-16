export const toolDefinition = {
  name: 'get_presupuestoproveedores',
  description: 'Obtiene los presupuestos de proveedores del sistema FacturaScripts con soporte para filtrado dinámico y paginación.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Número máximo de registros a devolver (1-1000)',
        default: 50,
        minimum: 1,
        maximum: 1000,
      },
      offset: {
        type: 'number', 
        description: 'Número de registros a omitir para paginación',
        default: 0,
        minimum: 0,
      },
      filter: {
        type: 'string',
        description: 'Filtros dinámicos en formato campo:valor. Ejemplos: "codproveedor:PROV001", "fecha_gte:2024-01-01", "total_gt:100.00". Operadores: _gt, _gte, _lt, _lte, _neq, _like',
      },
      order: {
        type: 'string',
        description: 'Ordenación dinámica en formato campo:dirección. Ejemplos: "fecha:desc", "codigo:asc", "total:desc"',
      },
    },
  },
};

export const toolImplementation = async (resource: any, buildUri: Function) => {
  const uri = buildUri('presupuestoproveedores');
  const result = await resource.getResource(uri);
  return {
    content: [
      {
        type: 'text',
        text: result.contents[0].text,
      },
    ],
  };
};