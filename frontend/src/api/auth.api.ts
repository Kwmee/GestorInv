import axiosClient from './axiosClient'
import type { AuthResponse, LoginRequest } from '@/types'

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),
}
