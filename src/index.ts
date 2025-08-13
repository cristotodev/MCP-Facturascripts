import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from './fs/client.js';
import { ClientesResource } from './resources/clientes.js';
import { ProductosResource } from './resources/productos.js';
import { ProductoproveedoresResource } from './resources/productoproveedores.js';
import { PedidoclientesResource } from './resources/pedidoclientes.js';
import { FacturaclientesResource } from './resources/facturaclientes.js';
import { PresupuestoclientesResource } from './resources/presupuestoclientes.js';
import { ProveedoresResource } from './resources/proveedores.js';
import { StocksResource } from './resources/stocks.js';
import { FacturaproveedoresResource } from './resources/facturaproveedores.js';
import { AgenciatransportesResource } from './resources/agenciatransportes.js';
import { AgentesResource } from './resources/agentes.js';
import { AlbaranclientesResource } from './resources/albaranclientes.js';
import { AlbaranproveedoresResource } from './resources/albaranproveedores.js';
import { AlmacenesResource } from './resources/almacenes.js';
import { ApiAccessResource } from './resources/apiaccess.js';
import { ApiKeyesResource } from './resources/apikeyes.js';
import { AsientosResource } from './resources/asientos.js';
import { AtributosResource } from './resources/atributos.js';
import { AtributoValoresResource } from './resources/atributovalores.js';
import { AttachedFilesResource } from './resources/attachedfiles.js';
import { AttachedFileRelationsResource } from './resources/attachedfilerelations.js';
import { CiudadesResource } from './resources/ciudades.js';
import { CodigoPostalesResource } from './resources/codigopostales.js';
import { ConceptopartidasResource } from './resources/conceptopartidas.js';
import { ContactosResource } from './resources/contactos.js';
import { CronjobesResource } from './resources/cronjobes.js';
import { CuentasResource } from './resources/cuentas.js';
import { CuentabancosResource } from './resources/cuentabancos.js';

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
const proveedoresResource = new ProveedoresResource(fsClient);
const stocksResource = new StocksResource(fsClient);
const facturaproveedoresResource = new FacturaproveedoresResource(fsClient);
const agenciatransportesResource = new AgenciatransportesResource(fsClient);
const agentesResource = new AgentesResource(fsClient);
const albaranclientesResource = new AlbaranclientesResource(fsClient);
const albaranproveedoresResource = new AlbaranproveedoresResource(fsClient);
const almacenesResource = new AlmacenesResource(fsClient);
const apiAccessResource = new ApiAccessResource(fsClient);
const apiKeyesResource = new ApiKeyesResource(fsClient);
const asientosResource = new AsientosResource(fsClient);
const atributosResource = new AtributosResource(fsClient);
const atributoValoresResource = new AtributoValoresResource(fsClient);
const attachedFilesResource = new AttachedFilesResource(fsClient);
const attachedFileRelationsResource = new AttachedFileRelationsResource(fsClient);
const ciudadesResource = new CiudadesResource(fsClient);
const codigoPostalesResource = new CodigoPostalesResource(fsClient);
const conceptopartidasResource = new ConceptopartidasResource(fsClient);
const contactosResource = new ContactosResource(fsClient);
const cronjobesResource = new CronjobesResource(fsClient);
const cuentasResource = new CuentasResource(fsClient);
const cuentabancosResource = new CuentabancosResource(fsClient);

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
            filter: {
              type: 'string',
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
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
            filter: {
              type: 'string',
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
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
            filter: {
              type: 'string',
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
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
            filter: {
              type: 'string',
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
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
            filter: {
              type: 'string',
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
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
            filter: {
              type: 'string',
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_proveedores',
        description: 'Obtiene la lista de proveedores con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_stocks',
        description: 'Obtiene la lista de stocks con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_facturaproveedores',
        description: 'Obtiene la lista de facturas de proveedores con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_agenciatransportes',
        description: 'Obtiene la lista de agencias de transporte con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_agentes',
        description: 'Obtiene la lista de agentes con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_albaranclientes',
        description: 'Obtiene la lista de albaranes de clientes con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_albaranproveedores',
        description: 'Obtiene la lista de albaranes de proveedores con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_almacenes',
        description: 'Obtiene la lista de almacenes con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_apiaccess',
        description: 'Obtiene la lista de accesos API con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_apikeyes',
        description: 'Obtiene la lista de claves API con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_asientos',
        description: 'Obtiene la lista de asientos contables con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_atributos',
        description: 'Obtiene la lista de atributos con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_atributovalores',
        description: 'Obtiene la lista de valores de atributos con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_attachedfiles',
        description: 'Obtiene la lista de archivos adjuntos con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_attachedfilerelations',
        description: 'Obtiene la lista de relaciones de archivos adjuntos con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_ciudades',
        description: 'Obtiene la lista de ciudades con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_codigopostales',
        description: 'Obtiene la lista de códigos postales con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_conceptopartidas',
        description: 'Obtiene la lista de conceptos de partidas con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_contactos',
        description: 'Obtiene la lista de contactos con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_cronjobes',
        description: 'Obtiene la lista de trabajos cron con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_cuentas',
        description: 'Obtiene la lista de cuentas contables con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
            },
          },
        },
      },
      {
        name: 'get_cuentabancos',
        description: 'Obtiene la lista de cuentas bancarias con paginación opcional',
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
              description: 'Filtros en formato campo:valor',
            },
            order: {
              type: 'string',
              description: 'Orden en formato campo:asc|desc',
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
      {
        uri: 'facturascripts://proveedores',
        name: 'FacturaScripts Proveedores',
        description: 'Lista de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://stocks',
        name: 'FacturaScripts Stocks',
        description: 'Lista de stocks de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://facturaproveedores',
        name: 'FacturaScripts FacturaProveedores',
        description: 'Lista de facturas de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://agenciatransportes',
        name: 'FacturaScripts AgenciaTransportes',
        description: 'Lista de agencias de transporte de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://agentes',
        name: 'FacturaScripts Agentes',
        description: 'Lista de agentes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://albaranclientes',
        name: 'FacturaScripts AlbaranClientes',
        description: 'Lista de albaranes de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://albaranproveedores',
        name: 'FacturaScripts AlbaranProveedores',
        description: 'Lista de albaranes de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://almacenes',
        name: 'FacturaScripts Almacenes',
        description: 'Lista de almacenes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://apiaccess',
        name: 'FacturaScripts API Access',
        description: 'Lista de accesos API de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://apikeyes',
        name: 'FacturaScripts API Keys',
        description: 'Lista de claves API de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://asientos',
        name: 'FacturaScripts Asientos',
        description: 'Lista de asientos contables de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://atributos',
        name: 'FacturaScripts Atributos',
        description: 'Lista de atributos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://atributovalores',
        name: 'FacturaScripts AtributoValores',
        description: 'Lista de valores de atributos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://attachedfiles',
        name: 'FacturaScripts Attached Files',
        description: 'Lista de archivos adjuntos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://attachedfilerelations',
        name: 'FacturaScripts Attached File Relations',
        description: 'Lista de relaciones de archivos adjuntos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://ciudades',
        name: 'FacturaScripts Cities',
        description: 'Lista de ciudades de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://codigopostales',
        name: 'FacturaScripts Postal Codes',
        description: 'Lista de códigos postales de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://conceptopartidas',
        name: 'FacturaScripts ConceptoPartidas',
        description: 'Lista de conceptos de partidas de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://contactos',
        name: 'FacturaScripts Contactos',
        description: 'Lista de contactos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://cronjobes',
        name: 'FacturaScripts CronJobs',
        description: 'Lista de trabajos cron de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://cuentas',
        name: 'FacturaScripts Cuentas',
        description: 'Lista de cuentas contables de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://cuentabancos',
        name: 'FacturaScripts CuentaBancos',
        description: 'Lista de cuentas bancarias de FacturaScripts con paginación',
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

  if (proveedoresResource.matchesUri(uri)) {
    return await proveedoresResource.getResource(uri);
  }

  if (stocksResource.matchesUri(uri)) {
    return await stocksResource.getResource(uri);
  }

  if (facturaproveedoresResource.matchesUri(uri)) {
    return await facturaproveedoresResource.getResource(uri);
  }

  if (agenciatransportesResource.matchesUri(uri)) {
    return await agenciatransportesResource.getResource(uri);
  }

  if (agentesResource.matchesUri(uri)) {
    return await agentesResource.getResource(uri);
  }

  if (albaranclientesResource.matchesUri(uri)) {
    return await albaranclientesResource.getResource(uri);
  }

  if (albaranproveedoresResource.matchesUri(uri)) {
    return await albaranproveedoresResource.getResource(uri);
  }

  if (almacenesResource.matchesUri(uri)) {
    return await almacenesResource.getResource(uri);
  }

  if (apiAccessResource.matchesUri(uri)) {
    return await apiAccessResource.getResource(uri);
  }

  if (apiKeyesResource.matchesUri(uri)) {
    return await apiKeyesResource.getResource(uri);
  }

  if (asientosResource.matchesUri(uri)) {
    return await asientosResource.getResource(uri);
  }

  if (atributosResource.matchesUri(uri)) {
    return await atributosResource.getResource(uri);
  }

  if (atributoValoresResource.matchesUri(uri)) {
    return await atributoValoresResource.getResource(uri);
  }

  if (attachedFilesResource.matchesUri(uri)) {
    return await attachedFilesResource.getResource(uri);
  }

  if (attachedFileRelationsResource.matchesUri(uri)) {
    return await attachedFileRelationsResource.getResource(uri);
  }

  if (ciudadesResource.matchesUri(uri)) {
    return await ciudadesResource.getResource(uri);
  }

  if (codigoPostalesResource.matchesUri(uri)) {
    return await codigoPostalesResource.getResource(uri);
  }

  if (conceptopartidasResource.matchesUri(uri)) {
    return await conceptopartidasResource.getResource(uri);
  }

  if (contactosResource.matchesUri(uri)) {
    return await contactosResource.getResource(uri);
  }

  if (cronjobesResource.matchesUri(uri)) {
    return await cronjobesResource.getResource(uri);
  }

  if (cuentasResource.matchesUri(uri)) {
    return await cuentasResource.getResource(uri);
  }

  if (cuentabancosResource.matchesUri(uri)) {
    return await cuentabancosResource.getResource(uri);
  }

  throw new Error(`Resource not found: ${uri}`);
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const limit = args?.limit ?? 50;
  const offset = args?.offset ?? 0;
  const filter = args?.filter;
  const order = args?.order;

  // Helper function to build URI with query parameters
  const buildUri = (resource: string) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('offset', String(offset));
    if (filter && typeof filter === 'string') params.set('filter', filter);
    if (order && typeof order === 'string') params.set('order', order);
    return `facturascripts://${resource}?${params.toString()}`;
  };

  try {
    switch (name) {
      case 'get_clientes': {
        const uri = buildUri('clientes');
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
        const uri = buildUri('productos');
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
        const uri = buildUri('productoproveedores');
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
        const uri = buildUri('pedidoclientes');
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
        const uri = buildUri('facturaclientes');
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
        const uri = buildUri('presupuestoclientes');
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

      case 'get_proveedores': {
        const uri = buildUri('proveedores');
        const result = await proveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_stocks': {
        const uri = buildUri('stocks');
        const result = await stocksResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_facturaproveedores': {
        const uri = buildUri('facturaproveedores');
        const result = await facturaproveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_agenciatransportes': {
        const uri = buildUri('agenciatransportes');
        const result = await agenciatransportesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_agentes': {
        const uri = buildUri('agentes');
        const result = await agentesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_albaranclientes': {
        const uri = buildUri('albaranclientes');
        const result = await albaranclientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_albaranproveedores': {
        const uri = buildUri('albaranproveedores');
        const result = await albaranproveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_almacenes': {
        const uri = buildUri('almacenes');
        const result = await almacenesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_apiaccess': {
        const uri = buildUri('apiaccess');
        const result = await apiAccessResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_apikeyes': {
        const uri = buildUri('apikeyes');
        const result = await apiKeyesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_asientos': {
        const uri = buildUri('asientos');
        const result = await asientosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_atributos': {
        const uri = buildUri('atributos');
        const result = await atributosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_atributovalores': {
        const uri = buildUri('atributovalores');
        const result = await atributoValoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_attachedfiles': {
        const uri = buildUri('attachedfiles');
        const result = await attachedFilesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_attachedfilerelations': {
        const uri = buildUri('attachedfilerelations');
        const result = await attachedFileRelationsResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_ciudades': {
        const uri = buildUri('ciudades');
        const result = await ciudadesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_codigopostales': {
        const uri = buildUri('codigopostales');
        const result = await codigoPostalesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_conceptopartidas': {
        const uri = buildUri('conceptopartidas');
        const result = await conceptopartidasResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_contactos': {
        const uri = buildUri('contactos');
        const result = await contactosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_cronjobes': {
        const uri = buildUri('cronjobes');
        const result = await cronjobesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_cuentas': {
        const uri = buildUri('cuentas');
        const result = await cuentasResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_cuentabancos': {
        const uri = buildUri('cuentabancos');
        const result = await cuentabancosResource.getResource(uri);
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