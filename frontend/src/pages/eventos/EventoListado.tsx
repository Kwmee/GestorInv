import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight, CalendarDays } from 'lucide-react'
import { eventoApi } from '@/api/evento.api'
import { Button } from '@/components/ui/Button'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import { Paginacion } from '@/components/ui/Paginacion'
import { Modal } from '@/components/ui/Modal'
import { EventoForm } from './EventoForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { EstadoEvento } from '@/types'

const ESTADOS: { valor: EstadoEvento | ''; label: string }[] = [
  { valor: '',            label: 'Todos' },
  { valor: 'PLANIFICADO', label: 'Planificado' },
  { valor: 'EN_CARGA',    label: 'Cargando' },
  { valor: 'ACTIVO',      label: 'En ruta' },
  { valor: 'DEVOLVIENDO', label: 'Devolviendo' },
  { valor: 'FINALIZADO',  label: 'Finalizado' },
  { valor: 'CANCELADO',   label: 'Cancelado' },
]

export function EventoListado() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(0)
  const [estado, setEstado] = useState<EstadoEvento | ''>('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['eventos', { pagina, estado }],
    queryFn: () => eventoApi.listar({ page: pagina, estado: estado || undefined }),
  })

  const formatFecha = (iso: string) => format(new Date(iso), "d MMM yyyy", { locale: es })

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Eventos</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">
            {data ? `${data.totalElementos} eventos registrados` : ''}
          </p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus className="h-3.5 w-3.5" />
          Nuevo evento
        </Button>
      </div>

      {/* Filtro por estado — pill tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {ESTADOS.map(({ valor, label }) => (
          <button
            key={valor}
            onClick={() => { setEstado(valor); setPagina(0) }}
            className={
              estado === valor
                ? 'px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'px-3 py-1.5 rounded-md text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-gray-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600 transition-colors'
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="h-4 w-48 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Evento</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide hidden md:table-cell">Lugar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide hidden lg:table-cell">Material</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/60">
                {data?.contenido.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center py-14 text-center">
                        <CalendarDays className="h-10 w-10 text-gray-200 dark:text-zinc-700 mb-3" />
                        <p className="text-sm font-medium text-gray-400 dark:text-zinc-500">No se encontraron eventos</p>
                        <p className="text-xs text-gray-300 dark:text-zinc-600 mt-1">Prueba a cambiar el filtro o crea uno nuevo</p>
                      </div>
                    </td>
                  </tr>
                )}
                {data?.contenido.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/eventos/${e.id}`)}
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 dark:text-zinc-100">{e.nombre}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-zinc-400">{e.cliente.razonSocial}</td>
                    <td className="px-4 py-3 text-gray-400 dark:text-zinc-500 hidden md:table-cell">{e.lugar ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-zinc-400 hidden lg:table-cell font-mono text-xs">
                      {formatFecha(e.fechaInicio)}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className="text-xs font-medium text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {e.lineas.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={e.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="h-4 w-4 text-gray-300 dark:text-zinc-600 group-hover:text-gray-500 dark:group-hover:text-zinc-400 transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data && (
              <div className="border-t border-gray-100 dark:border-zinc-800">
                <Paginacion
                  paginaActual={data.paginaActual}
                  totalPaginas={data.totalPaginas}
                  onCambiar={setPagina}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        abierto={modalAbierto}
        titulo="Nuevo evento"
        onCerrar={() => setModalAbierto(false)}
        tamano="xl"
      >
        <EventoForm
          onExito={(id) => {
            setModalAbierto(false)
            queryClient.invalidateQueries({ queryKey: ['eventos'] })
            navigate(`/eventos/${id}`)
          }}
        />
      </Modal>
    </div>
  )
}
