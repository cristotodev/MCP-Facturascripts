import { z } from 'zod';
import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';
import type { FacturaCliente } from './resource.js';

export const toolDefinition = {
  name: 'get_facturaclientes',
  description: 'Obtiene la lista de facturas de clientes con paginación y filtros avanzados',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Número máximo de registros a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de registros a omitir para paginación', minimum: 0, default: 0 },
      filter: { type: 'string', description: 'Filtros en formato campo:valor (ej: codcliente:CLI001)', default: '' },
      order: { type: 'string', description: 'Ordenación en formato campo:asc|desc (ej: fecha:desc)', default: '' }
    }
  }
};

export async function toolImplementation(
  args: { limit?: number; offset?: number; filter?: string; order?: string },
  client: FacturaScriptsClient
) {
  const limit = Math.min(Math.max(args.limit || 50, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  // Build query string
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  if (args.filter) params.append('filter', args.filter);
  if (args.order) params.append('order', args.order);

  const uri = `facturascripts://facturaclientes?${params.toString()}`;
  const { additionalParams } = parseUrlParameters(uri);

  try {
    const result = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      limit,
      offset,
      additionalParams
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch facturaclientes',
            message: errorMessage,
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// New tool definition for searching invoices by client CIF/NIF
export const toolByCifnifDefinition = {
  name: 'get_facturas_cliente_por_cifnif',
  description: 'Obtiene las facturas de un cliente específico mediante su CIF/NIF. Realiza una búsqueda en dos pasos: 1) Busca el cliente por CIF/NIF, 2) Obtiene sus facturas con filtros opcionales. Ejemplos: filtros por fechas (fecha_gte:2024-01-01), importes (total_gt:100.00), estado (pagada:false). Útil para atención al cliente, gestión de cobros y análisis financiero.',
  inputSchema: {
    type: 'object',
    properties: {
      cifnif: { type: 'string', description: 'CIF/NIF del cliente (requerido)' },
      limit: { type: 'number', description: 'Número máximo de facturas a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de facturas a omitir para paginación', minimum: 0, default: 0 },
      filter: { type: 'string', description: 'Filtros adicionales para facturas. Formato: campo:valor separados por comas. Ejemplos: "fecha_gte:2024-01-01,total_gt:100.00,pagada:false" para facturas desde enero 2024, >100€, no pagadas. Operadores: _gt, _gte, _lt, _lte, _neq, _like', default: '' },
      order: { type: 'string', description: 'Ordenación de facturas en formato campo:asc|desc (ej: fecha:desc)', default: '' }
    },
    required: ['cifnif']
  }
};

export async function toolByCifnifImplementation(
  args: { cifnif: string; limit?: number; offset?: number; filter?: string; order?: string },
  client: FacturaScriptsClient
) {
  const { cifnif } = args;
  const limit = Math.min(Math.max(args.limit || 50, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Search for client by CIF/NIF
    const clientFilter = `cifnif:${cifnif}`;
    const clientParams = new URLSearchParams();
    clientParams.append('limit', '1');
    clientParams.append('offset', '0');
    clientParams.append('filter', clientFilter);

    const clientUri = `facturascripts://clientes?${clientParams.toString()}`;
    const { additionalParams: clientAdditionalParams } = parseUrlParameters(clientUri);

    const clientResult = await client.getWithPagination<any>(
      '/clientes',
      1,
      0,
      clientAdditionalParams
    );

    if (!clientResult.data || clientResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Client not found',
              message: `No se encontró ningún cliente con CIF/NIF: ${cifnif}`,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    // Step 2: Get client code from the first result
    const cliente = clientResult.data[0];
    const codcliente = cliente.codcliente;

    if (!codcliente) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Client code not found',
              message: `El cliente encontrado no tiene código de cliente válido`,
              clientData: cliente,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    // Step 3: Search for invoices using the client code and additional filters
    let invoiceFilter = `codcliente:${codcliente}`;
    if (args.filter) {
      // Combine client filter with additional filters
      invoiceFilter += `,${args.filter}`;
    }

    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', limit.toString());
    invoiceParams.append('offset', offset.toString());
    invoiceParams.append('filter', invoiceFilter);
    if (args.order) invoiceParams.append('order', args.order);

    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams: invoiceAdditionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      limit,
      offset,
      invoiceAdditionalParams
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            clientInfo: {
              cifnif: cliente.cifnif,
              codcliente: cliente.codcliente,
              nombre: cliente.nombre || cliente.razonsocial,
            },
            invoices: invoiceResult,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch invoices by CIF/NIF',
            message: errorMessage,
            cifnif,
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for clients with overdue unpaid invoices
export const toolClientesMorososDefinition = {
  name: 'get_clientes_morosos',
  description: 'Obtiene una lista de clientes con facturas impagadas y vencidas. Realiza consultas avanzadas filtrando facturas no pagadas (pagada:false) y vencidas (vencida:true), agrupa por cliente y calcula totales pendientes. Incluye información del cliente (nombre, CIF/NIF, email) y detalles de deuda (total pendiente, número de facturas vencidas, códigos de facturas). Útil para gestión de cobros, seguimiento de morosos y análisis financiero.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Número máximo de clientes morosos a devolver (1-1000)', minimum: 1, maximum: 1000, default: 50 },
      offset: { type: 'number', description: 'Número de clientes a omitir para paginación', minimum: 0, default: 0 }
    }
  }
};

interface ClienteMoroso {
  codcliente: string;
  nombre: string;
  cifnif: string;
  email: string | null;
  total_pendiente: number;
  facturas_vencidas: number;
  codigos_facturas: string[];
}

export async function toolClientesMorososImplementation(
  args: { limit?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const limit = Math.min(Math.max(args.limit || 50, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get ALL invoices (no filters in API call)
    const allInvoicesResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      5000, // Large limit to get all invoices for filtering
      0,
      {} // No filters applied at API level
    );

    if (!allInvoicesResult.data || allInvoicesResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'No se encontraron facturas en el sistema',
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Filter invoices in memory: pagada === false AND vencida === true
    const overdueUnpaidInvoices = allInvoicesResult.data.filter(invoice =>
      invoice.pagada === false && invoice.vencida === true
    );

    if (overdueUnpaidInvoices.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: 'No se encontraron clientes con facturas vencidas y no pagadas',
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 3: Group by codcliente and calculate aggregates
    const clienteGroups = new Map<string, {
      facturas_vencidas: number;
      total_pendiente: number;
      codigos_facturas: string[];
    }>();

    overdueUnpaidInvoices.forEach(invoice => {
      const codcliente = invoice.codcliente;
      const existing = clienteGroups.get(codcliente) || {
        facturas_vencidas: 0,
        total_pendiente: 0,
        codigos_facturas: []
      };

      existing.facturas_vencidas += 1;
      existing.total_pendiente += invoice.total || 0;
      existing.codigos_facturas.push(invoice.codigo);

      clienteGroups.set(codcliente, existing);
    });

    // Step 4: Get client details for each group
    const clientesMorosos: ClienteMoroso[] = [];

    for (const [codcliente, aggregates] of clienteGroups.entries()) {
      try {
        const clientFilter = `codcliente:${codcliente}`;
        const clientParams = new URLSearchParams();
        clientParams.append('limit', '1');
        clientParams.append('offset', '0');
        clientParams.append('filter', clientFilter);

        const clientUri = `facturascripts://clientes?${clientParams.toString()}`;
        const { additionalParams: clientAdditionalParams } = parseUrlParameters(clientUri);

        const clientResult = await client.getWithPagination<any>(
          '/clientes',
          1,
          0,
          clientAdditionalParams
        );

        if (clientResult.data && clientResult.data.length > 0) {
          const cliente = clientResult.data[0];
          clientesMorosos.push({
            codcliente,
            nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
            cifnif: cliente.cifnif || 'Sin CIF/NIF',
            email: cliente.email || null,
            total_pendiente: aggregates.total_pendiente,
            facturas_vencidas: aggregates.facturas_vencidas,
            codigos_facturas: aggregates.codigos_facturas
          });
        }
      } catch (error) {
        // If client lookup fails, still include the entry with minimal data
        clientesMorosos.push({
          codcliente,
          nombre: 'Error al obtener datos del cliente',
          cifnif: 'Error',
          email: null,
          total_pendiente: aggregates.total_pendiente,
          facturas_vencidas: aggregates.facturas_vencidas,
          codigos_facturas: aggregates.codigos_facturas
        });
      }
    }

    // Step 5: Sort by total_pendiente descending
    clientesMorosos.sort((a, b) => b.total_pendiente - a.total_pendiente);

    // Step 6: Apply pagination
    const totalClientes = clientesMorosos.length;
    const paginatedClientes = clientesMorosos.slice(offset, offset + limit);
    const hasMore = offset + limit < totalClientes;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            meta: {
              total: totalClientes,
              limit,
              offset,
              hasMore,
            },
            data: paginatedClientes,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch clientes morosos',
            message: errorMessage,
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for top billing clients ranking
export const toolClientesTopFacturacionDefinition = {
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
};

interface ClienteTopFacturacion {
  codcliente: string;
  nombre: string;
  cifnif: string;
  total_facturado: number;
  numero_facturas: number;
}

export async function toolClientesTopFacturacionImplementation(
  args: { fecha_desde: string; fecha_hasta: string; solo_pagadas?: boolean; limit?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const { fecha_desde, fecha_hasta, solo_pagadas = false } = args;
  const limit = Math.min(Math.max(args.limit || 100, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get invoices within date range
    const invoiceFilter = `fecha_gte:${fecha_desde},fecha_lte:${fecha_hasta}`;
    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', '5000'); // Large limit to get all invoices for processing
    invoiceParams.append('offset', '0');
    invoiceParams.append('filter', invoiceFilter);

    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      5000,
      0,
      additionalParams
    );

    if (!invoiceResult.data || invoiceResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              periodo: { fecha_desde, fecha_hasta, solo_pagadas },
              message: `No se encontraron facturas en el período del ${fecha_desde} al ${fecha_hasta}`,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Filter by payment status if requested
    let filteredInvoices = invoiceResult.data;
    if (solo_pagadas) {
      filteredInvoices = invoiceResult.data.filter(invoice => invoice.pagada === true);
    }

    if (filteredInvoices.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              periodo: { fecha_desde, fecha_hasta, solo_pagadas },
              message: solo_pagadas
                ? `No se encontraron facturas pagadas en el período del ${fecha_desde} al ${fecha_hasta}`
                : `No se encontraron facturas en el período del ${fecha_desde} al ${fecha_hasta}`,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 3: Group by codcliente and calculate aggregates
    const clienteGroups = new Map<string, {
      total_facturado: number;
      numero_facturas: number;
    }>();

    filteredInvoices.forEach(invoice => {
      const codcliente = invoice.codcliente;
      const existing = clienteGroups.get(codcliente) || {
        total_facturado: 0,
        numero_facturas: 0
      };

      existing.total_facturado += invoice.total || 0;
      existing.numero_facturas += 1;

      clienteGroups.set(codcliente, existing);
    });

    // Step 4: Get client details for each group
    const clientesTopFacturacion: ClienteTopFacturacion[] = [];

    for (const [codcliente, aggregates] of clienteGroups.entries()) {
      try {
        const clientFilter = `codcliente:${codcliente}`;
        const clientParams = new URLSearchParams();
        clientParams.append('limit', '1');
        clientParams.append('offset', '0');
        clientParams.append('filter', clientFilter);

        const clientUri = `facturascripts://clientes?${clientParams.toString()}`;
        const { additionalParams: clientAdditionalParams } = parseUrlParameters(clientUri);

        const clientResult = await client.getWithPagination<any>(
          '/clientes',
          1,
          0,
          clientAdditionalParams
        );

        if (clientResult.data && clientResult.data.length > 0) {
          const cliente = clientResult.data[0];
          clientesTopFacturacion.push({
            codcliente,
            nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
            cifnif: cliente.cifnif || 'Sin CIF/NIF',
            total_facturado: aggregates.total_facturado,
            numero_facturas: aggregates.numero_facturas
          });
        }
      } catch (error) {
        // If client lookup fails, still include the entry with minimal data
        clientesTopFacturacion.push({
          codcliente,
          nombre: 'Error al obtener datos del cliente',
          cifnif: 'Error',
          total_facturado: aggregates.total_facturado,
          numero_facturas: aggregates.numero_facturas
        });
      }
    }

    // Step 5: Sort by total_facturado descending
    clientesTopFacturacion.sort((a, b) => b.total_facturado - a.total_facturado);

    // Step 6: Apply pagination  
    const totalClientes = clientesTopFacturacion.length;
    const paginatedClientes = clientesTopFacturacion.slice(offset, offset + limit);
    const hasMore = offset + limit < totalClientes;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            periodo: { fecha_desde, fecha_hasta, solo_pagadas },
            meta: {
              total: totalClientes,
              limit,
              offset,
              hasMore,
            },
            data: paginatedClientes,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch clientes top facturación',
            message: errorMessage,
            periodo: { fecha_desde, fecha_hasta },
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for exporting customer invoices as PDF
export const toolExportarFacturaDefinition = {
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
};

export async function toolExportarFacturaImplementation(
  args: { code: string; type?: string; format?: number; lang?: string },
  client: FacturaScriptsClient
) {
  const { code, type = 'PDF', format = 0, lang = 'es' } = args;

  try {
    // Build query parameters for the export endpoint
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (format !== undefined) params.append('format', format.toString());
    if (lang) params.append('lang', lang);

    // Call the export endpoint with path parameter
    const endpoint = `/exportarFacturaCliente/${encodeURIComponent(code)}`;
    const queryString = params.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    // Make the API call - this returns binary PDF data
    const response = await client.getRaw(fullEndpoint);

    if (response.status === 200) {
      // For PDF binary data, we'll return a success message with metadata
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              message: `Factura ${code} exportada correctamente como PDF`,
              exportData: {
                facturaCode: code,
                type,
                format,
                lang,
                contentType: 'application/pdf',
                size: response.headers.get('content-length') || 'unknown'
              }
            }, null, 2)
          }
        ]
      };
    } else {
      // Handle error responses
      let errorMessage = 'Error desconocido al exportar la factura';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Export failed',
              message: errorMessage,
              facturaCode: code,
              httpStatus: response.status
            }, null, 2)
          }
        ],
        isError: true
      };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to export factura',
            message: errorMessage,
            facturaCode: code
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for clients without purchases in a date range
export const toolClientesSinComprasDefinition = {
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
};

interface ClienteSinCompras {
  codcliente: string;
  nombre: string;
  email: string | null;
  telefono1: string | null;
}

export async function toolClientesSinComprasImplementation(
  args: { fecha_desde: string; fecha_hasta: string; limit?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const { fecha_desde, fecha_hasta } = args;
  const limit = Math.min(Math.max(args.limit || 100, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get all clients
    const allClientsResult = await client.getWithPagination<any>(
      '/clientes',
      5000, // Large limit to get all clients
      0,
      {} // No filters
    );

    if (!allClientsResult.data || allClientsResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              periodo: { fecha_desde, fecha_hasta },
              message: 'No se encontraron clientes en el sistema',
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Get invoices within date range
    const invoiceFilter = `fecha_gte:${fecha_desde},fecha_lte:${fecha_hasta}`;
    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', '10000'); // Large limit to get all invoices
    invoiceParams.append('offset', '0');
    invoiceParams.append('filter', invoiceFilter);

    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      10000,
      0,
      additionalParams
    );

    // Step 3: Extract unique client codes from invoices
    const clientesConCompras = new Set<string>();
    if (invoiceResult.data && invoiceResult.data.length > 0) {
      invoiceResult.data.forEach(invoice => {
        if (invoice.codcliente) {
          clientesConCompras.add(invoice.codcliente);
        }
      });
    }

    // Step 4: Filter clients without purchases
    const clientesSinCompras: ClienteSinCompras[] = allClientsResult.data
      .filter(cliente => !clientesConCompras.has(cliente.codcliente))
      .map(cliente => ({
        codcliente: cliente.codcliente,
        nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
        email: cliente.email || null,
        telefono1: cliente.telefono1 || null
      }));

    // Step 5: Apply pagination
    const totalClientes = clientesSinCompras.length;
    const paginatedClientes = clientesSinCompras.slice(offset, offset + limit);
    const hasMore = offset + limit < totalClientes;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            periodo: { fecha_desde, fecha_hasta },
            meta: {
              total: totalClientes,
              limit,
              offset,
              hasMore,
            },
            data: paginatedClientes,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch clientes sin compras',
            message: errorMessage,
            periodo: { fecha_desde, fecha_hasta },
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for customer purchase frequency analysis
export const toolClientesFrecuenciaComprasDefinition = {
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
};

interface ClienteFrecuenciaCompras {
  codcliente: string;
  nombre: string;
  email: string | null;
  telefono1: string | null;
  numero_compras: number;
  fecha_primera_compra: string;
  fecha_ultima_compra: string;
  frecuencia_dias: number | null;
}

export async function toolClientesFrecuenciaComprasImplementation(
  args: { fecha_desde: string; fecha_hasta: string; limit?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const { fecha_desde, fecha_hasta } = args;
  const limit = Math.min(Math.max(args.limit || 100, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get invoices within date range
    const invoiceFilter = `fecha_gte:${fecha_desde},fecha_lte:${fecha_hasta}`;
    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', '10000'); // Large limit to get all invoices for analysis
    invoiceParams.append('offset', '0');
    invoiceParams.append('filter', invoiceFilter);

    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      10000,
      0,
      additionalParams
    );

    if (!invoiceResult.data || invoiceResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              periodo: { fecha_desde, fecha_hasta },
              message: `No se encontraron facturas en el período del ${fecha_desde} al ${fecha_hasta}`,
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Group invoices by client and calculate frequency data
    const clienteGroups = new Map<string, FacturaCliente[]>();

    invoiceResult.data.forEach(invoice => {
      const codcliente = invoice.codcliente;
      if (!clienteGroups.has(codcliente)) {
        clienteGroups.set(codcliente, []);
      }
      clienteGroups.get(codcliente)!.push(invoice);
    });

    // Step 3: Calculate frequency metrics for each client
    const clientesFrecuencia: ClienteFrecuenciaCompras[] = [];

    for (const [codcliente, invoices] of clienteGroups.entries()) {
      // Sort invoices by fecha ascending
      const sortedInvoices = invoices.sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return dateA.getTime() - dateB.getTime();
      });

      const numero_compras = sortedInvoices.length;
      const fecha_primera_compra = sortedInvoices[0].fecha;
      const fecha_ultima_compra = sortedInvoices[sortedInvoices.length - 1].fecha;

      // Calculate average frequency in days
      let frecuencia_dias: number | null = null;
      if (numero_compras > 1) {
        const fechas = sortedInvoices.map(invoice => new Date(invoice.fecha));
        const intervalos: number[] = [];

        for (let i = 1; i < fechas.length; i++) {
          const days = Math.floor((fechas[i].getTime() - fechas[i - 1].getTime()) / (1000 * 60 * 60 * 24));
          intervalos.push(days);
        }

        // Calculate average days between purchases
        if (intervalos.length > 0) {
          const sumaIntervalos = intervalos.reduce((sum, interval) => sum + interval, 0);
          frecuencia_dias = Math.round(sumaIntervalos / intervalos.length);
        }
      }

      try {
        // Get client details
        const clientFilter = `codcliente:${codcliente}`;
        const clientParams = new URLSearchParams();
        clientParams.append('limit', '1');
        clientParams.append('offset', '0');
        clientParams.append('filter', clientFilter);

        const clientUri = `facturascripts://clientes?${clientParams.toString()}`;
        const { additionalParams: clientAdditionalParams } = parseUrlParameters(clientUri);

        const clientResult = await client.getWithPagination<any>(
          '/clientes',
          1,
          0,
          clientAdditionalParams
        );

        if (clientResult.data && clientResult.data.length > 0) {
          const cliente = clientResult.data[0];
          clientesFrecuencia.push({
            codcliente,
            nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
            email: cliente.email || null,
            telefono1: cliente.telefono1 || null,
            numero_compras,
            fecha_primera_compra,
            fecha_ultima_compra,
            frecuencia_dias
          });
        }
      } catch (error) {
        // If client lookup fails, still include with minimal data but keep calculated frequency
        clientesFrecuencia.push({
          codcliente,
          nombre: 'Error al obtener datos del cliente',
          email: null,
          telefono1: null,
          numero_compras,
          fecha_primera_compra,
          fecha_ultima_compra,
          frecuencia_dias // Keep the calculated frequency even when client lookup fails
        });
      }
    }

    // Step 4: Sort by numero_compras descending, then by frecuencia_dias ascending
    clientesFrecuencia.sort((a, b) => {
      if (a.numero_compras !== b.numero_compras) {
        return b.numero_compras - a.numero_compras;
      }
      // For clients with same number of purchases, sort by frequency (lower is better)
      if (a.frecuencia_dias === null && b.frecuencia_dias === null) return 0;
      if (a.frecuencia_dias === null) return 1;
      if (b.frecuencia_dias === null) return -1;
      return a.frecuencia_dias - b.frecuencia_dias;
    });

    // Step 5: Apply pagination
    const totalClientes = clientesFrecuencia.length;
    const paginatedClientes = clientesFrecuencia.slice(offset, offset + limit);
    const hasMore = offset + limit < totalClientes;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            periodo: { fecha_desde, fecha_hasta },
            meta: {
              total: totalClientes,
              limit,
              offset,
              hasMore,
            },
            data: paginatedClientes,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch clientes frecuencia compras',
            message: errorMessage,
            periodo: { fecha_desde, fecha_hasta },
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for invoices with data integrity errors
export const toolFacturasConErroresDefinition = {
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
};

interface FacturaConErrores {
  codigo: string;
  codcliente: string;
  fecha: string;
  total: number;
  errores: string[];
}

export async function toolFacturasConErroresImplementation(
  args: { fecha_desde?: string; fecha_hasta?: string; limit?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const limit = Math.min(Math.max(args.limit || 100, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get invoices with optional date filters
    let invoiceFilter = '';
    if (args.fecha_desde && args.fecha_hasta) {
      invoiceFilter = `fecha_gte:${args.fecha_desde},fecha_lte:${args.fecha_hasta}`;
    } else if (args.fecha_desde) {
      invoiceFilter = `fecha_gte:${args.fecha_desde}`;
    } else if (args.fecha_hasta) {
      invoiceFilter = `fecha_lte:${args.fecha_hasta}`;
    }

    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', '10000'); // High limit to get all invoices for analysis
    invoiceParams.append('offset', '0');
    if (invoiceFilter) invoiceParams.append('filter', invoiceFilter);

    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      10000,
      0,
      additionalParams
    );

    if (!invoiceResult.data || invoiceResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              message: args.fecha_desde || args.fecha_hasta
                ? `No se encontraron facturas en el período especificado`
                : 'No se encontraron facturas en el sistema',
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Build duplicate detection map using numero + codserie + codejercicio
    const duplicateMap = new Map<string, FacturaCliente[]>();

    invoiceResult.data.forEach(invoice => {
      const key = `${invoice.numero || ''}-${invoice.codserie || ''}-${invoice.codejercicio || ''}`;
      if (!duplicateMap.has(key)) {
        duplicateMap.set(key, []);
      }
      duplicateMap.get(key)!.push(invoice);
    });

    // Step 3: Check each invoice for errors
    const facturasConErrores: FacturaConErrores[] = [];

    for (const invoice of invoiceResult.data) {
      const errores: string[] = [];

      // Check for total <= 0
      if (!invoice.total || invoice.total <= 0) {
        errores.push('total vacío o negativo');
      }

      // Check for missing codcliente
      if (!invoice.codcliente || invoice.codcliente.trim() === '') {
        errores.push('cliente no asignado');
      }

      // Check for invalid fecha
      if (!invoice.fecha || invoice.fecha.trim() === '') {
        errores.push('fecha inválida');
      } else {
        // Additional validation: check if fecha is a valid date
        // FacturaScripts uses DD-MM-YYYY format, convert to YYYY-MM-DD for validation
        const fechaStr = invoice.fecha.trim();
        let isValidDate = false;

        // Try to parse DD-MM-YYYY format (FacturaScripts standard)
        const ddmmyyyyMatch = fechaStr.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
        if (ddmmyyyyMatch) {
          const [, day, month, year] = ddmmyyyyMatch;
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          const fecha = new Date(isoDate);
          isValidDate = !isNaN(fecha.getTime()) &&
            fecha.getFullYear() == parseInt(year) &&
            fecha.getMonth() + 1 == parseInt(month) &&
            fecha.getDate() == parseInt(day);
        } else {
          // Try standard JavaScript date parsing as fallback
          const fecha = new Date(fechaStr);
          isValidDate = !isNaN(fecha.getTime());
        }

        if (!isValidDate) {
          errores.push('fecha inválida');
        }
      }

      // Check for duplicate invoice (numero + serie + ejercicio)
      const duplicateKey = `${invoice.numero || ''}-${invoice.codserie || ''}-${invoice.codejercicio || ''}`;
      const duplicates = duplicateMap.get(duplicateKey);
      if (duplicates && duplicates.length > 1) {
        errores.push('posible duplicado');
      }

      // Check for invoices without lines
      if (invoice.idfactura) {
        try {
          const lineFilter = `idfactura:${invoice.idfactura}`;
          const lineParams = new URLSearchParams();
          lineParams.append('limit', '1');
          lineParams.append('offset', '0');
          lineParams.append('filter', lineFilter);

          const lineUri = `facturascripts://lineafacturaclientes?${lineParams.toString()}`;
          const { additionalParams: lineAdditionalParams } = parseUrlParameters(lineUri);

          const lineResult = await client.getWithPagination<any>(
            '/lineafacturaclientes',
            1,
            0,
            lineAdditionalParams
          );

          if (!lineResult.data || lineResult.data.length === 0) {
            errores.push('factura sin líneas');
          }
        } catch (error) {
          // If line lookup fails, we could consider it an error or skip this check
          // For now, we'll skip to avoid false positives
        }
      }

      // Only include invoices that have at least one error
      if (errores.length > 0) {
        facturasConErrores.push({
          codigo: invoice.codigo || 'Sin código',
          codcliente: invoice.codcliente || '',
          fecha: invoice.fecha || '',
          total: invoice.total || 0,
          errores
        });
      }
    }

    // Step 4: Apply pagination
    const totalFacturas = facturasConErrores.length;
    const paginatedFacturas = facturasConErrores.slice(offset, offset + limit);
    const hasMore = offset + limit < totalFacturas;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            meta: {
              total: totalFacturas,
              limit,
              offset,
              hasMore,
            },
            data: paginatedFacturas,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch facturas con errores',
            message: errorMessage,
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}

// Tool definition for lost clients (clients who had invoices but none within specified date range)
export const toolClientesPerdidosDefinition = {
  name: 'get_clientes_perdidos',
  description: 'Obtiene una lista de clientes que tenían facturas anteriormente pero no han comprado desde una fecha específica hasta ahora. Excluye clientes que nunca han comprado (sin historial de facturas). Realiza análisis en tres pasos: 1) Obtiene todos los clientes con historial de facturas, 2) Identifica clientes con facturas anteriores a la fecha límite, 3) Filtra aquellos sin facturas desde la fecha hasta hoy. Útil para campañas de recuperación de clientes perdidos, análisis de retención y estrategias de reactivación.',
  inputSchema: {
    type: 'object',
    properties: {
      fecha_desde: { type: 'string', description: 'Fecha límite desde la cual considerar clientes como perdidos (formato: YYYY-MM-DD). Clientes sin facturas desde esta fecha hasta hoy se consideran perdidos.' },
      limit: { type: 'number', description: 'Número máximo de clientes perdidos a devolver (1-1000)', minimum: 1, maximum: 1000, default: 100 },
      offset: { type: 'number', description: 'Número de clientes a omitir para paginación', minimum: 0, default: 0 }
    },
    required: ['fecha_desde']
  }
};

interface ClientePerdido {
  codcliente: string;
  nombre: string;
  email: string | null;
  telefono1: string | null;
  fecha_ultima_factura: string;
  total_facturas_historicas: number;
  total_facturado_historico: number;
}

export async function toolClientesPerdidosImplementation(
  args: { fecha_desde: string; limit?: number; offset?: number },
  client: FacturaScriptsClient
) {
  const { fecha_desde } = args;
  const limit = Math.min(Math.max(args.limit || 100, 1), 1000);
  const offset = Math.max(args.offset || 0, 0);

  try {
    // Step 1: Get all invoices to identify clients with purchase history
    const allInvoicesResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      10000,
      0,
      {}
    );

    if (!allInvoicesResult.data || allInvoicesResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              fecha_corte: fecha_desde,
              message: 'No se encontraron facturas en el sistema. No hay historial de clientes.',
              meta: {
                total: 0,
                limit,
                offset,
                hasMore: false,
              },
              data: [],
            }, null, 2)
          }
        ]
      };
    }

    // Step 2: Group all invoices by client and calculate historical data
    const clienteHistorico = new Map<string, {
      facturas: FacturaCliente[];
      total_facturas: number;
      total_facturado: number;
      fecha_ultima_factura: string;
    }>();

    const convertToISODate = (facturaScriptsDate: string): string => {
      if (!facturaScriptsDate || facturaScriptsDate.trim() === '') return '';

      const ddmmyyyyMatch = facturaScriptsDate.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
      if (ddmmyyyyMatch) {
        const [, day, month, year] = ddmmyyyyMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      return facturaScriptsDate;
    };

    allInvoicesResult.data.forEach(invoice => {
      const codcliente = invoice.codcliente;
      if (!codcliente) return;

      if (!clienteHistorico.has(codcliente)) {
        clienteHistorico.set(codcliente, {
          facturas: [],
          total_facturas: 0,
          total_facturado: 0,
          fecha_ultima_factura: invoice.fecha || ''
        });
      }

      const clienteData = clienteHistorico.get(codcliente)!;
      clienteData.facturas.push(invoice);
      clienteData.total_facturas += 1;
      clienteData.total_facturado += invoice.total || 0;

      // Update fecha_ultima_factura if this invoice is more recent
      if (invoice.fecha && invoice.fecha !== '') {
        const currentInvoiceISO = convertToISODate(invoice.fecha);
        const lastInvoiceISO = convertToISODate(clienteData.fecha_ultima_factura);

        if (currentInvoiceISO > lastInvoiceISO) {
          clienteData.fecha_ultima_factura = invoice.fecha;
        }
      }
    });

    // Step 3: Filter clients who are "lost" (no invoices since fecha_desde)
    const clientesPerdidos: ClientePerdido[] = [];

    for (const [codcliente, historico] of clienteHistorico.entries()) {
      // Check if client has any invoices from fecha_desde onwards
      const facturasRecientes = historico.facturas.filter(invoice => {
        if (!invoice.fecha || invoice.fecha.trim() === '') return false;

        const invoiceISO = convertToISODate(invoice.fecha);
        return invoiceISO >= fecha_desde;
      });

      // Client is "lost" if:
      // 1. They have historical invoices (exclude clients who never bought)
      // 2. They have NO invoices since fecha_desde
      if (historico.total_facturas > 0 && facturasRecientes.length === 0) {
        try {
          // Get client details
          const clientFilter = `codcliente:${codcliente}`;
          const clientParams = new URLSearchParams();
          clientParams.append('limit', '1');
          clientParams.append('offset', '0');
          clientParams.append('filter', clientFilter);

          const clientUri = `facturascripts://clientes?${clientParams.toString()}`;
          const { additionalParams: clientAdditionalParams } = parseUrlParameters(clientUri);

          const clientResult = await client.getWithPagination<any>(
            '/clientes',
            1,
            0,
            clientAdditionalParams
          );

          if (clientResult.data && clientResult.data.length > 0) {
            const cliente = clientResult.data[0];
            clientesPerdidos.push({
              codcliente,
              nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
              email: cliente.email || null,
              telefono1: cliente.telefono1 || null,
              fecha_ultima_factura: historico.fecha_ultima_factura,
              total_facturas_historicas: historico.total_facturas,
              total_facturado_historico: historico.total_facturado
            });
          }
        } catch (error) {
          // If client lookup fails, still include with minimal data
          clientesPerdidos.push({
            codcliente,
            nombre: 'Error al obtener datos del cliente',
            email: null,
            telefono1: null,
            fecha_ultima_factura: historico.fecha_ultima_factura,
            total_facturas_historicas: historico.total_facturas,
            total_facturado_historico: historico.total_facturado
          });
        }
      }
    }

    // Step 4: Sort by fecha_ultima_factura descending (most recent lost clients first)
    clientesPerdidos.sort((a, b) => {
      if (a.fecha_ultima_factura && b.fecha_ultima_factura) {
        const aISO = convertToISODate(a.fecha_ultima_factura);
        const bISO = convertToISODate(b.fecha_ultima_factura);
        return bISO.localeCompare(aISO);
      }
      return 0;
    });

    // Step 5: Apply pagination
    const totalClientes = clientesPerdidos.length;
    const paginatedClientes = clientesPerdidos.slice(offset, offset + limit);
    const hasMore = offset + limit < totalClientes;

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            fecha_corte: fecha_desde,
            meta: {
              total: totalClientes,
              limit,
              offset,
              hasMore,
            },
            data: paginatedClientes,
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Failed to fetch clientes perdidos',
            message: errorMessage,
            fecha_corte: fecha_desde,
            meta: {
              total: 0,
              limit,
              offset,
              hasMore: false,
            },
            data: [],
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}