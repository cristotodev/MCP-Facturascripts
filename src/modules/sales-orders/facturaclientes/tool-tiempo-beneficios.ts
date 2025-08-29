import { FacturaScriptsClient } from '../../../fs/client.js';
import { parseUrlParameters } from '../../../utils/filterParser.js';
import type { FacturaCliente } from './resource.js';

// Tool definition for time to benefits analysis
export const toolTiempoBeneficiosDefinition = {
  name: 'get_tiempo_beneficios_cliente',
  description: 'Calcula el tiempo que tarda un cliente en generar beneficios desde su alta hasta el primer y último pago de facturas. Realiza análisis en tres pasos: 1) Busca datos del cliente por código, 2) Obtiene facturas del cliente, 3) Consulta recibos/pagos asociados. Calcula días desde fecha alta hasta primer y último pago, totales facturados y pagados. Útil para análisis de retorno de inversión en clientes, gestión de tesorería y estrategias de cobranza.',
  inputSchema: {
    type: 'object',
    properties: {
      codcliente: { type: 'string', description: 'Código del cliente para analizar (requerido)' }
    },
    required: ['codcliente']
  }
};

interface TiempoBeneficios {
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

export async function toolTiempoBeneficiosImplementation(
  args: { codcliente?: string },
  client: FacturaScriptsClient
) {
  const { codcliente } = args;

  // Parameter validation
  if (!codcliente || codcliente.trim() === '') {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            error: 'Parameter validation failed',
            message: 'El parámetro codcliente es requerido y no puede estar vacío'
          }, null, 2)
        }
      ],
      isError: true
    };
  }

  try {
    // Step 1: Get client data
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

    if (!clientResult.data || clientResult.data.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Client not found',
              message: `No se encontró ningún cliente con código: ${codcliente}`
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    const cliente = clientResult.data[0];
    const fechaAlta = cliente.fechaalta;

    if (!fechaAlta || fechaAlta.trim() === '') {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: 'Invalid client data',
              message: `El cliente ${codcliente} no tiene fecha de alta válida`
            }, null, 2)
          }
        ],
        isError: true
      };
    }

    // Step 2: Get all invoices for the client
    const invoiceFilter = `codcliente:${codcliente}`;
    const invoiceParams = new URLSearchParams();
    invoiceParams.append('limit', '1000');
    invoiceParams.append('offset', '0');
    invoiceParams.append('filter', invoiceFilter);

    const invoiceUri = `facturascripts://facturaclientes?${invoiceParams.toString()}`;
    const { additionalParams: invoiceAdditionalParams } = parseUrlParameters(invoiceUri);

    const invoiceResult = await client.getWithPagination<FacturaCliente>(
      '/facturaclientes',
      1000,
      0,
      invoiceAdditionalParams
    );

    let totalFacturado = 0;
    const facturaIds: number[] = [];

    if (invoiceResult.data && invoiceResult.data.length > 0) {
      invoiceResult.data.forEach(invoice => {
        totalFacturado += invoice.total || 0;
        if (invoice.idfactura) {
          facturaIds.push(invoice.idfactura);
        }
      });
    }

    // Step 3: Get payment data (recibos) for all invoices
    const recibos: Array<{ fechapago: string; importe: number }> = [];

    for (const idfactura of facturaIds) {
      try {
        const reciboFilter = `idfactura:${idfactura}`;
        const reciboParams = new URLSearchParams();
        reciboParams.append('limit', '100');
        reciboParams.append('offset', '0');
        reciboParams.append('filter', reciboFilter);

        // Note: The endpoint might be reciboclientes, need to check available resources
        // For now, using a generic approach that might need adjustment
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

    // Step 4: Calculate time metrics
    let tiempoHastaPrimerPago: number | null = null;
    let tiempoHastaUltimoPago: number | null = null;
    let fechaPrimerPago: string | null = null;
    let fechaUltimoPago: string | null = null;
    let totalPagado = 0;

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

      // Calculate days from client registration to first and last payment
      const fechaAltaISO = convertToISODate(fechaAlta);
      const fechaPrimerPagoISO = convertToISODate(fechaPrimerPago);
      const fechaUltimoPagoISO = convertToISODate(fechaUltimoPago);

      if (fechaAltaISO && fechaPrimerPagoISO) {
        tiempoHastaPrimerPago = calculateDaysDifference(fechaAltaISO, fechaPrimerPagoISO);
      }
      if (fechaAltaISO && fechaUltimoPagoISO) {
        tiempoHastaUltimoPago = calculateDaysDifference(fechaAltaISO, fechaUltimoPagoISO);
      }
    }

    const pendientePago = totalFacturado - totalPagado;

    const resultado: TiempoBeneficios = {
      codcliente,
      nombre: cliente.nombre || cliente.razonsocial || 'Sin nombre',
      fecha_alta: fechaAlta,
      tiempo_hasta_primer_pago_dias: tiempoHastaPrimerPago,
      tiempo_hasta_ultimo_pago_dias: tiempoHastaUltimoPago,
      total_facturado: totalFacturado,
      total_pagado: totalPagado,
      pendiente_pago: pendientePago,
      fecha_primer_pago: fechaPrimerPago,
      fecha_ultimo_pago: fechaUltimoPago
    };

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(resultado, null, 2)
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
            error: 'Failed to calculate tiempo beneficios',
            message: errorMessage,
            codcliente
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}