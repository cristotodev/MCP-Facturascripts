import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FacturaScriptsClient } from './fs/client.js';
// Import resources from modular structure
import { ClientesResource } from './modules/core-business/clientes/resource.js';
import { ProductosResource } from './modules/core-business/productos/resource.js';
import { ProveedoresResource } from './modules/core-business/proveedores/resource.js';
import { StocksResource } from './modules/core-business/stocks/resource.js';
import { ProductoimagenesResource } from './modules/core-business/productoimagenes/resource.js';
import { VariantesResource } from './modules/core-business/variantes/resource.js';
import { ProductoproveedoresResource } from './modules/purchasing/productoproveedores/resource.js';
import { FacturaproveedoresResource } from './modules/purchasing/facturaproveedores/resource.js';
import { AlbaranproveedoresResource } from './modules/purchasing/albaranproveedores/resource.js';
import { PedidoproveedoresResource } from './modules/purchasing/pedidoproveedores/resource.js';
import { PresupuestoproveedoresResource } from './modules/purchasing/presupuestoproveedores/resource.js';
import { PedidoclientesResource } from './modules/sales-orders/pedidoclientes/resource.js';
import { FacturaclientesResource } from './modules/sales-orders/facturaclientes/resource.js';
import { PresupuestoclientesResource } from './modules/sales-orders/presupuestoclientes/resource.js';
import { AlbaranclientesResource } from './modules/sales-orders/albaranclientes/resource.js';
import { LineaPedidoClientesResource } from './modules/sales-orders/line-items/lineapedidoclientes/resource.js';
import { LineaFacturaClientesResource } from './modules/sales-orders/line-items/lineafacturaclientes/resource.js';
import { LineaPresupuestoClientesResource } from './modules/sales-orders/line-items/lineapresupuestoclientes/resource.js';
import { LineaAlbaranClientesResource } from './modules/sales-orders/line-items/lineaalbaranclientes/resource.js';
import { LineaFacturaProveedoresResource } from './modules/sales-orders/line-items/lineafacturaproveedores/resource.js';
import { LineaAlbaranProveedoresResource } from './modules/sales-orders/line-items/lineaalbaranproveedores/resource.js';
import { LineaPedidoProveedoresResource } from './modules/sales-orders/line-items/lineapedidoproveedores/resource.js';
import { LineaPresupuestoProveedoresResource } from './modules/sales-orders/line-items/lineapresupuestoproveedores/resource.js';
import { AsientosResource } from './modules/accounting/asientos/resource.js';
import { CuentasResource } from './modules/accounting/cuentas/resource.js';
import { DiariosResource } from './modules/accounting/diarios/resource.js';
import { EjerciciosResource } from './modules/accounting/ejercicios/resource.js';
import { ConceptopartidasResource } from './modules/accounting/conceptopartidas/resource.js';
import { PartidasResource } from './modules/accounting/partidas/resource.js';
import { CuentabancosResource } from './modules/finance/cuentabancos/resource.js';
import { CuentabanccllientesResource } from './modules/finance/cuentabancoclientes/resource.js';
import { CuentabancoproveedoresResource } from './modules/finance/cuentabancoproveedores/resource.js';
import { CuentaespecialesResource } from './modules/finance/cuentaespeciales/resource.js';
import { DivisasResource } from './modules/finance/divisas/resource.js';
import { AgenciatransportesResource } from './modules/configuration/agenciatransportes/resource.js';
import { AgentesResource } from './modules/configuration/agentes/resource.js';
import { AlmacenesResource } from './modules/configuration/almacenes/resource.js';
import { AtributosResource } from './modules/configuration/atributos/resource.js';
import { AtributovaloresResource } from './modules/configuration/atributovalores/resource.js';
import { EstadodocumentosResource } from './modules/configuration/estadodocumentos/resource.js';
import { FabricantesResource } from './modules/configuration/fabricantes/resource.js';
import { FamiliasResource } from './modules/configuration/familias/resource.js';
import { FormaPagosResource } from './modules/configuration/formapagos/resource.js';
import { FormatodocumentosResource } from './modules/configuration/formatodocumentos/resource.js';
import { GrupoclientesResource } from './modules/configuration/grupoclientes/resource.js';
import { IdentificadorfiscalesResource } from './modules/configuration/identificadorfiscales/resource.js';
import { ImpuestosResource } from './modules/configuration/impuestos/resource.js';
import { ImpuestozonasResource } from './modules/configuration/impuestozonas/resource.js';
import { ApiaccessResource } from './modules/system/apiaccess/resource.js';
import { ApikeyesResource } from './modules/system/apikeyes/resource.js';
import { AttachedfilesResource } from './modules/system/attachedfiles/resource.js';
import { AttachedfilerelationsResource } from './modules/system/attachedfilerelations/resource.js';
import { CronjobesResource } from './modules/system/cronjobes/resource.js';
import { DoctransformationsResource } from './modules/system/doctransformations/resource.js';
import { LogmessagesResource } from './modules/system/logmessages/resource.js';
import { TotalModelesResource } from './modules/system/totalmodeles/resource.js';
import { WorkEventesResource } from './modules/system/workeventes/resource.js';
import { ContactosResource } from './modules/communication/contactos/resource.js';
import { EmailnotificationsResource } from './modules/communication/emailnotifications/resource.js';
import { EmailsentesResource } from './modules/communication/emailsentes/resource.js';
import { CiudadesResource } from './modules/geographic/ciudades/resource.js';
import { CodigopostalesResource } from './modules/geographic/codigopostales/resource.js';
import { EmpresasResource } from './modules/geographic/empresas/resource.js';
import { PaisResource } from './modules/geographic/pais/resource.js';
import { ProvinciasResource } from './modules/geographic/provincias/resource.js';
import { PagesResource } from './modules/system/pages/resource.js';
import { PagefilteresResource } from './modules/system/pagefilteres/resource.js';
import { PagoclientesResource } from './modules/finance/pagoclientes/resource.js';
import { PagoproveedoresResource } from './modules/finance/pagoproveedores/resource.js';
import { PuntointeresciudadesResource } from './modules/geographic/puntointeresciudades/resource.js';
import { ReciboclientesResource } from './modules/finance/reciboclientes/resource.js';
import { ReciboproveedoresResource } from './modules/finance/reciboproveedores/resource.js';
import { RegularizacionimpuestosResource } from './modules/configuration/regularizacionimpuestos/resource.js';
import { RetencionesResource } from './modules/configuration/retenciones/resource.js';
import { SecuenciadocumentosResource } from './modules/configuration/secuenciadocumentos/resource.js';
import { SeriesResource } from './modules/configuration/series/resource.js';
import { SubcuentasResource } from './modules/accounting/subcuentas/resource.js';
import { TarifasResource } from './modules/configuration/tarifas/resource.js';
// Import new tool functions
import { toolByCifnifImplementation, toolClientesMorososImplementation, toolClientesTopFacturacionImplementation, toolClientesSinComprasImplementation, toolExportarFacturaImplementation, toolClientesFrecuenciaComprasImplementation, toolFacturasConErroresImplementation } from './modules/sales-orders/facturaclientes/tool.js';
import { lowStockToolImplementation } from './modules/core-business/stocks/tool.js';
import { toolProductosMasVendidosImplementation } from './modules/sales-orders/line-items/lineafacturaclientes/tool.js';
import { productosNoVendidosToolDefinition, productosNoVendidosToolImplementation } from './modules/core-business/productos/index.js';
import { partidasToolDefinition, partidasToolImplementation } from './modules/accounting/partidas/index.js';
import { pedidoproveedoresToolDefinition, pedidoproveedoresToolImplementation } from './modules/purchasing/pedidoproveedores/index.js';
import { presupuestoproveedoresToolDefinition, presupuestoproveedoresToolImplementation } from './modules/purchasing/presupuestoproveedores/index.js';
import { productoimagenesToolDefinition, productoimagenesToolImplementation } from './modules/core-business/productoimagenes/index.js';
import { provinciasToolDefinition, provinciasToolImplementation } from './modules/geographic/provincias/index.js';
import { puntointeresciudadesToolDefinition, puntointeresciudadesToolImplementation } from './modules/geographic/puntointeresciudades/index.js';
import { reciboclientesToolDefinition, reciboclientesToolImplementation } from './modules/finance/reciboclientes/index.js';
import { reciboproveedoresToolDefinition, reciboproveedoresToolImplementation } from './modules/finance/reciboproveedores/index.js';
import { regularizacionimpuestosToolDefinition, regularizacionimpuestosToolImplementation } from './modules/configuration/regularizacionimpuestos/index.js';
import { retencionesToolDefinition, retencionesToolImplementation } from './modules/configuration/retenciones/index.js';
import { secuenciadocumentosToolDefinition, secuenciadocumentosToolImplementation } from './modules/configuration/secuenciadocumentos/index.js';
import { seriesToolDefinition, seriesToolImplementation } from './modules/configuration/series/index.js';
import { subcuentasToolDefinition, subcuentasToolImplementation } from './modules/accounting/subcuentas/index.js';
import { tarifasToolDefinition, tarifasToolImplementation } from './modules/configuration/tarifas/index.js';
import { totalModelesToolDefinition, totalModelesToolImplementation } from './modules/system/totalmodeles/index.js';
import { variantesToolDefinition, variantesToolImplementation } from './modules/core-business/variantes/index.js';
import { workEventesToolDefinition, workEventesToolImplementation } from './modules/system/workeventes/index.js';

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
const pedidoproveedoresResource = new PedidoproveedoresResource(fsClient);
const presupuestoproveedoresResource = new PresupuestoproveedoresResource(fsClient);
const pedidoclientesResource = new PedidoclientesResource(fsClient);
const facturaclientesResource = new FacturaclientesResource(fsClient);
const presupuestoclientesResource = new PresupuestoclientesResource(fsClient);
const proveedoresResource = new ProveedoresResource(fsClient);
const stocksResource = new StocksResource(fsClient);
const productoimagenesResource = new ProductoimagenesResource(fsClient);
const variantesResource = new VariantesResource(fsClient);
const facturaproveedoresResource = new FacturaproveedoresResource(fsClient);
const agenciatransportesResource = new AgenciatransportesResource(fsClient);
const agentesResource = new AgentesResource(fsClient);
const albaranclientesResource = new AlbaranclientesResource(fsClient);
const albaranproveedoresResource = new AlbaranproveedoresResource(fsClient);
const almacenesResource = new AlmacenesResource(fsClient);
const apiAccessResource = new ApiaccessResource(fsClient);
const apiKeyesResource = new ApikeyesResource(fsClient);
const asientosResource = new AsientosResource(fsClient);
const atributosResource = new AtributosResource(fsClient);
const atributoValoresResource = new AtributovaloresResource(fsClient);
const attachedFilesResource = new AttachedfilesResource(fsClient);
const attachedFileRelationsResource = new AttachedfilerelationsResource(fsClient);
const ciudadesResource = new CiudadesResource(fsClient);
const codigoPostalesResource = new CodigopostalesResource(fsClient);
const conceptopartidasResource = new ConceptopartidasResource(fsClient);
const partidasResource = new PartidasResource(fsClient);
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
const formatoDocumentosResource = new FormatodocumentosResource(fsClient);
const grupoClientesResource = new GrupoclientesResource(fsClient);
const identificadorFiscalesResource = new IdentificadorfiscalesResource(fsClient);
const impuestosResource = new ImpuestosResource(fsClient);
const impuestoZonasResource = new ImpuestozonasResource(fsClient);
const lineaAlbaranClientesResource = new LineaAlbaranClientesResource(fsClient);
const lineaAlbaranProveedoresResource = new LineaAlbaranProveedoresResource(fsClient);
const lineaFacturaClientesResource = new LineaFacturaClientesResource(fsClient);
const lineaFacturaProveedoresResource = new LineaFacturaProveedoresResource(fsClient);
const lineaPedidoClientesResource = new LineaPedidoClientesResource(fsClient);
const lineaPedidoProveedoresResource = new LineaPedidoProveedoresResource(fsClient);
const lineaPresupuestoClientesResource = new LineaPresupuestoClientesResource(fsClient);
const lineaPresupuestoProveedoresResource = new LineaPresupuestoProveedoresResource(fsClient);
const logMessagesResource = new LogmessagesResource(fsClient);
const pagesResource = new PagesResource(fsClient);
const pagefilteresResource = new PagefilteresResource(fsClient);
const pagoclientesResource = new PagoclientesResource(fsClient);
const pagoproveedoresResource = new PagoproveedoresResource(fsClient);
const paisResource = new PaisResource(fsClient);
const provinciasResource = new ProvinciasResource(fsClient);
const puntointeresciudadesResource = new PuntointeresciudadesResource(fsClient);
const reciboclientesResource = new ReciboclientesResource(fsClient);
const reciboproveedoresResource = new ReciboproveedoresResource(fsClient);
const regularizacionimpuestosResource = new RegularizacionimpuestosResource(fsClient);
const retencionesResource = new RetencionesResource(fsClient);
const secuenciadocumentosResource = new SecuenciadocumentosResource(fsClient);
const seriesResource = new SeriesResource(fsClient);
const subcuentasResource = new SubcuentasResource(fsClient);
const tarifasResource = new TarifasResource(fsClient);
const totalModelesResource = new TotalModelesResource(fsClient);
const workEventesResource = new WorkEventesResource(fsClient);

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
      productosNoVendidosToolDefinition,
      partidasToolDefinition,
      pedidoproveedoresToolDefinition,
      presupuestoproveedoresToolDefinition,
      productoimagenesToolDefinition,
      provinciasToolDefinition,
      puntointeresciudadesToolDefinition,
      reciboclientesToolDefinition,
      reciboproveedoresToolDefinition,
      regularizacionimpuestosToolDefinition,
      retencionesToolDefinition,
      secuenciadocumentosToolDefinition,
      seriesToolDefinition,
      subcuentasToolDefinition,
      tarifasToolDefinition,
      totalModelesToolDefinition,
      variantesToolDefinition,
      workEventesToolDefinition,
      {
        name: 'exportar_factura_cliente',
        description: 'Exporta una factura de cliente en formato PDF. Proporciona el código de la factura y obtiene el documento PDF listo para descarga. Útil para envío de facturas a clientes, archivo de documentos y gestión documental.',
        inputSchema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Código de la factura a exportar (requerido)' },
            type: { type: 'string', description: 'Tipo de exportación', enum: ['PDF'], default: 'PDF' },
            format: { type: 'number', description: 'Formato del documento (0 por defecto)', default: 0 },
            lang: { type: 'string', description: 'Código de idioma para el documento', default: 'es' }
          },
          required: ['code']
        }
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
        name: 'get_facturas_cliente_por_cifnif',
        description: 'Obtiene las facturas de un cliente específico mediante su CIF/NIF. Realiza una búsqueda en dos pasos: 1) Busca el cliente por CIF/NIF, 2) Obtiene sus facturas con filtros opcionales. Ejemplos: filtros por fechas (fecha_gte:2024-01-01), importes (total_gt:100.00), estado (pagada:false). Útil para atención al cliente, gestión de cobros y análisis financiero.',
        inputSchema: {
          type: 'object',
          properties: {
            cifnif: {
              type: 'string',
              description: 'CIF/NIF del cliente (requerido)',
            },
            limit: {
              type: 'number',
              description: 'Número máximo de facturas a devolver (1-1000)',
              minimum: 1,
              maximum: 1000,
              default: 50,
            },
            offset: {
              type: 'number',
              description: 'Número de facturas a omitir para paginación',
              minimum: 0,
              default: 0,
            },
            filter: {
              type: 'string',
              description: 'Filtros adicionales para facturas. Formato: campo:valor separados por comas. Ejemplos: "fecha_gte:2024-01-01,total_gt:100.00,pagada:false" para facturas desde enero 2024, >100€, no pagadas. Operadores: _gt, _gte, _lt, _lte, _neq, _like',
              default: '',
            },
            order: {
              type: 'string',
              description: 'Ordenación de facturas en formato campo:asc|desc (ej: fecha:desc)',
              default: '',
            },
          },
          required: ['cifnif'],
        },
      },
      {
        name: 'get_clientes_morosos',
        description: 'Obtiene una lista de clientes con facturas impagadas y vencidas. Realiza consultas avanzadas filtrando facturas no pagadas (pagada:false) y vencidas (vencida:true), agrupa por cliente y calcula totales pendientes. Incluye información del cliente (nombre, CIF/NIF, email) y detalles de deuda (total pendiente, número de facturas vencidas, códigos de facturas). Útil para gestión de cobros, seguimiento de morosos y análisis financiero.',
        inputSchema: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Número máximo de clientes morosos a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
            offset: { type: 'number', description: 'Número de clientes a omitir para paginación', minimum: 0, default: 0 }
          }
        }
      },
      {
        name: 'get_clientes_top_facturacion',
        description: 'Obtiene un ranking de clientes por su facturación total en un rango de fechas específico. Agrupa facturas por cliente y calcula totales facturados y número de facturas. Permite filtrar solo facturas pagadas. Útil para análisis de ventas, identificación de mejores clientes y estrategias comerciales.',
        inputSchema: {
          type: 'object',
          properties: {
            fecha_desde: { type: 'string', description: 'Fecha de inicio del período (formato: YYYY-MM-DD)' },
            fecha_hasta: { type: 'string', description: 'Fecha de fin del período (formato: YYYY-MM-DD)' },
            solo_pagadas: { type: 'boolean', description: 'Si es true, solo incluye facturas pagadas', default: false },
            limit: { type: 'number', description: 'Número máximo de clientes a devolver (1-1000)', minimum: 1, maximum: 1000, default: 100 },
            offset: { type: 'number', description: 'Número de clientes a omitir para paginación', minimum: 0, default: 0 }
          },
          required: ['fecha_desde', 'fecha_hasta']
        }
      },
      {
        name: 'get_clientes_sin_compras',
        description: 'Obtiene una lista de clientes que no han realizado compras (no aparecen en facturas de clientes) en un rango de fechas específico. Realiza búsqueda en dos pasos: 1) Obtiene todos los clientes activos, 2) Filtra aquellos sin facturas en el período. Útil para campañas de reactivación, análisis de clientes inactivos y estrategias de retención.',
        inputSchema: {
          type: 'object',
          properties: {
            fecha_desde: { type: 'string', description: 'Fecha de inicio del período (formato: YYYY-MM-DD)' },
            fecha_hasta: { type: 'string', description: 'Fecha de fin del período (formato: YYYY-MM-DD)' },
            limit: { type: 'number', description: 'Número máximo de clientes a devolver (1-1000)', minimum: 1, maximum: 1000, default: 100 },
            offset: { type: 'number', description: 'Número de clientes a omitir para paginación', minimum: 0, default: 0 }
          },
          required: ['fecha_desde', 'fecha_hasta']
        }
      },
      {
        name: 'get_clientes_frecuencia_compras',
        description: 'Analiza la frecuencia de compras de clientes basándose en sus facturas dentro de un rango de fechas específico. Calcula el número de compras, fechas de primera y última compra, y la frecuencia promedio en días entre compras. Útil para segmentar clientes frecuentes, ocasionales o inactivos, y para estrategias de fidelización.',
        inputSchema: {
          type: 'object',
          properties: {
            fecha_desde: { type: 'string', description: 'Fecha de inicio del período de análisis (formato: YYYY-MM-DD)' },
            fecha_hasta: { type: 'string', description: 'Fecha de fin del período de análisis (formato: YYYY-MM-DD)' },
            limit: { type: 'number', description: 'Número máximo de clientes a devolver (1-1000)', minimum: 1, maximum: 1000, default: 100 },
            offset: { type: 'number', description: 'Número de clientes a omitir para paginación', minimum: 0, default: 0 }
          },
          required: ['fecha_desde', 'fecha_hasta']
        }
      },
      {
        name: 'get_facturas_con_errores',
        description: 'Obtiene una lista de facturas de clientes que presentan posibles errores de integridad de datos como clientes faltantes, totales en cero, fechas vacías, facturas sin líneas o identificadores duplicados. Útil para detectar facturas problemáticas y realizar limpiezas de datos y revisiones contables.',
        inputSchema: {
          type: 'object',
          properties: {
            fecha_desde: { type: 'string', description: 'Fecha de inicio del período (formato: YYYY-MM-DD)' },
            fecha_hasta: { type: 'string', description: 'Fecha de fin del período (formato: YYYY-MM-DD)' },
            limit: { type: 'number', description: 'Número máximo de facturas con errores a devolver (1-1000)', minimum: 1, maximum: 1000, default: 100 },
            offset: { type: 'number', description: 'Número de facturas a omitir para paginación', minimum: 0, default: 0 }
          }
        }
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
        name: 'get_productos_bajo_stock',
        description: 'Obtiene una lista de productos cuyo stock actual está por debajo del stock mínimo definido. Identifica productos que necesitan reposición urgente para evitar roturas de stock. Útil para gestión de inventarios, compras y planificación de almacén.',
        inputSchema: {
          type: 'object',
          properties: {
            incluir_stock_igual: {
              type: 'boolean',
              description: 'Si incluir productos cuyo stock actual es igual al mínimo (por defecto: true)',
              default: true
            },
            codalmacen: {
              type: 'string',
              description: 'Código de almacén para filtrar productos (opcional). Si se omite, revisa todos los almacenes'
            },
            limite: {
              type: 'number',
              description: 'Número máximo de productos a devolver (1-1000)',
              minimum: 1,
              maximum: 1000,
              default: 100
            },
            offset: {
              type: 'number',
              description: 'Número de productos a omitir para paginación',
              minimum: 0,
              default: 0
            }
          }
        }
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
        name: 'get_productos_mas_vendidos',
        description: 'Obtiene un ranking de los productos más vendidos en un período determinado basado en líneas de facturas de clientes. Agrupa por referencia y descripción, sumando cantidades e importes facturados.',
        inputSchema: {
          type: 'object',
          properties: {
            fecha_desde: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del período (YYYY-MM-DD, requerida)',
            },
            fecha_hasta: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin del período (YYYY-MM-DD, requerida)',
            },
            limit: {
              type: 'number',
              description: 'Número máximo de productos a devolver en el ranking (1-1000)',
              minimum: 1,
              maximum: 1000,
              default: 50,
            },
            offset: {
              type: 'number',
              description: 'Número de productos a omitir para paginación',
              minimum: 0,
              default: 0,
            },
            order: {
              type: 'string',
              description: 'Ordenación del ranking: "cantidad_total:desc", "total_facturado:desc", etc.',
              default: 'cantidad_total:desc',
            },
          },
          required: ['fecha_desde', 'fecha_hasta'],
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
      {
        name: 'get_pages',
        description: 'Obtiene la lista de páginas del sistema con información de menús, iconos y configuraciones de visualización',
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
        name: 'get_pagefilteres',
        description: 'Obtiene la lista de filtros de página para configuración de vistas y filtros personalizados de usuarios',
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
        name: 'get_pagoclientes',
        description: 'Obtiene la lista de pagos de clientes con información de importes, fechas, asientos contables y estados de pago',
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
        name: 'get_pagoproveedores',
        description: 'Obtiene la lista de pagos a proveedores con información de importes, fechas, asientos contables y métodos de pago',
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
      {
        uri: 'facturascripts://pages',
        name: 'FacturaScripts Pages',
        description: 'Lista de páginas del sistema de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://pagefilteres',
        name: 'FacturaScripts Page Filters',
        description: 'Lista de filtros de página de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://pagoclientes',
        name: 'FacturaScripts Customer Payments',
        description: 'Lista de pagos de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://pagoproveedores',
        name: 'FacturaScripts Supplier Payments',
        description: 'Lista de pagos a proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://pais',
        name: 'FacturaScripts Countries',
        description: 'Lista de países de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://partidas',
        name: 'FacturaScripts Accounting Entry Lines',
        description: 'Lista de líneas de asientos contables de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://pedidoproveedores',
        name: 'FacturaScripts Supplier Orders',
        description: 'Lista de pedidos de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://presupuestoproveedores',
        name: 'FacturaScripts Supplier Quotes',
        description: 'Lista de presupuestos de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://productoimagenes',
        name: 'FacturaScripts Product Images',
        description: 'Lista de imágenes de productos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://provincias',
        name: 'FacturaScripts Provinces',
        description: 'Lista de provincias de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://puntointeresciudades',
        name: 'FacturaScripts City Points of Interest',
        description: 'Lista de puntos de interés de ciudades de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://reciboclientes',
        name: 'FacturaScripts Customer Receipts',
        description: 'Lista de recibos de clientes de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://reciboproveedores',
        name: 'FacturaScripts Supplier Receipts',
        description: 'Lista de recibos de proveedores de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://regularizacionimpuestos',
        name: 'FacturaScripts Tax Regularizations',
        description: 'Lista de regularizaciones de impuestos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://retenciones',
        name: 'FacturaScripts Retentions/Withholdings',
        description: 'Lista de retenciones de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://secuenciadocumentos',
        name: 'FacturaScripts Document Sequences',
        description: 'Lista de secuencias de documentos de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://series',
        name: 'FacturaScripts Series',
        description: 'Lista de series de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://subcuentas',
        name: 'FacturaScripts Sub-accounts',
        description: 'Lista de subcuentas contables de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://tarifas',
        name: 'FacturaScripts Tariffs/Price Lists',
        description: 'Lista de tarifas y listas de precios de FacturaScripts con paginación',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://totalmodeles',
        name: 'FacturaScripts Analytics/Total Models',
        description: 'Lista de modelos de análisis y agregación de datos del sistema FacturaScripts',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://variantes',
        name: 'FacturaScripts Product Variants',
        description: 'Lista de variantes de productos con diferentes atributos, precios y stock',
        mimeType: 'application/json',
      },
      {
        uri: 'facturascripts://workeventes',
        name: 'FacturaScripts Work Events',
        description: 'Lista de eventos y trabajos del sistema para monitoreo y seguimiento de procesos',
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

  if (pagesResource.matchesUri(uri)) {
    return await pagesResource.getResource(uri);
  }

  if (pagefilteresResource.matchesUri(uri)) {
    return await pagefilteresResource.getResource(uri);
  }

  if (pagoclientesResource.matchesUri(uri)) {
    return await pagoclientesResource.getResource(uri);
  }

  if (pagoproveedoresResource.matchesUri(uri)) {
    return await pagoproveedoresResource.getResource(uri);
  }

  if (paisResource.matchesUri(uri)) {
    return await paisResource.getResource(uri);
  }

  if (partidasResource.matchesUri(uri)) {
    return await partidasResource.getResource(uri);
  }

  if (pedidoproveedoresResource.matchesUri(uri)) {
    return await pedidoproveedoresResource.getResource(uri);
  }

  if (presupuestoproveedoresResource.matchesUri(uri)) {
    return await presupuestoproveedoresResource.getResource(uri);
  }

  if (productoimagenesResource.matchesUri(uri)) {
    return await productoimagenesResource.getResource(uri);
  }

  if (provinciasResource.matchesUri(uri)) {
    return await provinciasResource.getResource(uri);
  }

  if (puntointeresciudadesResource.matchesUri(uri)) {
    return await puntointeresciudadesResource.getResource(uri);
  }

  if (reciboclientesResource.matchesUri(uri)) {
    return await reciboclientesResource.getResource(uri);
  }

  if (reciboproveedoresResource.matchesUri(uri)) {
    return await reciboproveedoresResource.getResource(uri);
  }

  if (regularizacionimpuestosResource.matchesUri(uri)) {
    return await regularizacionimpuestosResource.getResource(uri);
  }

  if (retencionesResource.matchesUri(uri)) {
    return await retencionesResource.getResource(uri);
  }

  if (secuenciadocumentosResource.matchesUri(uri)) {
    return await secuenciadocumentosResource.getResource(uri);
  }

  if (seriesResource.matchesUri(uri)) {
    return await seriesResource.getResource(uri);
  }

  if (subcuentasResource.matchesUri(uri)) {
    return await subcuentasResource.getResource(uri);
  }

  if (tarifasResource.matchesUri(uri)) {
    return await tarifasResource.getResource(uri);
  }

  if (totalModelesResource.matchesUri(uri)) {
    return await totalModelesResource.getResource(uri);
  }

  if (variantesResource.matchesUri(uri)) {
    return await variantesResource.getResource(uri);
  }

  if (workEventesResource.matchesUri(uri)) {
    return await workEventesResource.getResource(uri);
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

      case 'get_productos_no_vendidos': {
        return await productosNoVendidosToolImplementation(request.params.arguments as any, fsClient);
      }

      case 'get_partidas': {
        return await partidasToolImplementation(partidasResource, buildUri);
      }

      case 'get_pedidoproveedores': {
        return await pedidoproveedoresToolImplementation(pedidoproveedoresResource, buildUri);
      }

      case 'get_presupuestoproveedores': {
        return await presupuestoproveedoresToolImplementation(presupuestoproveedoresResource, buildUri);
      }

      case 'get_productoimagenes': {
        return await productoimagenesToolImplementation(productoimagenesResource, buildUri);
      }

      case 'get_provincias': {
        return await provinciasToolImplementation(provinciasResource, buildUri);
      }
      case 'get_puntointeresciudades': {
        return await puntointeresciudadesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_reciboclientes': {
        return await reciboclientesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_reciboproveedores': {
        return await reciboproveedoresToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_regularizacionimpuestos': {
        return await regularizacionimpuestosToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_retenciones': {
        return await retencionesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_secuenciadocumentos': {
        return await secuenciadocumentosToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_series': {
        return await seriesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_subcuentas': {
        return await subcuentasToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_tarifas': {
        return await tarifasToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_totalmodeles': {
        return await totalModelesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_variantes': {
        return await variantesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'get_workeventes': {
        return await workEventesToolImplementation(request.params.arguments, fsClient, buildUri);
      }
      case 'exportar_factura_cliente': {
        return await toolExportarFacturaImplementation(request.params.arguments as { code: string; type?: string; format?: number; lang?: string }, fsClient);
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

      case 'get_facturas_cliente_por_cifnif': {
        return await toolByCifnifImplementation(request.params.arguments as any, fsClient);
      }

      case 'get_clientes_morosos': {
        return await toolClientesMorososImplementation(request.params.arguments as any, fsClient);
      }

      case 'get_clientes_top_facturacion': {
        return await toolClientesTopFacturacionImplementation(request.params.arguments as any, fsClient);
      }

      case 'get_clientes_sin_compras': {
        return await toolClientesSinComprasImplementation(request.params.arguments as any, fsClient);
      }

      case 'get_clientes_frecuencia_compras': {
        return await toolClientesFrecuenciaComprasImplementation(request.params.arguments as any, fsClient);
      }

      case 'get_facturas_con_errores': {
        return await toolFacturasConErroresImplementation(request.params.arguments as any, fsClient);
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

      case 'get_productos_bajo_stock': {
        return await lowStockToolImplementation(request.params.arguments as any, fsClient);
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

      case 'get_productos_mas_vendidos': {
        return await toolProductosMasVendidosImplementation(request.params.arguments as any, fsClient);
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

      case 'get_pages': {
        const uri = buildUri('pages');
        const result = await pagesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_pagefilteres': {
        const uri = buildUri('pagefilteres');
        const result = await pagefilteresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_pagoclientes': {
        const uri = buildUri('pagoclientes');
        const result = await pagoclientesResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_pagoproveedores': {
        const uri = buildUri('pagoproveedores');
        const result = await pagoproveedoresResource.getResource(uri);
        return {
          content: [
            {
              type: 'text',
              text: (result as any).contents?.[0]?.text || 'No data',
            },
          ],
        };
      }

      case 'get_pais': {
        const uri = buildUri('pais');
        const result = await paisResource.getResource(uri);
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