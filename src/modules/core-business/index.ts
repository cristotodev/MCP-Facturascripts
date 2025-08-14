// Resources
export { ClientesResource } from './clientes/index.js';
export { ProductosResource } from './productos/index.js';
export { ProveedoresResource } from './proveedores/index.js';
export { StocksResource } from './stocks/index.js';

// Tool definitions
export { 
  clientesToolDefinition,
  clientesToolImplementation,
} from './clientes/index.js';

export { 
  productosToolDefinition,
  productosToolImplementation,
} from './productos/index.js';

export { 
  proveedoresToolDefinition,
  proveedoresToolImplementation,
} from './proveedores/index.js';

export { 
  stocksToolDefinition,
  stocksToolImplementation,
} from './stocks/index.js';

// Import all for consolidated exports
import { 
  clientesToolDefinition,
  clientesToolImplementation,
} from './clientes/index.js';

import { 
  productosToolDefinition,
  productosToolImplementation,
} from './productos/index.js';

import { 
  proveedoresToolDefinition,
  proveedoresToolImplementation,
} from './proveedores/index.js';

import { 
  stocksToolDefinition,
  stocksToolImplementation,
} from './stocks/index.js';

// Consolidated exports for easier usage
export const coreBusinessToolDefinitions = [
  clientesToolDefinition,
  productosToolDefinition,
  proveedoresToolDefinition,
  stocksToolDefinition,
];

export const coreBusinessToolImplementations = {
  get_clientes: clientesToolImplementation,
  get_productos: productosToolImplementation,
  get_proveedores: proveedoresToolImplementation,
  get_stocks: stocksToolImplementation,
};