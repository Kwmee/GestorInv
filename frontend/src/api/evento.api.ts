import axiosClient from './axiosClient'
import type {
  Albaran, ChecklistItem, DevolucionRequest, Evento, EventoRequest,
  LineaMaterialRequest, PaginaResponse,
} from '@/types'

export interface ChecklistItemRequest {
  estado: 'PENDIENTE' | 'CARGADO' | 'PARCIAL' | 'FALTANTE'
  cantidadCargada?: number
  notas?: string
}

interface FiltrosEvento {
  estado?: string
  clienteId?: number
  fechaDesde?: string
  page?: number
  size?: number
}

export const eventoApi = {
  listar: (filtros: FiltrosEvento = {}) =>
    axiosClient.get<PaginaResponse<Evento>>('/eventos', { params: filtros }).then((r) => r.data),

  obtener: (id: number) =>
    axiosClient.get<Evento>(`/eventos/${id}`).then((r) => r.data),

  crear: (data: EventoRequest) =>
    axiosClient.post<Evento>('/eventos', data).then((r) => r.data),

  actualizar: (id: number, data: EventoRequest) =>
    axiosClient.put<Evento>(`/eventos/${id}`, data).then((r) => r.data),

  agregarMaterial: (id: number, lineas: LineaMaterialRequest[]) =>
    axiosClient.post<Evento>(`/eventos/${id}/material`, lineas).then((r) => r.data),

  quitarMaterial: (eventoId: number, materialId: number) =>
    axiosClient.delete(`/eventos/${eventoId}/material/${materialId}`),

  confirmarSalida: (id: number) =>
    axiosClient.post<Albaran>(`/eventos/${id}/confirmar-salida`).then((r) => r.data),

  registrarDevolucion: (id: number, data: DevolucionRequest) =>
    axiosClient.post<Albaran>(`/eventos/${id}/devolucion`, data).then((r) => r.data),

  listaCarga: (id: number) =>
    axiosClient.get(`/eventos/${id}/lista-carga`, { responseType: 'blob' }).then((r) => r.data as Blob),

  iniciarCarga: (id: number) =>
    axiosClient.post<ChecklistItem[]>(`/eventos/${id}/iniciar-carga`).then((r) => r.data),

  obtenerChecklist: (id: number) =>
    axiosClient.get<ChecklistItem[]>(`/eventos/${id}/checklist`).then((r) => r.data),

  marcarItem: (eventoId: number, itemId: number, data: ChecklistItemRequest) =>
    axiosClient.put<ChecklistItem>(`/eventos/${eventoId}/checklist/${itemId}`, data).then((r) => r.data),

  iniciarDevolucion: (id: number) =>
    axiosClient.post(`/eventos/${id}/iniciar-devolucion`),
}
