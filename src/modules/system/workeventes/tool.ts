export const toolDefinition = {
  name: 'get_workeventes',
  description: 'Obtiene eventos y trabajos del sistema para monitoreo y seguimiento de procesos',
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
        description: 'Filtros dinámicos en formato campo:valor. Ejemplos: done:1, nick:usuario, name_like:proceso'
      },
      order: {
        type: 'string',
        description: 'Ordenación en formato campo:dirección. Ejemplos: creation_date:desc, name:asc'
      }
    }
  }
};

export async function toolImplementation(args: any, client: any, buildUri: any) {
  const uri = buildUri('workeventes');
  const { WorkEventesResource } = await import('./resource.js');
  const resource = new WorkEventesResource(client);
  const result = await resource.getResource(uri);
  
  return {
    content: [{
      type: 'text',
      text: (result as any).contents[0].text
    }]
  };
}