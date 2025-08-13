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
import { CuentabanccllientesResource } from './resources/cuentabancoclientes.js';
import { CuentabancoproveedoresResource } from './resources/cuentabancoproveedores.js';
import { CuentaespecialesResource } from './resources/cuentaespeciales.js';
import { DiariosResource } from './resources/diarios.js';
import { DivisasResource } from './resources/divisas.js';
import { DoctransformationsResource } from './resources/doctransformations.js';
import { EjerciciosResource } from './resources/ejercicios.js';
import { EmailnotificationsResource } from './resources/emailnotifications.js';
import { EmailsentesResource } from './resources/emailsentes.js';
import { EmpresasResource } from './resources/empresas.js';
import { EstadodocumentosResource } from './resources/estadodocumentos.js';
import { FabricantesResource } from './resources/fabricantes.js';
import { FamiliasResource } from './resources/familias.js';
import { FormaPagosResource } from './resources/formapagos.js';
import { FormatoDocumentosResource } from './resources/formatodocumentos.js';
import { GrupoClientesResource } from './resources/grupoclientes.js';
import { IdentificadorFiscalesResource } from './resources/identificadorfiscales.js';
import { ImpuestosResource } from './resources/impuestos.js';
import { ImpuestoZonasResource } from './resources/impuestozonas.js';
import { LineaAlbaranClientesResource } from './resources/lineaalbaranclientes.js';
import { LineaAlbaranProveedoresResource } from './resources/lineaalbaranproveedores.js';
import { LineaFacturaClientesResource } from './resources/lineafacturaclientes.js';
import { LineaFacturaProveedoresResource } from './resources/lineafacturaproveedores.js';
import { LineaPedidoClientesResource } from './resources/lineapedidoclientes.js';
import { LineaPedidoProveedoresResource } from './resources/lineapedidoproveedores.js';
import { LineaPresupuestoClientesResource } from './resources/lineapresupuestoclientes.js';
import { LineaPresupuestoProveedoresResource } from './resources/lineapresupuestoproveedores.js';
import { LogMessagesResource } from './resources/logmessages.js';

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
const cuentabanccllientesResource = new CuentabanccllientesResource(fsClient);
const cuentabancoproveedoresResource = new CuentabancoproveedoresResource(fsClient);
const cuentaespecialesResource = new CuentaespecialesResource(fsClient);
const diariosResource = new DiariosResource(fsClient);
const divisasResource = new DivisasResource(fsClient);
const doctransformationsResource = new DoctransformationsResource(fsClient);
const ejerciciosResource = new EjerciciosResource(fsClient);
const emailnotificationsResource = new EmailnotificationsResource(fsClient);
const emailsentesResource = new EmailsentesResource(fsClient);
const empresasResource = new EmpresasResource(fsClient);
const estadodocumentosResource = new EstadodocumentosResource(fsClient);
const fabricantesResource = new FabricantesResource(fsClient);
const familiasResource = new FamiliasResource(fsClient);
const formaPagosResource = new FormaPagosResource(fsClient);
const formatoDocumentosResource = new FormatoDocumentosResource(fsClient);
const grupoClientesResource = new GrupoClientesResource(fsClient);
const identificadorFiscalesResource = new IdentificadorFiscalesResource(fsClient);
const impuestosResource = new ImpuestosResource(fsClient);
const impuestoZonasResource = new ImpuestoZonasResource(fsClient);
const lineaAlbaranClientesResource = new LineaAlbaranClientesResource(fsClient);
const lineaAlbaranProveedoresResource = new LineaAlbaranProveedoresResource(fsClient);
const lineaFacturaClientesResource = new LineaFacturaClientesResource(fsClient);
const lineaFacturaProveedoresResource = new LineaFacturaProveedoresResource(fsClient);
const lineaPedidoClientesResource = new LineaPedidoClientesResource(fsClient);
const lineaPedidoProveedoresResource = new LineaPedidoProveedoresResource(fsClient);
const lineaPresupuestoClientesResource = new LineaPresupuestoClientesResource(fsClient);
const lineaPresupuestoProveedoresResource = new LineaPresupuestoProveedoresResource(fsClient);
const logMessagesResource = new LogMessagesResource(fsClient);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_clientes',
        description: 'Obtiene la lista de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_productos',
        description: 'Obtiene la lista de productos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_productoproveedores',
        description: 'Obtiene la lista de productos por proveedor con paginación y filtros avanzados',
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
      },
      {
        name: 'get_pedidoclientes',
        description: 'Obtiene la lista de pedidos de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_facturaclientes',
        description: 'Obtiene la lista de facturas de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_presupuestoclientes',
        description: 'Obtiene la lista de presupuestos de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_proveedores',
        description: 'Obtiene la lista de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_stocks',
        description: 'Obtiene la lista de stocks con paginación y filtros avanzados',
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
      },
      {
        name: 'get_facturaproveedores',
        description: 'Obtiene la lista de facturas de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_agenciatransportes',
        description: 'Obtiene la lista de agencias de transporte con paginación y filtros avanzados',
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
      },
      {
        name: 'get_agentes',
        description: 'Obtiene la lista de agentes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_albaranclientes',
        description: 'Obtiene la lista de albaranes de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_albaranproveedores',
        description: 'Obtiene la lista de albaranes de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_almacenes',
        description: 'Obtiene la lista de almacenes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_apiaccess',
        description: 'Obtiene la lista de accesos API con paginación y filtros avanzados',
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
      },
      {
        name: 'get_apikeyes',
        description: 'Obtiene la lista de claves API con paginación y filtros avanzados',
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
      },
      {
        name: 'get_asientos',
        description: 'Obtiene la lista de asientos contables con paginación y filtros avanzados',
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
      },
      {
        name: 'get_atributos',
        description: 'Obtiene la lista de atributos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_atributovalores',
        description: 'Obtiene la lista de valores de atributos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_attachedfiles',
        description: 'Obtiene la lista de archivos adjuntos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_attachedfilerelations',
        description: 'Obtiene la lista de relaciones de archivos adjuntos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_ciudades',
        description: 'Obtiene la lista de ciudades con paginación y filtros avanzados',
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
      },
      {
        name: 'get_codigopostales',
        description: 'Obtiene la lista de códigos postales con paginación y filtros avanzados',
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
      },
      {
        name: 'get_conceptopartidas',
        description: 'Obtiene la lista de conceptos de partidas con paginación y filtros avanzados',
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
      },
      {
        name: 'get_contactos',
        description: 'Obtiene la lista de contactos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_cronjobes',
        description: 'Obtiene la lista de trabajos cron con paginación y filtros avanzados',
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
      },
      {
        name: 'get_cuentas',
        description: 'Obtiene la lista de cuentas contables con paginación y filtros avanzados',
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
      },
      {
        name: 'get_cuentabancos',
        description: 'Obtiene la lista de cuentas bancarias con paginación y filtros avanzados',
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
      },
      {
        name: 'get_cuentabancoclientes',
        description: 'Obtiene la lista de cuentas bancarias de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_cuentabancoproveedores',
        description: 'Obtiene la lista de cuentas bancarias de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_cuentaespeciales',
        description: 'Obtiene la lista de cuentas especiales con paginación y filtros avanzados',
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
      },
      {
        name: 'get_diarios',
        description: 'Obtiene la lista de diarios contables con paginación y filtros avanzados',
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
      },
      {
        name: 'get_divisas',
        description: 'Obtiene la lista de divisas con paginación y filtros avanzados',
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
      },
      {
        name: 'get_doctransformations',
        description: 'Obtiene la lista de transformaciones de documentos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_ejercicios',
        description: 'Obtiene la lista de ejercicios fiscales con paginación y filtros avanzados',
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
      },
      {
        name: 'get_emailnotifications',
        description: 'Obtiene la lista de notificaciones de email con paginación y filtros avanzados',
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
      },
      {
        name: 'get_emailsentes',
        description: 'Obtiene la lista de emails enviados con paginación y filtros avanzados',
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
      },
      {
        name: 'get_empresas',
        description: 'Obtiene la lista de empresas con paginación y filtros avanzados',
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
      },
      {
        name: 'get_estadodocumentos',
        description: 'Obtiene la lista de estados de documentos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_fabricantes',
        description: 'Obtiene la lista de fabricantes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_familias',
        description: 'Obtiene la lista de familias de productos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_formapagos',
        description: 'Obtiene la lista de formas de pago con paginación y filtros avanzados',
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
      },
      {
        name: 'get_formatodocumentos',
        description: 'Obtiene la lista de formatos de documento con paginación y filtros avanzados',
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
      },
      {
        name: 'get_grupoclientes',
        description: 'Obtiene la lista de grupos de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_identificadorfiscales',
        description: 'Obtiene la lista de identificadores fiscales con paginación y filtros avanzados',
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
      },
      {
        name: 'get_impuestos',
        description: 'Obtiene la lista de impuestos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_impuestozonas',
        description: 'Obtiene la lista de zonas de impuestos con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineaalbaranclientes',
        description: 'Obtiene la lista de líneas de albarán de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineaalbaranproveedores',
        description: 'Obtiene la lista de líneas de albarán de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineafacturaclientes',
        description: 'Obtiene la lista de líneas de factura de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineafacturaproveedores',
        description: 'Obtiene la lista de líneas de factura de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineapedidoclientes',
        description: 'Obtiene la lista de líneas de pedido de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineapedidoproveedores',
        description: 'Obtiene la lista de líneas de pedido de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineapresupuestoclientes',
        description: 'Obtiene la lista de líneas de presupuesto de clientes con paginación y filtros avanzados',
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
      },
      {
        name: 'get_lineapresupuestoproveedores',
        description: 'Obtiene la lista de líneas de presupuesto de proveedores con paginación y filtros avanzados',
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
      },
      {
        name: 'get_logmessages',
        description: 'Obtiene la lista de mensajes de log del sistema con paginación y filtros avanzados',
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
      {
        uri: 'facturascripts://cuentabancoclientes',
        name: 'FacturaScripts CuentaBancoClientes',
        description: 'Lista de cuentas bancarias de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://cuentabancoproveedores',
        name: 'FacturaScripts CuentaBancoProveedores',
        description: 'Lista de cuentas bancarias de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://cuentaespeciales',
        name: 'FacturaScripts CuentaEspeciales',
        description: 'Lista de cuentas especiales de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://diarios',
        name: 'FacturaScripts Diarios',
        description: 'Lista de diarios contables de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://divisas',
        name: 'FacturaScripts Divisas',
        description: 'Lista de divisas de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://doctransformations',
        name: 'FacturaScripts DocTransformations',
        description: 'Lista de transformaciones de documentos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://ejercicios',
        name: 'FacturaScripts Ejercicios',
        description: 'Lista de ejercicios fiscales de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://emailnotifications',
        name: 'FacturaScripts EmailNotifications',
        description: 'Lista de notificaciones de email de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://emailsentes',
        name: 'FacturaScripts EmailSentes',
        description: 'Lista de emails enviados de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://empresas',
        name: 'FacturaScripts Empresas',
        description: 'Lista de empresas de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://estadodocumentos',
        name: 'FacturaScripts EstadoDocumentos',
        description: 'Lista de estados de documentos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://fabricantes',
        name: 'FacturaScripts Fabricantes',
        description: 'Lista de fabricantes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://familias',
        name: 'FacturaScripts Familias',
        description: 'Lista de familias de productos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://formapagos',
        name: 'FacturaScripts FormaPagos',
        description: 'Lista de formas de pago de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://formatodocumentos',
        name: 'FacturaScripts FormatoDocumentos',
        description: 'Lista de formatos de documento de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://grupoclientes',
        name: 'FacturaScripts GrupoClientes',
        description: 'Lista de grupos de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://identificadorfiscales',
        name: 'FacturaScripts IdentificadorFiscales',
        description: 'Lista de identificadores fiscales de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://impuestos',
        name: 'FacturaScripts Impuestos',
        description: 'Lista de impuestos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://impuestozonas',
        name: 'FacturaScripts ImpuestoZonas',
        description: 'Lista de zonas de impuestos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineaalbaranclientes',
        name: 'FacturaScripts LineaAlbaranClientes',
        description: 'Lista de líneas de albarán de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineaalbaranproveedores',
        name: 'FacturaScripts LineaAlbaranProveedores',
        description: 'Lista de líneas de albarán de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineafacturaclientes',
        name: 'FacturaScripts LineaFacturaClientes',
        description: 'Lista de líneas de factura de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineafacturaproveedores',
        name: 'FacturaScripts LineaFacturaProveedores',
        description: 'Lista de líneas de factura de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineapedidoclientes',
        name: 'FacturaScripts LineaPedidoClientes',
        description: 'Lista de líneas de pedido de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineapedidoproveedores',
        name: 'FacturaScripts LineaPedidoProveedores',
        description: 'Lista de líneas de pedido de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineapresupuestoclientes',
        name: 'FacturaScripts LineaPresupuestoClientes',
        description: 'Lista de líneas de presupuesto de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://lineapresupuestoproveedores',
        name: 'FacturaScripts LineaPresupuestoProveedores',
        description: 'Lista de líneas de presupuesto de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://logmessages',
        name: 'FacturaScripts LogMessages',
        description: 'Lista de mensajes de log del sistema de FacturaScripts con paginación',
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

  if (cuentabanccllientesResource.matchesUri(uri)) {
    return await cuentabanccllientesResource.getResource(uri);
  }

  if (cuentabancoproveedoresResource.matchesUri(uri)) {
    return await cuentabancoproveedoresResource.getResource(uri);
  }

  if (cuentaespecialesResource.matchesUri(uri)) {
    return await cuentaespecialesResource.getResource(uri);
  }

  if (diariosResource.matchesUri(uri)) {
    return await diariosResource.getResource(uri);
  }

  if (divisasResource.matchesUri(uri)) {
    return await divisasResource.getResource(uri);
  }

  if (doctransformationsResource.matchesUri(uri)) {
    return await doctransformationsResource.getResource(uri);
  }

  if (ejerciciosResource.matchesUri(uri)) {
    return await ejerciciosResource.getResource(uri);
  }

  if (emailnotificationsResource.matchesUri(uri)) {
    return await emailnotificationsResource.getResource(uri);
  }

  if (emailsentesResource.matchesUri(uri)) {
    return await emailsentesResource.getResource(uri);
  }

  if (empresasResource.matchesUri(uri)) {
    return await empresasResource.getResource(uri);
  }

  if (estadodocumentosResource.matchesUri(uri)) {
    return await estadodocumentosResource.getResource(uri);
  }

  if (fabricantesResource.matchesUri(uri)) {
    return await fabricantesResource.getResource(uri);
  }

  if (familiasResource.matchesUri(uri)) {
    return await familiasResource.getResource(uri);
  }

  if (formaPagosResource.matchesUri(uri)) {
    return await formaPagosResource.getResource(uri);
  }

  if (formatoDocumentosResource.matchesUri(uri)) {
    return await formatoDocumentosResource.getResource(uri);
  }

  if (grupoClientesResource.matchesUri(uri)) {
    return await grupoClientesResource.getResource(uri);
  }

  if (identificadorFiscalesResource.matchesUri(uri)) {
    return await identificadorFiscalesResource.getResource(uri);
  }

  if (impuestosResource.matchesUri(uri)) {
    return await impuestosResource.getResource(uri);
  }

  if (impuestoZonasResource.matchesUri(uri)) {
    return await impuestoZonasResource.getResource(uri);
  }

  if (lineaAlbaranClientesResource.matchesUri(uri)) {
    return await lineaAlbaranClientesResource.getResource(uri);
  }

  if (lineaAlbaranProveedoresResource.matchesUri(uri)) {
    return await lineaAlbaranProveedoresResource.getResource(uri);
  }

  if (lineaFacturaClientesResource.matchesUri(uri)) {
    return await lineaFacturaClientesResource.getResource(uri);
  }

  if (lineaFacturaProveedoresResource.matchesUri(uri)) {
    return await lineaFacturaProveedoresResource.getResource(uri);
  }

  if (lineaPedidoClientesResource.matchesUri(uri)) {
    return await lineaPedidoClientesResource.getResource(uri);
  }

  if (lineaPedidoProveedoresResource.matchesUri(uri)) {
    return await lineaPedidoProveedoresResource.getResource(uri);
  }

  if (lineaPresupuestoClientesResource.matchesUri(uri)) {
    return await lineaPresupuestoClientesResource.getResource(uri);
  }

  if (lineaPresupuestoProveedoresResource.matchesUri(uri)) {
    return await lineaPresupuestoProveedoresResource.getResource(uri);
  }

  if (logMessagesResource.matchesUri(uri)) {
    return await logMessagesResource.getResource(uri);
  }

  throw new Error(`Resource not found: ${uri}`);
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const limit = args?.limit ?? 50;
  const offset = args?.offset ?? 0;
  const filter = args?.filter;
  const order = args?.order;

  // Helper function to build URI with query parameters supporting advanced FacturaScripts API format
  const buildUri = (resource: string) => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('offset', String(offset));
    
    // Backward compatibility - simple filter and order parameters
    if (filter && typeof filter === 'string') params.set('filter', filter);
    if (order && typeof order === 'string') params.set('order', order);
    
    // Process all arguments to find advanced filter, operation, and sort parameters
    if (args) {
      Object.keys(args).forEach(key => {
        const value = args[key];
        if (value !== undefined && value !== null && value !== '') {
          // Handle filter_* parameters (basic filters and operator filters)
          if (key.startsWith('filter_') && key !== 'filter') {
            params.set(key, String(value));
          }
          // Handle operation_* parameters (OR logic for specific filters)
          else if (key.startsWith('operation_')) {
            params.set(key, String(value));
          }
          // Handle sort_* parameters (sorting by specific fields)
          else if (key.startsWith('sort_')) {
            params.set(key, String(value));
          }
        }
      });
    }
    
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

      case 'get_cuentabancoclientes': {
        const uri = buildUri('cuentabancoclientes');
        const result = await cuentabanccllientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_cuentabancoproveedores': {
        const uri = buildUri('cuentabancoproveedores');
        const result = await cuentabancoproveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_cuentaespeciales': {
        const uri = buildUri('cuentaespeciales');
        const result = await cuentaespecialesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_diarios': {
        const uri = buildUri('diarios');
        const result = await diariosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_divisas': {
        const uri = buildUri('divisas');
        const result = await divisasResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_doctransformations': {
        const uri = buildUri('doctransformations');
        const result = await doctransformationsResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_ejercicios': {
        const uri = buildUri('ejercicios');
        const result = await ejerciciosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_emailnotifications': {
        const uri = buildUri('emailnotifications');
        const result = await emailnotificationsResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_emailsentes': {
        const uri = buildUri('emailsentes');
        const result = await emailsentesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_empresas': {
        const uri = buildUri('empresas');
        const result = await empresasResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_estadodocumentos': {
        const uri = buildUri('estadodocumentos');
        const result = await estadodocumentosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_fabricantes': {
        const uri = buildUri('fabricantes');
        const result = await fabricantesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_familias': {
        const uri = buildUri('familias');
        const result = await familiasResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_formapagos': {
        const uri = buildUri('formapagos');
        const result = await formaPagosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_formatodocumentos': {
        const uri = buildUri('formatodocumentos');
        const result = await formatoDocumentosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_grupoclientes': {
        const uri = buildUri('grupoclientes');
        const result = await grupoClientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_identificadorfiscales': {
        const uri = buildUri('identificadorfiscales');
        const result = await identificadorFiscalesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_impuestos': {
        const uri = buildUri('impuestos');
        const result = await impuestosResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_impuestozonas': {
        const uri = buildUri('impuestozonas');
        const result = await impuestoZonasResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineaalbaranclientes': {
        const uri = buildUri('lineaalbaranclientes');
        const result = await lineaAlbaranClientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineaalbaranproveedores': {
        const uri = buildUri('lineaalbaranproveedores');
        const result = await lineaAlbaranProveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineafacturaclientes': {
        const uri = buildUri('lineafacturaclientes');
        const result = await lineaFacturaClientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineafacturaproveedores': {
        const uri = buildUri('lineafacturaproveedores');
        const result = await lineaFacturaProveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineapedidoclientes': {
        const uri = buildUri('lineapedidoclientes');
        const result = await lineaPedidoClientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineapedidoproveedores': {
        const uri = buildUri('lineapedidoproveedores');
        const result = await lineaPedidoProveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineapresupuestoclientes': {
        const uri = buildUri('lineapresupuestoclientes');
        const result = await lineaPresupuestoClientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_lineapresupuestoproveedores': {
        const uri = buildUri('lineapresupuestoproveedores');
        const result = await lineaPresupuestoProveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_logmessages': {
        const uri = buildUri('logmessages');
        const result = await logMessagesResource.getResource(uri);
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