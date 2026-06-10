import axiosClient from './axiosClient'
import type { EmpresaRequest, EmpresaResponse } from '@/types'

export const empresaApi = {
  obtener: () =>
    axiosClient.get<EmpresaResponse>('/config/empresa').then(r => r.data),

  actualizar: (data: EmpresaRequest) =>
    axiosClient.put<EmpresaResponse>('/config/empresa', data).then(r => r.data),

  subirLogo: (file: File) => {
    const form = new FormData()
    form.append('archivo', file)
    return axiosClient.post('/config/empresa/logo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  logoUrl: () => '/api/config/empresa/logo',
}
