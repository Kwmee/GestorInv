// ============================================================
// Enums — deben coincidir con los del backend
// ============================================================

export type EstadoMaterial    = 'DISPONIBLE' | 'EN_EVENTO' | 'EN_REPARACION' | 'BAJA'
export type EstadoMantenimiento = 'EN_REVISION' | 'REPARANDO' | 'REPARADO' | 'IRREPARABLE'
export type EstadoPresupuesto   = 'BORRADOR' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO' | 'EXPIRADO'
export type EstadoEvento        = 'PLANIFICADO' | 'EN_CARGA' | 'ACTIVO' | 'DEVOLVIENDO' | 'FINALIZADO' | 'CANCELADO'
export type EstadoChecklistItem = 'PENDIENTE' | 'CARGADO' | 'PARCIAL' | 'FALTANTE'
export type TipoAlbaran    = 'SALIDA' | 'DEVOLUCION'
export type RolUsuario     = 'ADMIN' | 'OPERARIO'
export type EstadoDevolucion = 'PENDIENTE' | 'OK' | 'CON_INCIDENCIA' | 'NO_DEVUELTO'
export type TipoCliente    = 'EMPRESA' | 'PARTICULAR'

// ============================================================
// Entidades
// ============================================================

export interface CategoriaMaterial {
  id: number
  nombre: string
  descripcion?: string
}

export interface Material {
  id: number
  categoria: CategoriaMaterial
  nombre: string
  descripcion?: string
  marca?: string
  modelo?: string
  numeroSerie?: string
  cantidad: number
  estado: EstadoMaterial
  valorUnitario?: number
  fechaAdquisicion?: string
  esFungible: boolean
  stockMinimo: number
  observaciones?: string
  creadoEn: string
  actualizadoEn: string
}

export interface Trabajador {
  id: number
  nombre: string
  activo: boolean
}

export interface Cliente {
  id: number
  razonSocial: string
  nifCif?: string
  telefono?: string
  email?: string
  direccion?: string
  tipo: TipoCliente
  activo: boolean
  creadoEn: string
}

export interface ChecklistItem {
  id: number
  materialId: number
  materialNombre: string
  materialNumeroSerie?: string
  materialCategoria?: string
  cantidadPlanificada: number
  cantidadCargada?: number
  estado: EstadoChecklistItem
  notas?: string
  confirmadoEn?: string
}

export interface LineaEventoInfo {
  id: number
  materialId: number
  materialNombre: string
  materialNumeroSerie?: string
  cantidad: number
  estadoDevolucion: EstadoDevolucion
  observaciones?: string
}

export interface Evento {
  id: number
  cliente: {
    id: number
    razonSocial: string
    nifCif?: string
    telefono?: string
    email?: string
    direccion?: string
  }
  trabajador?: { id: number; nombre: string }
  nombre: string
  descripcion?: string
  lugar?: string
  fechaInicio: string
  fechaFin?: string
  estado: EstadoEvento
  observaciones?: string
  lineas: LineaEventoInfo[]
  albaranes?: Albaran[]
  creadoEn: string
}

export interface Albaran {
  id: number
  numero: string
  tipo: TipoAlbaran
  fechaEmision: string
  eventoId: number
  eventoNombre: string
  pdfUrl: string
}

// ============================================================
// Requests
// ============================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface MaterialRequest {
  categoriaId: number
  nombre: string
  descripcion?: string
  marca?: string
  modelo?: string
  numeroSerie?: string
  cantidad: number
  valorUnitario?: number
  fechaAdquisicion?: string
  esFungible: boolean
  stockMinimo: number
  observaciones?: string
}

export interface ClienteRequest {
  razonSocial: string
  nifCif?: string
  telefono?: string
  email?: string
  direccion?: string
  tipo: TipoCliente
}

export interface LineaMaterialRequest {
  materialId: number
  cantidad: number
  observaciones?: string
}

export interface EventoRequest {
  clienteId: number
  trabajadorId?: number
  nombre: string
  descripcion?: string
  lugar?: string
  fechaInicio: string
  fechaFin?: string
  observaciones?: string
  lineas?: LineaMaterialRequest[]
}

export interface LineaDevolucionRequest {
  materialId: number
  estadoDevolucion: EstadoDevolucion
  observaciones?: string
}

export interface DevolucionRequest {
  trabajadorId?: number
  lineas: LineaDevolucionRequest[]
}

// ============================================================
// Responses
// ============================================================

export interface AuthResponse {
  token: string
  tipo: string
  expiracion: string
  usuario: {
    id: number
    nombre: string
    email: string
    rol: RolUsuario
  }
}

export interface PaginaResponse<T> {
  contenido: T[]
  paginaActual: number
  totalPaginas: number
  totalElementos: number
  primera: boolean
  ultima: boolean
}

export interface DashboardResponse {
  totalMaterial: number
  disponible: number
  enEvento: number
  enReparacion: number
  baja: number
  eventosActivos: number
  materialPendienteDevolucion: number
  eventosActivosDetalle: {
    id: number
    nombre: string
    cliente: string
    fechaInicio: string
    materialPendiente: number
  }[]
  alertasDevolucion: {
    id: number
    nombre: string
    cliente: string
    fechaFin: string
    diasRetraso: number
    materialPendiente: number
  }[]
}

export interface AlbaranResponse {
  albaranId: number
  numeroAlbaran: string
  pdfUrl: string
  mensaje: string
}

export interface PerfilRequest {
  nombre: string
  email: string
}

export interface CambiarContrasenaRequest {
  contrasenaActual: string
  contrasenaNueva: string
}

export interface UsuarioResponse {
  id: number
  nombre: string
  email: string
  rol: RolUsuario
}

export interface EmpresaRequest {
  nombre: string
  direccion?: string
  telefono?: string
  email?: string
}

export interface Mantenimiento {
  id: number
  material: { id: number; nombre: string; marca?: string; modelo?: string }
  fechaEntrada: string
  fechaSalida?: string
  descripcion: string
  tecnicoExterno?: string
  coste?: number
  estado: EstadoMantenimiento
  observaciones?: string
  creadoEn: string
}

export interface MantenimientoRequest {
  materialId: number
  fechaEntrada: string
  fechaSalida?: string
  descripcion: string
  tecnicoExterno?: string
  coste?: number
  estado?: EstadoMantenimiento
  observaciones?: string
}

export interface LineaPresupuesto {
  id: number
  materialId: number
  materialNombre: string
  cantidad: number
  precioUnitario: number
  subtotal: number
  descripcion?: string
}

export interface Presupuesto {
  id: number
  numero: string
  cliente: { id: number; razonSocial: string }
  fechaEmision: string
  fechaValidez?: string
  estado: EstadoPresupuesto
  descripcion?: string
  observaciones?: string
  lineas: LineaPresupuesto[]
  total: number
  creadoEn: string
}

export interface PresupuestoRequest {
  clienteId: number
  fechaValidez?: string
  descripcion?: string
  observaciones?: string
  lineas: { materialId: number; cantidad: number; precioUnitario: number; descripcion?: string }[]
}

export interface BusquedaResponse {
  material: { id: number; nombre: string; marca?: string; estado: EstadoMaterial; categoriaNombre: string }[]
  eventos:  { id: number; nombre: string; lugar?: string; estado: EstadoEvento; clienteNombre: string }[]
  clientes: { id: number; razonSocial: string; email?: string; tipo: TipoCliente }[]
}

export interface InformesResponse {
  resumenMaterial: {
    totalItems: number; disponible: number; enEvento: number; enReparacion: number; baja: number; valorTotal: number
  }
  materialPorCategoria: { categoria: string; total: number; disponible: number }[]
  eventosPorMes: { mes: string; total: number; finalizados: number }[]
  top5MaterialUsado: { nombre: string; categoria: string; vecesEnEventos: number }[]
  resumenEventos: { total: number; planificados: number; activos: number; finalizados: number; cancelados: number }
  resumenMantenimiento: { enRevision: number; reparando: number; reparados: number; irreparables: number }
}

export interface RedStatus {
  modoRed: boolean
  ipsLocales: string[]
  puerto: number
}

export interface EmpresaResponse {
  nombre: string
  direccion?: string
  telefono?: string
  email?: string
  tieneLogo: boolean
}
