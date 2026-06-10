import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RolUsuario } from '@/types'

interface UsuarioSesion {
  id: number
  nombre: string
  email: string
  rol: RolUsuario
}

interface AuthState {
  token: string | null
  usuario: UsuarioSesion | null
  iniciarSesion: (token: string, usuario: UsuarioSesion) => void
  cerrarSesion: () => void
  estaAutenticado: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,

      iniciarSesion: (token, usuario) => set({ token, usuario }),

      cerrarSesion: () => set({ token: null, usuario: null }),

      estaAutenticado: () => !!get().token,
    }),
    {
      name: 'gestor-auth',
    }
  )
)
