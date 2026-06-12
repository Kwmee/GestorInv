import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Package, CalendarDays, Users, X } from 'lucide-react'
import { busquedaApi } from '@/api/busqueda.api'
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'

interface Props {
  onCerrar: () => void
}

const ICONOS: Record<string, React.ReactNode> = {
  material: <Package className="h-4 w-4 text-blue-500" />,
  evento:   <CalendarDays className="h-4 w-4 text-emerald-500" />,
  cliente:  <Users className="h-4 w-4 text-violet-500" />,
}

const RUTAS: Record<string, (id: number) => string> = {
  material: (id) => `/inventario`,
  evento:   (id) => `/eventos/${id}`,
  cliente:  (id) => `/clientes`,
}

export function BusquedaGlobal({ onCerrar }: Props) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const debouncedQ = useDebounce(q, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const [seleccionado, setSeleccionado] = useState(0)

  useEffect(() => { inputRef.current?.focus() }, [])

  const { data, isFetching } = useQuery({
    queryKey: ['busqueda', debouncedQ],
    queryFn: () => busquedaApi.buscar(debouncedQ),
    enabled: debouncedQ.trim().length >= 2,
    staleTime: 10_000,
  })

  const resultados = data
    ? [
        ...data.materiales.map(m => ({ tipo: 'material', id: m.id, titulo: m.nombre, sub: m.marca ?? m.categoria })),
        ...data.eventos.map(e => ({ tipo: 'evento', id: e.id, titulo: e.nombre, sub: e.estado })),
        ...data.clientes.map(c => ({ tipo: 'cliente', id: c.id, titulo: c.razonSocial, sub: c.nif })),
      ]
    : []

  useEffect(() => { setSeleccionado(0) }, [resultados.length])

  const navegar = (idx: number) => {
    const r = resultados[idx]
    if (!r) return
    navigate(RUTAS[r.tipo](r.id))
    onCerrar()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSeleccionado(s => Math.min(s + 1, resultados.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSeleccionado(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter')     { navegar(seleccionado) }
    if (e.key === 'Escape')    { onCerrar() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={onCerrar}>
      <div
        className="w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
          <Search className={clsx('h-4 w-4 shrink-0', isFetching ? 'text-blue-500 animate-pulse' : 'text-zinc-400')} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar material, eventos, clientes..."
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          {q && (
            <button onClick={() => setQ('')} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <X className="h-3.5 w-3.5 text-zinc-400" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Resultados */}
        {debouncedQ.length >= 2 && (
          <div className="max-h-80 overflow-y-auto">
            {resultados.length === 0 && !isFetching && (
              <div className="py-8 text-center text-sm text-zinc-400">
                Sin resultados para "{debouncedQ}"
              </div>
            )}
            {resultados.map((r, i) => (
              <button
                key={`${r.tipo}-${r.id}`}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                  i === seleccionado
                    ? 'bg-blue-50 dark:bg-blue-950/20'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                )}
                onMouseEnter={() => setSeleccionado(i)}
                onClick={() => navegar(i)}
              >
                <span className="shrink-0">{ICONOS[r.tipo]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{r.titulo}</p>
                  {r.sub && <p className="text-xs text-zinc-400 truncate">{r.sub}</p>}
                </div>
                <span className="text-[10px] text-zinc-300 dark:text-zinc-600 capitalize shrink-0">{r.tipo}</span>
              </button>
            ))}
          </div>
        )}

        {/* Pie — shortcuts */}
        {debouncedQ.length >= 2 && resultados.length > 0 && (
          <div className="px-4 py-2 border-t flex gap-3 text-[10px] text-zinc-400" style={{ borderColor: 'var(--card-border)' }}>
            <span><kbd className="font-bold">↑↓</kbd> navegar</span>
            <span><kbd className="font-bold">↵</kbd> abrir</span>
            <span><kbd className="font-bold">ESC</kbd> cerrar</span>
          </div>
        )}
      </div>
    </div>
  )
}
