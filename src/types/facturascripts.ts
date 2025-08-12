// TypeScript types generated from FacturaScripts OpenAPI specification

// Common pagination parameters for all endpoints
export interface PaginationParams {
  offset?: number;
  limit?: number;
  filter?: string;
  order?: string;
}

// Supplier (Proveedor) entity
export interface Proveedor {
  codproveedor: string;
  nombre: string;
  razonsocial?: string;
  cifnif?: string;
  telefono1?: string;
  telefono2?: string;
  fax?: string;
  email?: string;
  web?: string;
  codpago?: string;
  diasvencimiento?: number;
  activo?: boolean;
  fechaalta?: string;
  observaciones?: string;
  regimeniva?: string;
  tipoidfiscal?: string;
}

// Supplier Invoice (FacturaProveedor) entity
export interface FacturaProveedor {
  idfactura: number;
  codigo: string;
  numproveedor?: string;
  codproveedor: string;
  nombre: string;
  cifnif?: string;
  fecha: string;
  hora?: string;
  codalmacen?: string;
  coddivisa?: string;
  tasaconv?: number;
  codpago?: string;
  total: number;
  totaliva: number;
  totalirpf?: number;
  totalrecargo?: number;
  neto: number;
  observaciones?: string;
  fechavencimiento?: string;
  pagada?: boolean;
  anulada?: boolean;
  editable?: boolean;
}

// Stock entity
export interface Stock {
  idstock: number;
  referencia: string;
  codalmacen: string;
  descripcion?: string;
  cantidad: number;
  reservada?: number;
  disponible?: number;
  pterecibir?: number;
  stockmin?: number;
  stockmax?: number;
  ubicacion?: string;
}

// Delivery Note (AlbaranCliente) entity
export interface AlbaranCliente {
  idalbaran: number;
  codigo: string;
  numero?: string;
  codcliente: string;
  nombrecliente: string;
  cifnif?: string;
  fecha: string;
  hora?: string;
  codalmacen?: string;
  coddivisa?: string;
  tasaconv?: number;
  codtrans?: string;
  codpago?: string;
  total: number;
  totaliva: number;
  totalirpf?: number;
  totalrecargo?: number;
  neto: number;
  observaciones?: string;
  servido?: boolean;
  editable?: boolean;
}

// Supplier Delivery Note (AlbaranProveedor) entity
export interface AlbaranProveedor {
  idalbaran: number;
  codigo: string;
  numproveedor?: string;
  codproveedor: string;
  nombre: string;
  cifnif?: string;
  fecha: string;
  hora?: string;
  codalmacen?: string;
  coddivisa?: string;
  tasaconv?: number;
  codpago?: string;
  total: number;
  totaliva: number;
  totalirpf?: number;
  totalrecargo?: number;
  neto: number;
  observaciones?: string;
  servido?: boolean;
  editable?: boolean;
}

// Supplier Order (PedidoProveedor) entity
export interface PedidoProveedor {
  idpedido: number;
  codigo: string;
  numproveedor?: string;
  codproveedor: string;
  nombre: string;
  cifnif?: string;
  fecha: string;
  hora?: string;
  codalmacen?: string;
  coddivisa?: string;
  tasaconv?: number;
  codpago?: string;
  total: number;
  totaliva: number;
  totalirpf?: number;
  totalrecargo?: number;
  neto: number;
  observaciones?: string;
  fechasalida?: string;
  servido?: boolean;
  editable?: boolean;
}

// Supplier Quote (PresupuestoProveedor) entity
export interface PresupuestoProveedor {
  idpresupuesto: number;
  codigo: string;
  numproveedor?: string;
  codproveedor: string;
  nombre: string;
  cifnif?: string;
  fecha: string;
  hora?: string;
  codalmacen?: string;
  coddivisa?: string;
  tasaconv?: number;
  codpago?: string;
  total: number;
  totaliva: number;
  totalirpf?: number;
  totalrecargo?: number;
  neto: number;
  observaciones?: string;
  finoferta?: string;
  editable?: boolean;
}

// Contact (Contacto) entity
export interface Contacto {
  idcontacto: number;
  codcliente?: string;
  codproveedor?: string;
  email?: string;
  telefono1?: string;
  telefono2?: string;
  fax?: string;
  cargo?: string;
  nombre: string;
  apellidos?: string;
  descripcion?: string;
  fechaalta?: string;
  activo?: boolean;
  admitemarketing?: boolean;
  puntuacion?: number;
  observaciones?: string;
}

// Sales Agent (Agente) entity
export interface Agente {
  codagente: string;
  nombre: string;
  apellidos?: string;
  dnicif?: string;
  telefono?: string;
  email?: string;
  f_alta?: string;
  f_baja?: string;
  observaciones?: string;
  porcomision?: number;
  cargo?: string;
}

// Customer Group (GrupoClientes) entity
export interface GrupoClientes {
  codgrupo: string;
  nombre: string;
  observaciones?: string;
}

// Product Family (Familia) entity
export interface Familia {
  codfamilia: string;
  descripcion: string;
  madre?: string;
  observaciones?: string;
}

// Manufacturer (Fabricante) entity
export interface Fabricante {
  codfabricante: string;
  nombre: string;
  telefono?: string;
  fax?: string;
  email?: string;
  web?: string;
  observaciones?: string;
}

// Warehouse (Almacen) entity
export interface Almacen {
  codalmacen: string;
  nombre: string;
  direccion?: string;
  codpostal?: string;
  poblacion?: string;
  provincia?: string;
  codpais?: string;
  telefono?: string;
  fax?: string;
  contacto?: string;
  observaciones?: string;
}

// Standard response format for paginated data
export interface PaginatedResponse<T> {
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  data: T[];
}