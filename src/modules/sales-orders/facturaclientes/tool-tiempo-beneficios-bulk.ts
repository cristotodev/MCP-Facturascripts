import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';
import type { FacturaCliente } from './resource.js';

// Tool definition for bulk time to benefits analysis
export const toolTiempoBeneficiosBulkDefinition = {
  name: 'get_tiempo_beneficios_todos_clientes',
  description: `Calcula el tiempo hasta beneficios para todos los clientes en un análisis bulk. Devuelve el detalle individual de cada cliente y un informe estadístico completo con medias, medianas, totales y distribuciones. Realiza procesamiento eficiente en lote para análisis masivos de rentabilidad de clientes. Útil para obtener insights generales de la cartera de clientes, identificar patrones de pago y optimizar estrategias de cobranza.

IMPORTANTE PAGINACIÓN:
- Cuando incluir_sin_facturas=false: MÁXIMO 50 clientes por petición (optimización anti-timeout)
- Cuando incluir_sin_facturas=true: MÁXIMO 100 clientes por petición (optimización anti-rate-limit)
- Para analizar TODOS los clientes: usar paginación con offset hasta que hasMore=false
- Ejemplo paginación completa:
  1. Llamada 1: limit=50, offset=0, hasMore=true → procesa clientes 0-49
  2. Llamada 2: limit=50, offset=50, hasMore=true → procesa clientes 50-99  
  3. Llamada 3: limit=50, offset=100, hasMore=false → procesa clientes 100-120, FIN

FORMATO DE RESPUESTA:
{
  "meta": {
    "total_clientes_disponibles": number, // SIEMPRE el total de clientes en BD (NO afectado por incluir_sin_facturas)
    "limit": number,                      // Límite de paginación aplicado (máx 50 si incluir_sin_facturas=false)
    "offset": number,                     // Offset de paginación aplicado
    "hasMore": boolean,                   // Si hay más páginas disponibles (usar para paginación completa)
    "fecha_analisis": string              // Timestamp ISO del análisis
  },
  "resumen_estadisticas": {
    "total_clientes_analizados": number,  // Clientes realmente incluidos en análisis (SÍ afectado por incluir_sin_facturas)
    "clientes_con_pagos": number,         // Clientes que tienen al menos un pago registrado
    "clientes_sin_pagos": number,         // Clientes sin pagos (pero pueden tener facturas)
    "clientes_sin_facturas": number,      // Clientes sin facturas (será 0 si incluir_sin_facturas=false)
    "media_dias_primer_pago": number,     // Promedio de días desde alta hasta primer pago
    "mediana_dias_primer_pago": number,   // Mediana de días hasta primer pago
    "min_dias_primer_pago": number,       // Mínimo días hasta primer pago
    "max_dias_primer_pago": number,       // Máximo días hasta primer pago
    "media_dias_ultimo_pago": number,     // Promedio días desde alta hasta último pago
    "total_facturado_general": number,    // Suma total facturado de todos los clientes analizados
    "total_pagado_general": number,       // Suma total pagado de todos los clientes analizados
    "total_pendiente_general": number,    // Diferencia entre facturado y pagado
    "porcentaje_clientes_con_pagos": number, // Porcentaje de clientes que han pagado algo
    "porcentaje_cobranza_general": number,   // Porcentaje de cobranza sobre facturado
    "distribucion_tiempo_pago": {
      "rapidos_1_7_dias": number,       // Clientes que pagan en 1-7 días
      "normales_8_30_dias": number,     // Clientes que pagan en 8-30 días
      "lentos_31_90_dias": number,      // Clientes que pagan en 31-90 días
      "muy_lentos_mas_90_dias": number  // Clientes que tardan más de 90 días
    }
  },
  "detalle_clientes": [                   // Array con detalle individual de cada cliente analizado
    {
      "codcliente": string,             // Código único del cliente
      "nombre": string,                 // Nombre o razón social
      "fecha_alta": string,             // Fecha de alta del cliente (DD-MM-YYYY)
      "tiempo_hasta_primer_pago_dias": number, // Días desde alta hasta primer pago (null si no ha pagado)
      "tiempo_hasta_ultimo_pago_dias": number, // Días desde alta hasta último pago (null si no ha pagado)
      "total_facturado": number,        // Total facturado a este cliente
      "total_pagado": number,           // Total pagado por este cliente
      "pendiente_pago": number,         // Diferencia entre facturado y pagado
      "fecha_primer_pago": string,      // Fecha del primer pago (DD-MM-YYYY, null si no ha pagado)
      "fecha_ultimo_pago": string,      // Fecha del último pago (DD-MM-YYYY, null si no ha pagado)
      "numero_facturas": number,        // Cantidad de facturas emitidas
      "numero_pagos": number            // Cantidad de pagos recibidos
    }
  ]
}

IMPORTANTE: Para verificar el efecto de 'incluir_sin_facturas', compara 'total_clientes_analizados' y el tamaño del array 'detalle_clientes', NO 'total_clientes_disponibles' que siempre es igual.

EJEMPLO USO COMPLETO (procesar todos los clientes):
Paso 1: limit=50, offset=0, incluir_sin_facturas=false → hasMore=true, continúa
Paso 2: limit=50, offset=50, incluir_sin_facturas=false → hasMore=true, continúa  
Paso 3: limit=50, offset=100, incluir_sin_facturas=false → hasMore=false, FIN

NOTA: Con incluir_sin_facturas=true, usar límites de hasta 100 por petición.`,
  inputSchema: {
    type: 'object',
    properties: {
      limit: { 
        type: 'number', 
        description: 'Número máximo de clientes a procesar por petición. LÍMITES: incluir_sin_facturas=true máx.100, incluir_sin_facturas=false máx.50. Para procesar TODOS los clientes usar paginación con offset hasta hasMore=false.', 
        minimum: 1, 
        maximum: 500, 
        default: 100 
      },
      offset: { 
        type: 'number', 
        description: 'Número de clientes a omitir para paginación. Para procesar todos los clientes: comenzar con 0, incrementar en limit hasta que hasMore=false en la respuesta.', 
        minimum: 0, 
        default: 0 
      },
      incluir_sin_facturas: { 
        type: 'boolean', 
        description: 'Si incluir clientes sin facturas en el análisis. false=solo clientes con facturas (recomendado para análisis de rentabilidad), true=incluye todos los clientes. IMPORTANTE: Afecta "total_clientes_analizados" y tamaño de "detalle_clientes", pero NO afecta "total_clientes_disponibles" que siempre es igual.', 
        default: false 
      }
    }
  }
};

interface TiempoBeneficiosDetalle {
  codcliente: string;
  nombre: string;
  fecha_alta: string;
  tiempo_hasta_primer_pago_dias: number | null;
  tiempo_hasta_ultimo_pago_dias: number | null;
  total_facturado: number;
  total_pagado: number;
  pendiente_pago: number;
  fecha_primer_pago: string | null;
  fecha_ultimo_pago: string | null;
  numero_facturas: number;
  numero_pagos: number;
}

interface ResumenEstadisticas {
  total_clientes_analizados: number; // Total de clientes incluidos en el análisis (afectado por incluir_sin_facturas)
  clientes_con_pagos: number;
  clientes_sin_pagos: number;
  clientes_sin_facturas: number;
  media_dias_primer_pago: number | null;
  mediana_dias_primer_pago: number | null;
  min_dias_primer_pago: number | null;
  max_dias_primer_pago: number | null;
  media_dias_ultimo_pago: number | null;
  total_facturado_general: number;
  total_pagado_general: number;
  total_pendiente_general: number;
  porcentaje_clientes_con_pagos: number;
  porcentaje_cobranza_general: number;
  distribucion_tiempo_pago: {
    rapidos_1_7_dias: number;
    normales_8_30_dias: number;
    lentos_31_90_dias: number;
    muy_lentos_mas_90_dias: number;
  };
}

interface TiempoBeneficiosBulkResponse {
  meta: {
    total_clientes_disponibles: number; // Total de clientes en BD (independiente de incluir_sin_facturas)
    limit: number;
    offset: number;
    hasMore: boolean;
    fecha_analisis: string;
  };
  resumen_estadisticas: ResumenEstadisticas;
  detalle_clientes: TiempoBeneficiosDetalle[];
}

const convertToISODate = (facturaScriptsDate: string): string => {
  if (!facturaScriptsDate || facturaScriptsDate.trim() === '') return '';

  const ddmmyyyyMatch = facturaScriptsDate.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return facturaScriptsDate;
};

const calculateDaysDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateMedian = (numbers: number[]): number | null => {
  if (numbers.length === 0) return null;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

export async function toolTiempoBeneficiosBulkImplementation(
  args: { limit?: number; offset?: number; incluir_sin_facturas?: boolean },
  client: FacturaScriptsClient
) {
  const limit = Math.min(Math.max(args.limit || 100, 1), 500); // Cap at 500 for performance
  const offset = Math.max(args.offset || 0, 0);
  const incluirSinFacturas = args.incluir_sin_facturas === true; // Default false - focus on clients with revenue
  
  // Performance optimization: Reduce limits to prevent timeouts and rate limiting
  // - incluir_sin_facturas=false: More API calls per client, limit to 50 (anti-timeout)
  // - incluir_sin_facturas=true: Still many API calls (invoices + recibos), limit to 100 (anti-rate-limit)
  // DOCUMENTED BEHAVIOR: MAX 50 clients when incluir_sin_facturas=false, MAX 100 when true
  const effectiveLimit = !incluirSinFacturas ? Math.min(limit, 50) : Math.min(limit, 100);

  try {
    // Step 1: Get all clients with pagination (using effective limit for performance)
    const clientResult = await client.getWithPagination<any>(
      '/clientes',
      effectiveLimit,
      offset,
      {}
    );

    if (!clientResult.data || clientResult.data.length === 0) {
      const emptyResponse: TiempoBeneficiosBulkResponse = {
        meta: {
          total_clientes_disponibles: 0,
          limit: effectiveLimit,
          offset,
          hasMore: false,
          fecha_analisis: new Date().toISOString()
        },
        resumen_estadisticas: {
          total_clientes_analizados: 0,
          clientes_con_pagos: 0,
          clientes_sin_pagos: 0,
          clientes_sin_facturas: 0,
          media_dias_primer_pago: null,
          mediana_dias_primer_pago: null,
          min_dias_primer_pago: null,
          max_dias_primer_pago: null,
          media_dias_ultimo_pago: null,
          total_facturado_general: 0,
          total_pagado_general: 0,
          total_pendiente_general: 0,
          porcentaje_clientes_con_pagos: 0,
          porcentaje_cobranza_general: 0,
          distribucion_tiempo_pago: {
            rapidos_1_7_dias: 0,
            normales_8_30_dias: 0,
            lentos_31_90_dias: 0,
            muy_lentos_mas_90_dias: 0
          }
        },
        detalle_clientes: []
      };

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(emptyResponse, null, 2)
          }
        ]
      };
    }

    // Step 2: Process each client with optimizations
    const detalleClientes: TiempoBeneficiosDetalle[] = [];
    const tiemposPrimerPago: number[] = [];
    const tiemposUltimoPago: number[] = [];

    // Performance optimization: If we don't want clients without invoices,
    // we should minimize API calls by checking invoices first with minimal limits
    let processedCount = 0;
    const maxProcessingTime = 25000; // 25 seconds max to leave room for MCP timeout
    const startTime = Date.now();
    
    for (const cliente of clientResult.data) {
      // Safety check: prevent timeout
      if (Date.now() - startTime > maxProcessingTime) {
        console.warn(`Stopping processing after ${processedCount} clients due to timeout risk`);
        break;
      }
      processedCount++;
      const codcliente = cliente.codcliente;
      const fechaAlta = cliente.fechaalta;
      
      if (!fechaAlta || fechaAlta.trim() === '') {
        // Skip clients without registration date
        continue;
      }

      try {
        // OPTIMIZATION: First check if client has invoices with minimal limit
        // This reduces API load when incluir_sin_facturas=false
        const invoiceFilter = `codcliente:${codcliente}`;
        const invoiceParams = new URLSearchParams();
        invoiceParams.append('limit', !incluirSinFacturas ? '1' : '1000'); // Only check existence if excluding
        invoiceParams.append('offset', '0');
        invoiceParams.append('filter', invoiceFilter);

        const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
        const { additionalParams: invoiceAdditionalParams } = parseUrlParameters(invoiceUri);

        const invoiceResult = await client.getWithPagination<FacturaCliente>(
          '/facturaclientes',
          !incluirSinFacturas ? 1 : 1000, // Match the limit above
          0,
          invoiceAdditionalParams
        );

        // Early exit optimization: If no invoices and we don't want to include them, skip immediately
        if ((!invoiceResult.data || invoiceResult.data.length === 0) && !incluirSinFacturas) {
          continue;
        }

        // OPTIMIZATION: Only do second invoice call if we filtered with limit=1 initially  
        let fullInvoiceResult = invoiceResult;
        if (!incluirSinFacturas && invoiceResult.data && invoiceResult.data.length > 0) {
          // We need to get all invoices now, not just the first one (only when we used limit=1)
          const fullInvoiceParams = new URLSearchParams();
          fullInvoiceParams.append('limit', '1000');
          fullInvoiceParams.append('offset', '0');
          fullInvoiceParams.append('filter', invoiceFilter);

          const fullInvoiceUri = `facturascripts://facturaclientes?${fullInvoiceParams.toString()}`;
          const { additionalParams: fullInvoiceAdditionalParams } = parseUrlParameters(fullInvoiceUri);

          fullInvoiceResult = await client.getWithPagination<FacturaCliente>(
            '/facturaclientes',
            1000,
            0,
            fullInvoiceAdditionalParams
          );
        }
        // When incluir_sin_facturas=true, fullInvoiceResult is already complete from first call

        let totalFacturado = 0;
        let numeroFacturas = 0;
        const facturaIds: number[] = [];

        if (fullInvoiceResult.data && fullInvoiceResult.data.length > 0) {
          fullInvoiceResult.data.forEach(invoice => {
            totalFacturado += invoice.total || 0;
            numeroFacturas++;
            if (invoice.idfactura) {
              facturaIds.push(invoice.idfactura);
            }
          });
        }

        // Get payments for all invoices
        const recibos: Array<{ fechapago: string; importe: number }> = [];

        for (const idfactura of facturaIds) {
          try {
            const reciboFilter = `idfactura:${idfactura}`;
            const reciboParams = new URLSearchParams();
            reciboParams.append('limit', '100');
            reciboParams.append('offset', '0');
            reciboParams.append('filter', reciboFilter);

            const reciboUri = `facturascripts://reciboclientes?${reciboParams.toString()}`;
            const { additionalParams: reciboAdditionalParams } = parseUrlParameters(reciboUri);

            const reciboResult = await client.getWithPagination<any>(
              '/reciboclientes',
              100,
              0,
              reciboAdditionalParams
            );

            if (reciboResult.data && reciboResult.data.length > 0) {
              reciboResult.data.forEach((recibo: any) => {
                if (recibo.fechapago && recibo.fechapago.trim() !== '' && recibo.importe) {
                  recibos.push({
                    fechapago: recibo.fechapago,
                    importe: recibo.importe
                  });
                }
              });
            }
          } catch (error) {
            // Skip errors in individual recibo lookups
            continue;
          }
        }

        // Calculate time metrics
        let tiempoHastaPrimerPago: number | null = null;
        let tiempoHastaUltimoPago: number | null = null;
        let fechaPrimerPago: string | null = null;
        let fechaUltimoPago: string | null = null;
        let totalPagado = 0;
        const numeroPagos = recibos.length;

        if (recibos.length > 0) {
          // Sort payments by date
          recibos.sort((a, b) => {
            const dateA = convertToISODate(a.fechapago);
            const dateB = convertToISODate(b.fechapago);
            return dateA.localeCompare(dateB);
          });

          fechaPrimerPago = recibos[0].fechapago;
          fechaUltimoPago = recibos[recibos.length - 1].fechapago;
          
          totalPagado = recibos.reduce((sum, recibo) => sum + recibo.importe, 0);

          // Calculate days from client registration to payments
          const fechaAltaISO = convertToISODate(fechaAlta);
          const fechaPrimerPagoISO = convertToISODate(fechaPrimerPago);
          const fechaUltimoPagoISO = convertToISODate(fechaUltimoPago);

          if (fechaAltaISO && fechaPrimerPagoISO) {
            tiempoHastaPrimerPago = calculateDaysDifference(fechaAltaISO, fechaPrimerPagoISO);
            tiemposPrimerPago.push(tiempoHastaPrimerPago);
          }
          if (fechaAltaISO && fechaUltimoPagoISO) {
            tiempoHastaUltimoPago = calculateDaysDifference(fechaAltaISO, fechaUltimoPagoISO);
            tiemposUltimoPago.push(tiempoHastaUltimoPago);
          }
        }

        const pendientePago = totalFacturado - totalPagado;

        const detalle: TiempoBeneficiosDetalle = {
          codcliente,
          nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
          fecha_alta: fechaAlta,
          tiempo_hasta_primer_pago_dias: tiempoHastaPrimerPago,
          tiempo_hasta_ultimo_pago_dias: tiempoHastaUltimoPago,
          total_facturado: totalFacturado,
          total_pagado: totalPagado,
          pendiente_pago: pendientePago,
          fecha_primer_pago: fechaPrimerPago,
          fecha_ultimo_pago: fechaUltimoPago,
          numero_facturas: numeroFacturas,
          numero_pagos: numeroPagos
        };

        detalleClientes.push(detalle);

      } catch (error) {
        // If processing fails for a client, include minimal data
        const detalle: TiempoBeneficiosDetalle = {
          codcliente,
          nombre: 'Error al procesar cliente',
          fecha_alta: fechaAlta,
          tiempo_hasta_primer_pago_dias: null,
          tiempo_hasta_ultimo_pago_dias: null,
          total_facturado: 0,
          total_pagado: 0,
          pendiente_pago: 0,
          fecha_primer_pago: null,
          fecha_ultimo_pago: null,
          numero_facturas: 0,
          numero_pagos: 0
        };

        detalleClientes.push(detalle);
      }
    }

    // Step 3: Calculate comprehensive statistics
    // IMPORTANTE: totalClientesAnalizados es el número de clientes realmente procesados
    // Puede ser menor que total_clientes_disponibles si incluir_sin_facturas = false
    const totalClientesAnalizados = detalleClientes.length;
    const clientesConPagos = detalleClientes.filter(c => c.numero_pagos > 0).length;
    const clientesSinPagos = totalClientesAnalizados - clientesConPagos;
    const clientesSinFacturas = detalleClientes.filter(c => c.numero_facturas === 0).length;

    const totalFacturadoGeneral = detalleClientes.reduce((sum, c) => sum + c.total_facturado, 0);
    const totalPagadoGeneral = detalleClientes.reduce((sum, c) => sum + c.total_pagado, 0);
    const totalPendienteGeneral = totalFacturadoGeneral - totalPagadoGeneral;

    const porcentajeClientesConPagos = totalClientesAnalizados > 0 
      ? Math.round((clientesConPagos / totalClientesAnalizados) * 100 * 100) / 100 
      : 0;
    
    const porcentajeCobranzaGeneral = totalFacturadoGeneral > 0 
      ? Math.round((totalPagadoGeneral / totalFacturadoGeneral) * 100 * 100) / 100 
      : 0;

    // Time statistics
    const mediaDiasPrimerPago = tiemposPrimerPago.length > 0 
      ? Math.round((tiemposPrimerPago.reduce((sum, t) => sum + t, 0) / tiemposPrimerPago.length) * 100) / 100 
      : null;

    const medianaDiasPrimerPago = calculateMedian(tiemposPrimerPago);
    const minDiasPrimerPago = tiemposPrimerPago.length > 0 ? Math.min(...tiemposPrimerPago) : null;
    const maxDiasPrimerPago = tiemposPrimerPago.length > 0 ? Math.max(...tiemposPrimerPago) : null;

    const mediaDiasUltimoPago = tiemposUltimoPago.length > 0 
      ? Math.round((tiemposUltimoPago.reduce((sum, t) => sum + t, 0) / tiemposUltimoPago.length) * 100) / 100 
      : null;

    // Distribution of payment times
    const distribucionTiempoPago = {
      rapidos_1_7_dias: tiemposPrimerPago.filter(t => t <= 7).length,
      normales_8_30_dias: tiemposPrimerPago.filter(t => t > 7 && t <= 30).length,
      lentos_31_90_dias: tiemposPrimerPago.filter(t => t > 30 && t <= 90).length,
      muy_lentos_mas_90_dias: tiemposPrimerPago.filter(t => t > 90).length
    };

    const resumenEstadisticas: ResumenEstadisticas = {
      total_clientes_analizados: totalClientesAnalizados,
      clientes_con_pagos: clientesConPagos,
      clientes_sin_pagos: clientesSinPagos,
      clientes_sin_facturas: clientesSinFacturas,
      media_dias_primer_pago: mediaDiasPrimerPago,
      mediana_dias_primer_pago: medianaDiasPrimerPago,
      min_dias_primer_pago: minDiasPrimerPago,
      max_dias_primer_pago: maxDiasPrimerPago,
      media_dias_ultimo_pago: mediaDiasUltimoPago,
      total_facturado_general: totalFacturadoGeneral,
      total_pagado_general: totalPagadoGeneral,
      total_pendiente_general: totalPendienteGeneral,
      porcentaje_clientes_con_pagos: porcentajeClientesConPagos,
      porcentaje_cobranza_general: porcentajeCobranzaGeneral,
      distribucion_tiempo_pago: distribucionTiempoPago
    };

    // EXPLICACIÓN DE LA RESPUESTA:
    // - total_clientes_disponibles: Siempre el total de clientes en BD (desde clientResult.meta.total)
    // - total_clientes_analizados: Solo los clientes que pasaron el filtro incluir_sin_facturas
    // - detalle_clientes.length: Siempre igual a total_clientes_analizados
    // 
    // Ejemplo: 100 clientes en BD, 30 sin facturas
    // incluir_sin_facturas=true:  disponibles=100, analizados=100, detalle.length=100
    // incluir_sin_facturas=false: disponibles=100, analizados=70,  detalle.length=70
    const response: TiempoBeneficiosBulkResponse = {
      meta: {
        // NUNCA cambia independientemente de incluir_sin_facturas
        total_clientes_disponibles: clientResult.meta?.total || totalClientesAnalizados,
        limit: effectiveLimit,
        offset,
        hasMore: clientResult.meta?.hasMore || false,
        fecha_analisis: new Date().toISOString()
      },
      // SÍ cambia según incluir_sin_facturas
      resumen_estadisticas: resumenEstadisticas,
      // SÍ cambia según incluir_sin_facturas (su length = total_clientes_analizados)
      detalle_clientes: detalleClientes
    };

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(response, null, 2)
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
            error: 'Failed to calculate bulk tiempo beneficios',
            message: errorMessage,
            meta: {
              total_clientes_disponibles: 0,
              limit: effectiveLimit,
              offset,
              hasMore: false,
              fecha_analisis: new Date().toISOString()
            },
            resumen_estadisticas: null,
            detalle_clientes: []
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}