import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import { eventoApi } from '@/api/evento.api'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import { Paginacion } from '@/components/ui/Paginacion'
import { Modal } from '@/components/ui/Modal'
import { EventoForm } from './EventoForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function EventoListado() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(0)
  const [estado, setEstado] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['eventos', { pagina, estado }],
    queryFn: () => eventoApi.listar({ page: pagina, estado: estado || undefined }),
  })

  const formatFecha = (iso: string) =>
    format(new Date(iso), "d MMM yyyy", { locale: es })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Eventos</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            {data ? `${data.totalElementos} eventos` : ''}
          </p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus className="h-4 w-4" />
          Nuevo evento
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 flex gap-3">
        <Select
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setPagina(0) }}
          className="w-48"
        >
          <option value="">Todos los estados</option>
          <option value="PLANIFICADO">Planificado</option>
          <option value="ACTIVO">Activo</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="CANCELADO">Cancelado</option>
        </Select>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Evento</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Lugar</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Fecha inicio</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Material</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {data?.contenido.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 dark:text-zinc-500">
                    No se encontraron eventos
                  </td>
                </tr>
              )}
              {data?.contenido.map((e) => (
                <tr
                  key={e.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  onClick={() => navigate(`/eventos/${e.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">{e.nombre}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">{e.cliente.razonSocial}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-zinc-500">{e.lugar ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">{formatFecha(e.fechaInicio)}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-zinc-400 text-center">
                    <span className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-400 px-2 py-0.5 rounded-full text-xs">
                      {e.lineas.length} ítems
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={e.estado} />
                  </td>
                  <td className="px-4 py-3 text-gray-400 dark:text-zinc-600">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data && (
          <Paginacion
            paginaActual={data.paginaActual}
            totalPaginas={data.totalPaginas}
            onCambiar={setPagina}
          />
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
