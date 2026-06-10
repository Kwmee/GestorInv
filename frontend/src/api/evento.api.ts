import axiosClient from './axiosClient'
import type {
  Albaran, DevolucionRequest, Evento, EventoRequest,
  LineaMaterialRequest, PaginaResponse,
} from '@/types'

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
}
