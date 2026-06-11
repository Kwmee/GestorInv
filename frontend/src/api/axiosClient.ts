import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const axiosClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().cerrarSesion()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosClient
