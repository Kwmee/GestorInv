import axiosClient from './axiosClient'
import type { DashboardResponse } from '@/types'

export const dashboardApi = {
  resumen: () =>
    axiosClient.get<DashboardResponse>('/dashboard/resumen').then((r) => r.data),
}
