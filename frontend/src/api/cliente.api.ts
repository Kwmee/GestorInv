import axiosClient from './axiosClient'
import type { Cliente, ClienteRequest, Evento, PaginaResponse } from '@/types'

export const clienteApi = {
  listar: (q?: string, page = 0, size = 20) =>
    axiosClient.get<PaginaResponse<Cliente>>('/clientes', { params: { q, page, size } }).then((r) => r.data),

  obtener: (id: number) =>
    axiosClient.get<Cliente>(`/clientes/${id}`).then((r) => r.data),

  crear: (data: ClienteRequest) =>
    axiosClient.post<Cliente>('/clientes', data).then((r) => r.data),

  actualizar: (id: number, data: ClienteRequest) =>
    axiosClient.put<Cliente>(`/clientes/${id}`, data).then((r) => r.data),

  desactivar: (id: number) =>
    axiosClient.delete(`/clientes/${id}`),

  obtenerEventos: (id: number) =>
    axiosClient.get<Evento[]>(`/clientes/${id}/eventos`).then((r) => r.data),
}
