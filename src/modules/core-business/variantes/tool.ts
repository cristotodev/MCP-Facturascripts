export const toolDefinition = {
  name: 'get_variantes',
  description: 'Obtiene variantes de productos con diferentes atributos, precios y stock',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Número máximo de registros a devolver (1-1000)',
        default: 50,
        minimum: 1,
        maximum: 1000
      },
      offset: {
        type: 'number', 
        description: 'Número de registros a omitir para paginación',
        default: 0,
        minimum: 0
      },
      filter: {
        type: 'string',
        description: 'Filtros dinámicos en formato campo:valor. Ejemplos: idproducto:123, precio_gte:10.00, referencia_like:var'
      },
      order: {
        type: 'string',
        description: 'Ordenación en formato campo:dirección. Ejemplos: precio:asc, referencia:desc'
      }
    }
  }
};

export async function toolImplementation(args: any, client: any, buildUri: any) {
  const uri = buildUri('variantes');
  const { VariantesResource } = await import('./resource.js');
  const resource = new VariantesResource(client);
  const result = await resource.getResource(uri);
  
  return {
    content: [{
      type: 'text',
      text: (result as any).contents[0].text
    }]
  };
}