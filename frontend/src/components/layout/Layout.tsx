import { useState, useEffect, type ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { BusquedaGlobal } from '@/components/ui/BusquedaGlobal'

interface Props { children: ReactNode }

export function Layout({ children }: Props) {
  const [busquedaAbierta, setBusquedaAbierta] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setBusquedaAbierta(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header con búsqueda */}
        <header
          className="h-14 flex items-center px-6 border-b shrink-0"
          style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
        >
          <button
            onClick={() => setBusquedaAbierta(true)}
            className="flex items-center gap-2 px-3 h-8 rounded-lg border text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors w-64"
            style={{ borderColor: 'var(--card-border)', background: 'var(--card)' }}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-zinc-400">
              <span className="font-medium">Ctrl</span>
              <span>K</span>
            </kbd>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-7 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {busquedaAbierta && <BusquedaGlobal onCerrar={() => setBusquedaAbierta(false)} />}
    </div>
  )
}
