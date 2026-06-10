import axiosClient from './axiosClient'
import type { Albaran, PaginaResponse } from '@/types'

interface FiltrosAlbaran {
  tipo?: string
  eventoId?: number
  fechaDesde?: string
  page?: number
  size?: number
}

export const albaranApi = {
  listar: (filtros: FiltrosAlbaran = {}) =>
    axiosClient.get<PaginaResponse<Albaran>>('/albaranes', { params: filtros }).then((r) => r.data),

  obtener: (id: number) =>
    axiosClient.get<Albaran>(`/albaranes/${id}`).then((r) => r.data),

  descargarPdf: (id: number) =>
    axiosClient.get(`/albaranes/${id}/pdf`, { responseType: 'blob' }).then((r) => r.data),
}
