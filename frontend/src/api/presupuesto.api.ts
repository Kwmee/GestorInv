import api from './axiosClient'
import type { Presupuesto, PresupuestoRequest, PaginaResponse, EstadoPresupuesto } from '@/types'

export const presupuestoApi = {
  listar: (page = 0, size = 20) =>
    api.get<PaginaResponse<Presupuesto>>('/presupuestos', { params: { page, size } }).then(r => r.data),

  obtener: (id: number) =>
    api.get<Presupuesto>(`/presupuestos/${id}`).then(r => r.data),

  crear: (data: PresupuestoRequest) =>
    api.post<Presupuesto>('/presupuestos', data).then(r => r.data),

  actualizar: (id: number, data: PresupuestoRequest) =>
    api.put<Presupuesto>(`/presupuestos/${id}`, data).then(r => r.data),

  cambiarEstado: (id: number, estado: EstadoPresupuesto) =>
    api.patch<Presupuesto>(`/presupuestos/${id}/estado`, null, { params: { estado } }).then(r => r.data),

  eliminar: (id: number) =>
    api.delete(`/presupuestos/${id}`),
}
