export const toolDefinition = {
  name: 'get_reciboclientes',
  description: 'Obtiene la lista de recibos de clientes con filtrado y paginación dinámicos',
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
        description: 'Filtros dinámicos en formato campo:valor. Soporta múltiples filtros separados por comas y operadores como _gt, _lt, _like, etc. Ejemplo: "pagado:1,importe_gt:100.00"'
      },
      order: {
        type: 'string',
        description: 'Ordenación dinámica en formato campo:asc|desc. Soporta múltiples campos separados por comas. Ejemplo: "fecha:desc,importe:asc"'
      }
    }
  }
};

export async function toolImplementation(args: any, client: any, buildUri: any) {
  const uri = buildUri('reciboclientes', args);
  const { ReciboclientesResource } = await import('./resource.js');
  const resource = new ReciboclientesResource(client);
  const result = await resource.getResource(uri);
  
  return {
    content: [{
      type: 'text',
      text: (result as any).contents[0].text
    }]
  };
}