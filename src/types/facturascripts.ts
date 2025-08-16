// TypeScript types generated from FacturaScripts OpenAPI specification

// EstadoDocumento (Document Status) entity
export interface EstadoDocumento {
  activo?: number;
  actualizastock?: number;
  bloquear?: number;
  color?: string;
  editable?: number;
  generadoc?: string;
  icon?: string;
  idestado?: number;
  nombre?: string;
  predeterminado?: number;
  tipodoc?: string;
}

// DocTransformation (Document Transformations) entity
export interface DocTransformation {
  cantidad?: number;
  id?: number;
  iddoc1?: number;
  iddoc2?: number;
  idlinea1?: number;
  idlinea2?: number;
  model1?: string;
  model2?: string;
}

// Ejercicio (Fiscal Year) entity  
export interface Ejercicio {
  codejercicio?: string;
  estado?: string;
  fechafin?: string;
  fechainicio?: string;
  idempresa?: number;
  longsubcuenta?: number;
  nombre?: string;
}

// EmailNotification (Email Notifications) entity
export interface EmailNotification {
  body?: string;
  creationdate?: string;
  enabled?: number;
  name?: string;
  subject?: string;
}

// EmailSent (Sent Emails) entity
export interface EmailSent {
  addressee?: string;
  attachment?: number;
  body?: string;
  date?: string;
  email_from?: string;
  html?: string;
  id?: number;
  nick?: string;
  opened?: number;
  subject?: string;
  uuid?: string;
  verificode?: string;
}

// Empresa (Company) entity
export interface Empresa {
  administrador?: string;
  apartado?: string;
  cifnif?: string;
  ciudad?: string;
  codpais?: string;
  codpostal?: string;
  direccion?: string;
  excepcioniva?: string;
  email?: string;
  fax?: string;
  fechaalta?: string;
  idempresa?: number;
  idlogo?: number;
  nombre?: string;
  nombrecorto?: string;
  observaciones?: string;
  personafisica?: number;
  provincia?: string;
  regimeniva?: string;
  telefono1?: string;
  telefono2?: string;
  tipoidfiscal?: string;
  web?: string;
}

// Common pagination parameters for all endpoints
// Basic pagination and legacy filtering parameters
export interface PaginationParams {
  offset?: number;
  limit?: number;
  // Legacy simple format (maintained for backward compatibility)
  filter?: string;
  order?: string;
}

// Advanced FacturaScripts API parameters interface
export interface FacturaScriptsApiParams extends PaginationParams {
  // Dynamic filter parameters: filter[field] and filter[field_operator]
  [key: `filter_${string}`]: string | undefined;
  // Dynamic operation parameters for OR logic: operation[field]
  [key: `operation_${string}`]: 'OR' | undefined;
  // Dynamic sort parameters: sort[field]
  [key: `sort_${string}`]: 'ASC' | 'DESC' | undefined;
}

// Supported filter operators for FacturaScripts API
export type FilterOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'neq' | 'like';

// Helper type for building filter parameter keys
export type FilterParamKey<T extends string, O extends FilterOperator | '' = ''> = 
  O extends '' ? `filter_${T}` : `filter_${T}_${O}`;

// Helper type for building operation parameter keys  
export type OperationParamKey<T extends string> = `operation_${T}`;

// Helper type for building sort parameter keys
export type SortParamKey<T extends string> = `sort_${T}`;

// ConceptoPartida (Accounting Entry Concepts) entity
export interface ConceptoPartida {
  codconcepto: string;
  descripcion?: string;
}

// Partida (Accounting Entry Line) entity
export interface Partida {
  idpartida: number;
  idasiento: number;
  codsubcuenta?: string;
  idsubcuenta?: number;
  concepto?: string;
  debe?: number;
  haber?: number;
  baseimponible?: number;
  iva?: number;
  recargo?: number;
  saldo?: number;
  coddivisa?: string;
  tasaconv?: number;
  cifnif?: string;
  documento?: string;
  factura?: string;
  punteada?: number;
  orden?: number;
  codcontrapartida?: string;
  idcontrapartida?: number;
  codserie?: string;
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
  referencia?: string;
  codalmacen?: string;
  descripcion?: string;
  cantidad?: number;
  reservada?: number;
  disponible?: number;
  pterecibir?: number;
  stockmin?: number;
  stockmax?: number;
  ubicacion?: string;
  idproducto?: number;
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
  codsubcuenta?: string;
  codtarifa?: string;
  nombre: string;
}

// Product (Producto) entity
export interface Producto {
  idproducto: number;
  referencia?: string;
  descripcion?: string;
  precio?: number;
  codfamilia?: string;
  codfabricante?: string;
  codimpuesto?: string;
  stockfis?: number;
  nostock?: number;
  secompra?: number;
  sevende?: number;
  publico?: number;
  bloqueado?: number;
  ventasinstock?: number;
  codsubcuentacom?: string;
  codsubcuentaven?: string;
  codsubcuentairpfcom?: string;
  excepcioniva?: string;
  tipo?: string;
  observaciones?: string;
  fechaalta?: string;
  actualizado?: string;
}

// Product Image (ProductoImagen) entity
export interface ProductoImagen {
  id: number;
  idproducto: number;
  idfile: number;
  referencia?: string;
  orden?: number;
}

// Province (Provincia) entity
export interface Provincia {
  idprovincia: number;
  provincia?: string;
  codpais?: string;
  codisoprov?: string;
  codeid?: string;
  alias?: string;
  latitude?: number;
  longitude?: number;
  telephone_prefix?: string;
  nick?: string;
  last_nick?: string;
  creation_date?: string;
  last_update?: string;
}

// Product Family (Familia) entity
export interface Familia {
  codfamilia?: string;
  codsubcuentacom?: string;
  codsubcuentairpfcom?: string;
  codsubcuentaven?: string;
  descripcion?: string;
  madre?: string;
  numproductos?: number;
}

// Manufacturer (Fabricante) entity
export interface Fabricante {
  codfabricante?: string;
  nombre?: string;
  numproductos?: number;
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

// FormaPago (Payment Method) entity
export interface FormaPago {
  activa?: number;
  codcuentabanco?: string;
  codpago: string;
  descripcion?: string;
  domiciliado?: number;
  idempresa?: number;
  imprimir?: number;
  pagado?: number;
  plazovencimiento?: number;
  tipovencimiento?: string;
}

// FormatoDocumento (Document Format) entity
export interface FormatoDocumento {
  autoaplicar?: number;
  codserie?: string;
  id: number;
  idempresa?: number;
  idlogo?: number;
  nombre?: string;
  texto?: string;
  tipodoc?: string;
  titulo?: string;
}

// IdentificadorFiscal (Fiscal Identifier) entity
export interface IdentificadorFiscal {
  codeid: string;
  tipoidfiscal?: string;
  validar?: number;
}

// Impuesto (Tax) entity
export interface Impuesto {
  activo?: number;
  codimpuesto: string;
  codsubcuentarep?: string;
  codsubcuentarepre?: string;
  codsubcuentasop?: string;
  codsubcuentasopre?: string;
  descripcion?: string;
  tipo?: number;
  iva?: number;
  recargo?: number;
}

// ImpuestoZona (Tax Zone) entity
export interface ImpuestoZona {
  codimpuesto?: string;
  codimpuestosel?: string;
  codisopro?: string;
  codpais?: string;
  id: number;
  prioridad?: number;
}

// LineaAlbaranCliente (Customer Delivery Note Line) entity
export interface LineaAlbaranCliente {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  coste?: number;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idalbaran?: number;
  idlinea: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  mostrar_cantidad?: number;
  mostrar_precio?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  salto_pagina?: number;
  servido?: number;
  suplido?: number;
}

// LineaAlbaranProveedor (Supplier Delivery Note Line) entity
export interface LineaAlbaranProveedor {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idalbaran?: number;
  idlinea: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  servido?: number;
  suplido?: number;
}

// LineaFacturaCliente (Customer Invoice Line) entity
export interface LineaFacturaCliente {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  coste?: number;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idfactura?: number;
  idlinea: number;
  idlinearect?: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  mostrar_cantidad?: number;
  mostrar_precio?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  salto_pagina?: number;
  servido?: number;
  suplido?: number;
}

// LineaFacturaProveedor (Supplier Invoice Line) entity
export interface LineaFacturaProveedor {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idfactura?: number;
  idlinea: number;
  idlinearect?: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  servido?: number;
  suplido?: number;
}

// LineaPedidoCliente (Customer Order Line) entity
export interface LineaPedidoCliente {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  coste?: number;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idlinea: number;
  idpedido?: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  mostrar_cantidad?: number;
  mostrar_precio?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  salto_pagina?: number;
  servido?: number;
  suplido?: number;
}

// LineaPedidoProveedor (Supplier Order Line) entity
export interface LineaPedidoProveedor {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idlinea: number;
  idpedido?: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  servido?: number;
  suplido?: number;
}

// LineaPresupuestoCliente (Customer Quote Line) entity
export interface LineaPresupuestoCliente {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  coste?: number;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idlinea: number;
  idpresupuesto?: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  mostrar_cantidad?: number;
  mostrar_precio?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  salto_pagina?: number;
  servido?: number;
  suplido?: number;
}

// LineaPresupuestoProveedor (Supplier Quote Line) entity
export interface LineaPresupuestoProveedor {
  actualizastock?: number;
  cantidad?: number;
  codimpuesto?: string;
  descripcion?: string;
  dtopor?: number;
  dtopor2?: number;
  excepcioniva?: string;
  idlinea: number;
  idpresupuesto?: number;
  idproducto?: number;
  irpf?: number;
  iva?: number;
  orden?: number;
  pvpsindto?: number;
  pvptotal?: number;
  pvpunitario?: number;
  recargo?: number;
  referencia?: string;
  servido?: number;
  suplido?: number;
}

// LogMessage (System Log Message) entity
export interface LogMessage {
  channel?: string;
  context?: string;
  id: number;
  idcontacto?: number;
  ip?: string;
  level?: string;
  message?: string;
  model?: string;
  modelcode?: string;
  nick?: string;
  time?: string;
  uri?: string;
}

// Page (Page Definition) entity
export interface Page {
  icon?: string;
  menu?: string;
  name?: string;
  ordernum?: number;
  showonmenu?: number;
  submenu?: string;
  title?: string;
}

// PageFilter (Page Filter) entity
export interface PageFilter {
  description?: string;
  filters?: string;
  id?: number;
  name?: string;
  nick?: string;
}

// PagoCliente (Customer Payment) entity
export interface PagoCliente {
  codpago?: string;
  customid?: string;
  customstatus?: string;
  fecha?: string;
  gastos?: number;
  hora?: string;
  idasiento?: number;
  idpago?: number;
  idrecibo?: number;
  importe?: number;
  nick?: string;
}

// PagoProveedor (Supplier Payment) entity
export interface PagoProveedor {
  codpago?: string;
  fecha?: string;
  hora?: string;
  idasiento?: number;
  idpago?: number;
  idrecibo?: number;
  importe?: number;
  nick?: string;
}

// Pais (Country) entity
export interface Pais {
  alias?: string;
  codiso?: string;
  codpais?: string;
  creation_date?: string;
  last_nick?: string;
  last_update?: string;
  latitude?: number;
  longitude?: number;
  nick?: string;
  nombre?: string;
  telephone_prefix?: string;
}

// PuntoInteresCiudad (City Point of Interest) entity
export interface PuntoInteresCiudad {
  alias?: string;
  creation_date?: string;
  id: number;
  idciudad?: number;
  last_nick?: string;
  last_update?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  nick?: string;
}

// ReciboCliente (Customer Receipt) entity
export interface ReciboCliente {
  codcliente?: string;
  coddivisa?: string;
  codigofactura?: string;
  codpago?: string;
  fecha?: string;
  fechapago?: string;
  gastos?: number;
  idempresa?: number;
  idfactura?: number;
  idrecibo: number;
  importe?: number;
  liquidado?: number;
  nick?: string;
  numero?: number;
  observaciones?: string;
  pagado?: number;
  vencido?: number;
  vencimiento?: string;
}

// ReciboProveedor (Supplier Receipt) entity
export interface ReciboProveedor {
  coddivisa?: string;
  codigofactura?: string;
  codpago?: string;
  codproveedor?: string;
  fecha?: string;
  fechapago?: string;
  idempresa?: number;
  idfactura?: number;
  idrecibo: number;
  importe?: number;
  liquidado?: number;
  nick?: string;
  numero?: number;
  observaciones?: string;
  pagado?: number;
  vencido?: number;
  vencimiento?: string;
}

// RegularizacionImpuesto (Tax Regularization) entity
export interface RegularizacionImpuesto {
  bloquear?: number;
  codejercicio?: string;
  codsubcuentaacr?: string;
  codsubcuentadeu?: string;
  fechaasiento?: string;
  fechafin?: string;
  fechainicio?: string;
  idasiento?: number;
  idempresa?: number;
  idregiva: number;
  idsubcuentaacr?: number;
  idsubcuentadeu?: number;
  periodo?: string;
}

// Retencion (Retention/Withholding) entity
export interface Retencion {
  activa?: number;
  codretencion: string;
  codsubcuentaret?: string;
  codsubcuentaacr?: string;
  descripcion?: string;
  porcentaje?: number;
}

// SecuenciaDocumento (Document Sequence) entity
export interface SecuenciaDocumento {
  codejercicio?: string;
  codserie?: string;
  idempresa?: number;
  idsecuencia: number;
  inicio?: number;
  longnumero?: number;
  numero?: number;
  patron?: string;
  tipodoc?: string;
  usarhuecos?: number;
}

// Serie (Series) entity
export interface Serie {
  canal?: number;
  codserie: string;
  descripcion?: string;
  iddiario?: number;
  siniva?: number;
  tipo?: string;
}

// Subcuenta (Sub-account) entity
export interface Subcuenta {
  codcuenta?: string;
  codcuentaesp?: string;
  codejercicio?: string;
  codsubcuenta: string;
  debe?: number;
  descripcion?: string;
  haber?: number;
  idcuenta?: number;
  idsubcuenta: number;
  saldo?: number;
}

// Tarifa (Tariff/Price List) entity
export interface Tarifa {
  aplicar?: string;
  codtarifa: string;
  maxpvp?: number;
  mincoste?: number;
  nombre?: string;
  valorx?: number;
  valory?: number;
}

// TotalModel (Analytics/Aggregation Model) entity
export interface TotalModel {
  // Based on OpenAPI spec, this appears to be a flexible analytics entity
  // The example shows an empty array, so this is likely a dynamic structure
  [key: string]: any;
}

// Variante (Product Variant) entity
export interface Variante {
  codbarras?: string;
  coste?: number;
  idatributovalor1?: number;
  idatributovalor2?: number;
  idatributovalor3?: number;
  idatributovalor4?: number;
  idproducto?: number;
  idvariante: number;
  margen?: number;
  precio?: number;
  referencia?: string;
  stockfis?: number;
}

// WorkEvent (Work/Job Event) entity
export interface WorkEvent {
  creation_date?: string;
  done?: number;
  done_date?: string;
  id: number;
  name?: string;
  nick?: string;
  params?: string;
  value?: string;
  workers?: number;
  worker_list?: string;
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