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

const server = new Server(
  {
    name: 'mcp-facturascripts',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
    },
  }
);

const fsClient = new FacturaScriptsClient();
const clientesResource = new ClientesResource(fsClient);
const productosResource = new ProductosResource(fsClient);
const productoproveedoresResource = new ProductoproveedoresResource(fsClient);
const pedidoclientesResource = new PedidoclientesResource(fsClient);
const facturaclientesResource = new FacturaclientesResource(fsClient);

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

  throw new Error(`Resource not found: ${uri}`);
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