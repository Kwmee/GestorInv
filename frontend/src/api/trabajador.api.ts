import axiosClient from './axiosClient'
import type { Trabajador } from '@/types'

export const trabajadorApi = {
  listar: () =>
    axiosClient.get<Trabajador[]>('/trabajadores').then((r) => r.data),

  crear: (nombre: string) =>
    axiosClient.post<Trabajador>('/trabajadores', { nombre }).then((r) => r.data),

  desactivar: (id: number) =>
    axiosClient.delete(`/trabajadores/${id}`),
}
