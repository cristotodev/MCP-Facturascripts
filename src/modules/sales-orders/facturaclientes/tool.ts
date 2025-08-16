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
              periodo: { fecha_desde, fecha_hasta },
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