import api from './axiosClient'
import type { Mantenimiento, MantenimientoRequest } from '@/types'

export const mantenimientoApi = {
  listarPorMaterial: (materialId: number) =>
    api.get<Mantenimiento[]>(`/mantenimiento?materialId=${materialId}`).then(r => r.data),

  obtener: (id: number) =>
    api.get<Mantenimiento>(`/mantenimiento/${id}`).then(r => r.data),

  crear: (data: MantenimientoRequest) =>
    api.post<Mantenimiento>('/mantenimiento', data).then(r => r.data),

  actualizar: (id: number, data: MantenimientoRequest) =>
    api.put<Mantenimiento>(`/mantenimiento/${id}`, data).then(r => r.data),

  eliminar: (id: number) =>
    api.delete(`/mantenimiento/${id}`),
}
