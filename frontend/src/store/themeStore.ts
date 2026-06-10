import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Tema = 'light' | 'dark'

interface ThemeState {
  tema: Tema
  toggleTema: () => void
}

function aplicarTema(tema: Tema) {
  document.documentElement.classList.toggle('dark', tema === 'dark')
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      tema: 'light',
      toggleTema: () => {
        const nuevo: Tema = get().tema === 'light' ? 'dark' : 'light'
        aplicarTema(nuevo)
        set({ tema: nuevo })
      },
    }),
    {
      name: 'gestor-tema',
      onRehydrateStorage: () => (state) => {
        if (state) aplicarTema(state.tema)
      },
    }
  )
)
