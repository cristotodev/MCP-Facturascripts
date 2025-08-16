export const toolDefinition = {
  name: 'get_pais',
  description: 'Obtiene la lista de países con información de códigos ISO, coordenadas geográficas, prefijos telefónicos y configuraciones regionales',
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
  const uri = buildUri('pais');
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