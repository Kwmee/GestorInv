import axiosClient from './axiosClient'
import type { RedStatus } from '@/types'

export const redApi = {
  obtener: () =>
    axiosClient.get<RedStatus>('/config/red').then((r) => r.data),

  establecer: (modoRed: boolean) =>
    axiosClient.post<RedStatus>('/config/red', { modoRed }).then((r) => r.data),
}
