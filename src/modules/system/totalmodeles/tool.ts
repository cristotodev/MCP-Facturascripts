export const toolDefinition = {
  name: 'get_totalmodeles',
  description: 'Obtiene modelos de análisis y agregación de datos del sistema FacturaScripts',
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
        description: 'Filtros dinámicos en formato campo:valor. Ejemplos: activo:1, nombre_like:modelo'
      },
      order: {
        type: 'string',
        description: 'Ordenación en formato campo:dirección. Ejemplos: nombre:asc, id:desc'
      }
    }
  }
};

export async function toolImplementation(args: any, client: any, buildUri: any) {
  const uri = buildUri('totalmodeles');
  const { TotalModelesResource } = await import('./resource.js');
  const resource = new TotalModelesResource(client);
  const result = await resource.getResource(uri);
  
  return {
    content: [{
      type: 'text',
      text: (result as any).contents[0].text
    }]
  };
}