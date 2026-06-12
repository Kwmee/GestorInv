import api from './axiosClient'
import type { InformesResponse } from '@/types'

export const informesApi = {
  obtener: () => api.get<InformesResponse>('/informes').then(r => r.data),
}
