import api from './axiosClient'
import type { BusquedaResponse } from '@/types'

export const busquedaApi = {
  buscar: (q: string) =>
    api.get<BusquedaResponse>('/busqueda', { params: { q } }).then(r => r.data),
}
