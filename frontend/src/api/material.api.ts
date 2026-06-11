import axiosClient from './axiosClient'
import type { CategoriaMaterial, Material, MaterialRequest, PaginaResponse } from '@/types'

interface FiltrosMaterial {
  estado?: string
  categoriaId?: number
  q?: string
  page?: number
  size?: number
}

export const materialApi = {
  listar: (filtros: FiltrosMaterial = {}) =>
    axiosClient.get<PaginaResponse<Material>>('/material', { params: filtros }).then((r) => r.data),

  obtener: (id: number) =>
    axiosClient.get<Material>(`/material/${id}`).then((r) => r.data),

  crear: (data: MaterialRequest) =>
    axiosClient.post<Material>('/material', data).then((r) => r.data),

  actualizar: (id: number, data: MaterialRequest) =>
    axiosClient.put<Material>(`/material/${id}`, data).then((r) => r.data),

  darDeBaja: (id: number) =>
    axiosClient.delete(`/material/${id}`),

  listarCategorias: () =>
    axiosClient.get<CategoriaMaterial[]>('/material/categorias').then((r) => r.data),

  listadoPdf: (filtros: FiltrosMaterial = {}) =>
    axiosClient.get('/material/listado-pdf', { params: filtros, responseType: 'blob' }).then((r) => r.data as Blob),
}
