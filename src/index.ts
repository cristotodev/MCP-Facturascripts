import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from './facturascripts/client.js';
import { ClientesResource } from './resources/clientes.js';
import { ProductosResource } from './resources/productos.js';
import { ProductoproveedoresResource } from './resources/productoproveedores.js';
import { PedidoclientesResource } from './resources/pedidoclientes.js';
import { FacturaclientesResource } from './resources/facturaclientes.js';
import { PresupuestoclientesResource } from './resources/presupuestoclientes.js';

const server = new Server(
  {
    name: 'mcp-facturascripts',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

const fsClient = new FacturaScriptsClient();
const clientesResource = new ClientesResource(fsClient);
const productosResource = new ProductosResource(fsClient);
const productoproveedoresResource = new ProductoproveedoresResource(fsClient);
const pedidoclientesResource = new PedidoclientesResource(fsClient);
const facturaclientesResource = new FacturaclientesResource(fsClient);
const presupuestoclientesResource = new PresupuestoclientesResource(fsClient);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_clientes',
        description: 'Obtiene la lista de clientes con paginación opcional',
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
          },
        },
      },
      {
        name: 'get_productos',
        description: 'Obtiene la lista de productos con paginación opcional',
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
          },
        },
      },
      {
        name: 'get_productoproveedores',
        description: 'Obtiene la lista de productos por proveedor con paginación opcional',
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
          },
        },
      },
      {
        name: 'get_pedidoclientes',
        description: 'Obtiene la lista de pedidos de clientes con paginación opcional',
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
          },
        },
      },
      {
        name: 'get_facturaclientes',
        description: 'Obtiene la lista de facturas de clientes con paginación opcional',
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
          },
        },
      },
      {
        name: 'get_presupuestoclientes',
        description: 'Obtiene la lista de presupuestos de clientes con paginación opcional',
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
          },
        },
      },
    ],
  };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'facturascripts://clientes',
        name: 'FacturaScripts Clientes',
        description: 'Lista de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://productos',
        name: 'FacturaScripts Productos',
        description: 'Lista de productos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://productoproveedores',
        name: 'FacturaScripts ProductoProveedores',
        description: 'Lista de productos por proveedor de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://pedidoclientes',
        name: 'FacturaScripts PedidoClientes',
        description: 'Lista de pedidos de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://facturaclientes',
        name: 'FacturaScripts FacturaClientes',
        description: 'Lista de facturas de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://presupuestoclientes',
        name: 'FacturaScripts PresupuestoClientes',
        description: 'Lista de presupuestos de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (clientesResource.matchesUri(uri)) {
    return await clientesResource.getResource(uri);
  }

  if (productosResource.matchesUri(uri)) {
    return await productosResource.getResource(uri);
  }

  if (productoproveedoresResource.matchesUri(uri)) {
    return await productoproveedoresResource.getResource(uri);
  }

  if (pedidoclientesResource.matchesUri(uri)) {
    return await pedidoclientesResource.getResource(uri);
  }

  if (facturaclientesResource.matchesUri(uri)) {
    return await facturaclientesResource.getResource(uri);
  }

  if (presupuestoclientesResource.matchesUri(uri)) {
    return await presupuestoclientesResource.getResource(uri);
  }

  throw new Error(`Resource not found: ${uri}`);
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const limit = args?.limit ?? 50;
  const offset = args?.offset ?? 0;

  try {
    switch (name) {
      case 'get_clientes': {
        const uri = `facturascripts://clientes?limit=${limit}&offset=${offset}`;
        const result = await clientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_productos': {
        const uri = `facturascripts://productos?limit=${limit}&offset=${offset}`;
        const result = await productosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_productoproveedores': {
        const uri = `facturascripts://productoproveedores?limit=${limit}&offset=${offset}`;
        const result = await productoproveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_pedidoclientes': {
        const uri = `facturascripts://pedidoclientes?limit=${limit}&offset=${offset}`;
        const result = await pedidoclientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_facturaclientes': {
        const uri = `facturascripts://facturaclientes?limit=${limit}&offset=${offset}`;
        const result = await facturaclientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_presupuestoclientes': {
        const uri = `facturascripts://presupuestoclientes?limit=${limit}&offset=${offset}`;
        const result = await presupuestoclientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP FacturaScripts server running on stdio');
}

runServer().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});