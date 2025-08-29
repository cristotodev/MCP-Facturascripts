export { FacturaclientesResource, type FacturaCliente } from './resource.js';
export { 
  toolDefinition as facturaclientesToolDefinition, 
  toolImplementation as facturaclientesToolImplementation,
  toolByCifnifDefinition as facturaclientesByCifnifToolDefinition,
  toolByCifnifImplementation as facturaclientesByCifnifToolImplementation,
  toolClientesMorososDefinition as facturaclientesMorososToolDefinition,
  toolClientesMorososImplementation as facturaclientesMorososToolImplementation,
  toolClientesTopFacturacionDefinition as facturaclientesTopFacturacionToolDefinition,
  toolClientesTopFacturacionImplementation as facturaclientesTopFacturacionToolImplementation,
  toolClientesPerdidosDefinition as facturaclientesPerdidosToolDefinition,
  toolClientesPerdidosImplementation as facturaclientesPerdidosToolImplementation
} from './tool.js';
export {
  toolTiempoBeneficiosDefinition as facturaclientesTiempoBeneficiosToolDefinition,
  toolTiempoBeneficiosImplementation as facturaclientesTiempoBeneficiosToolImplementation
} from './tool-tiempo-beneficios.js';
export {
  toolTiempoBeneficiosBulkDefinition as facturaclientesTiempoBeneficiosBulkToolDefinition,
  toolTiempoBeneficiosBulkImplementation as facturaclientesTiempoBeneficiosBulkToolImplementation
} from './tool-tiempo-beneficios-bulk.js';