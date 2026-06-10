import axiosClient from './axiosClient'
import type { CambiarContrasenaRequest, PerfilRequest, UsuarioResponse } from '@/types'

export const usuarioApi = {
  obtenerPerfil: () =>
    axiosClient.get<UsuarioResponse>('/usuarios/perfil').then((r) => r.data),

  actualizarPerfil: (data: PerfilRequest) =>
    axiosClient.put<UsuarioResponse>('/usuarios/perfil', data).then((r) => r.data),

  cambiarContrasena: (data: CambiarContrasenaRequest) =>
    axiosClient.put('/usuarios/cambiar-contrasena', data),
}
