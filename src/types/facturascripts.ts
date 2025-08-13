// TypeScript types generated from FacturaScripts OpenAPI specification

// Common pagination parameters for all endpoints
export interface PaginationParams {
  offset?: number;
  limit?: number;
  filter?: string;
  order?: string;
}

// ConceptoPartida (Accounting Entry Concepts) entity
export interface ConceptoPartida {
  codconcepto: string;
  descripcion?: string;
}

// Contacto (Contact) entity
export interface Contacto {
  aceptaprivacidad?: number;
  admitemarketing?: number;
  apellidos?: string;
  apartado?: string;
  cargo?: string;
  cifnif?: string;
  ciudad?: string;
  codagente?: string;
  codcliente?: string;
  codpais?: string;
  codpostal?: string;
  codproveedor?: string;
  descripcion?: string;
  direccion?: string;
  email?: string;
  empresa?: string;
  fechaalta?: string;
  idcontacto: number;
  langcode?: string;
  nombre: string;
  observaciones?: string;
  personafisica?: number;
  provincia?: string;
  telefono1?: string;
  telefono2?: string;
  tipoidfiscal?: string;
  verificado?: number;
  web?: string;
}

// CronJob (Scheduled Jobs) entity
export interface CronJob {
  date?: string;
  done?: number;
  duration?: number;
  enabled?: number;
  failed?: number;
  id: number;
  jobname: string;
  pluginname?: string;
}

// Cuenta (Accounting Account) entity
export interface Cuenta {
  codcuenta: string;
  codcuentaesp?: string;
  codejercicio?: string;
  debe?: number;
  descripcion?: string;
  haber?: number;
  idcuenta: number;
  parent_codcuenta?: string;
  parent_idcuenta?: number;
  saldo?: number;
}

// CuentaBanco (Bank Account) entity
export interface CuentaBanco {
  activa?: number;
  codcuenta?: string;
  codsubcuenta?: string;
  codsubcuentagasto?: string;
  descripcion?: string;
  iban?: string;
  idempresa?: number;
  sufijosepa?: string;
  swift?: string;
}

// CuentaBancoCliente (Client Bank Account) entity
export interface CuentaBancoCliente {
  codcliente?: string;
  codcuenta?: string;
  descripcion?: string;
  fmandato?: string;
  iban?: string;
  mandato?: string;
  principal?: number;
  swift?: string;
}

// CuentaBancoProveedor (Supplier Bank Account) entity
export interface CuentaBancoProveedor {
  codcuenta?: string;
  codproveedor?: string;
  descripcion?: string;
  iban?: string;
  swift?: string;
  principal?: number;
}

// CuentaEspecial (Special Account) entity
export interface CuentaEspecial {
  codcuentaesp: string;
  descripcion?: string;
}

// Diario (Accounting Journal) entity
export interface Diario {
  descripcion?: string;
  iddiario: number;
}

// Divisa (Currency) entity
export interface Divisa {
  coddivisa: string;
  codiso?: string;
  descripcion?: string;
  simbolo?: string;
  tasaconv?: number;
  tasaconvcompra?: number;
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

// API Access entity
export interface ApiAccess {
  allowdelete: number;
  allowget: number;
  allowpost: number;
  allowput: number;
  id: number;
  idapikey: number;
  resource: string;
}

// API Key entity
export interface ApiKey {
  apikey: string;
  creationdate: string;
  description: string;
  enabled: number;
  fullaccess: number;
  id: number;
  nick: string;
}

// Accounting Entry (Asiento) entity
export interface Asiento {
  canal: number;
  codejercicio: string;
  concepto: string;
  documento: string;
  editable: number;
  fecha: string;
  idasiento: number;
  iddiario: number;
  idempresa: number;
  importe: number;
  numero: number;
  operacion: string;
}

// Attribute (Atributo) entity
export interface Atributo {
  codatributo: string;
  nombre: string;
  num_selector: number;
}

// Attribute Value (AtributoValor) entity
export interface AtributoValor {
  codatributo: string;
  descripcion: string;
  id: number;
  valor: string;
  orden: number;
}

// Attached File (AttachedFile) entity
export interface AttachedFile {
  date: string;
  filename: string;
  hour: string;
  idfile: number;
  mimetype: string;
  path: string;
  size: number;
}

// Attached File Relation (AttachedFileRelation) entity
export interface AttachedFileRelation {
  creationdate: string;
  id: number;
  idfile: number;
  model: string;
  modelid: number;
  modelcode: string;
  nick: string;
  observations: string;
}

// City (Ciudad) entity
export interface Ciudad {
  alias: string;
  ciudad: string;
  creation_date: string;
  codeid: string;
  idciudad: number;
  idprovincia: number;
  last_nick: string;
  last_update: string;
  latitude: number;
  longitude: number;
  nick: string;
}

// Client (Cliente) entity
export interface Cliente {
  cifnif: string;
  codagente: string;
  codcliente: string;
  codgrupo: string;
  codpago: string;
  codproveedor: string;
  codretencion: string;
  codserie: string;
  codsubcuenta: string;
  codtarifa: string;
  debaja: number;
  diaspago: string;
  excepcioniva: string;
  email: string;
  fax: string;
  fechabaja: string;
  fechaalta: string;
  idcontactofact: number;
  idcontactoenv: number;
  langcode: string;
  nombre: string;
  observaciones: string;
  personafisica: number;
  razonsocial: string;
  regimeniva: string;
  riesgoalcanzado: number;
  riesgomax: number;
  telefono1: string;
  telefono2: string;
  tipoidfiscal: string;
  web: string;
}

// Postal Code (CodigoPostal) entity
export interface CodigoPostal {
  codpais: string;
  creation_date: string;
  id: number;
  idciudad: number;
  idprovincia: number;
  last_nick: string;
  last_update: string;
  nick: string;
  number: number;
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