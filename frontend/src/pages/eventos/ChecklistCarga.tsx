import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { CheckSquare, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { eventoApi } from '@/api/evento.api'
import type { ChecklistItem } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  eventoId: number
}

const ICONOS = {
  PENDIENTE: <Clock className="h-4 w-4 text-yellow-500" />,
  CARGADO:   <CheckSquare className="h-4 w-4 text-green-600" />,
  PARCIAL:   <AlertTriangle className="h-4 w-4 text-orange-500" />,
  FALTANTE:  <XCircle className="h-4 w-4 text-red-500" />,
}

const COLORES_FILA: Record<string, string> = {
  PENDIENTE: '',
  CARGADO:   'bg-green-50 dark:bg-green-900/10',
  PARCIAL:   'bg-yellow-50 dark:bg-yellow-900/10',
  FALTANTE:  'bg-red-50 dark:bg-red-900/10',
}

export function ChecklistCarga({ eventoId }: Props) {
  const queryClient = useQueryClient()
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState({ estado: '', cantidadCargada: '', notas: '' })

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['checklist', eventoId],
    queryFn: () => eventoApi.obtenerChecklist(eventoId),
  })

  const { mutate: marcar, isPending } = useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: any }) =>
      eventoApi.marcarItem(eventoId, itemId, data),
    onSuccess: () => {
      toast.success('Actualizado')
      queryClient.invalidateQueries({ queryKey: ['checklist', eventoId] })
      setEditandoId(null)
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error'),
  })

  const abrirEdicion = (item: ChecklistItem) => {
    setEditandoId(item.id)
    setForm({
      estado: item.estado,
      cantidadCargada: item.cantidadCargada?.toString() ?? '',
      notas: item.notas ?? '',
    })
  }

  const guardar = (item: ChecklistItem) => {
    marcar({
      itemId: item.id,
      data: {
        estado: form.estado || item.estado,
        cantidadCargada: form.cantidadCargada !== '' ? Number(form.cantidadCargada) : undefined,
        notas: form.notas || undefined,
      },
    })
  }

  if (isLoading) return <div className="py-6 text-center text-sm text-gray-400">Cargando checklist...</div>

  const cargados   = items.filter((i) => i.estado === 'CARGADO').length
  const parciales  = items.filter((i) => i.estado === 'PARCIAL').length
  const faltantes  = items.filter((i) => i.estado === 'FALTANTE').length
  const pendientes = items.filter((i) => i.estado === 'PENDIENTE').length

  return (
    <div className="space-y-3">
      {/* Resumen */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { label: 'Cargados',  valor: cargados,  color: 'text-green-600 dark:text-green-400' },
          { label: 'Parcial',   valor: parciales,  color: 'text-orange-600 dark:text-orange-400' },
          { label: 'Faltantes', valor: faltantes,  color: 'text-red-600 dark:text-red-400' },
          { label: 'Pendientes',valor: pendientes, color: 'text-yellow-600 dark:text-yellow-400' },
        ].map(({ label, valor, color }) => (
          <div key={label} className="bg-gray-50 dark:bg-zinc-800 rounded-lg py-2">
            <p className={`text-lg font-bold ${color}`}>{valor}</p>
            <p className="text-gray-500 dark:text-zinc-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Material</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-zinc-400">Planificado</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-zinc-400">Cargado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Estado</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Notas</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-zinc-400">Hora</th>
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
            {items.map((item) => (
              <tr key={item.id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50 ${COLORES_FILA[item.estado]}`}>
                {editandoId === item.id ? (
                  <>
                    <td className="px-4 py-2">
                      <p className="font-medium text-gray-900 dark:text-zinc-100">{item.materialNombre}</p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">{item.materialCategoria}</p>
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700 dark:text-zinc-300">{item.cantidadPlanificada}</td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number" min={0} max={item.cantidadPlanificada}
                        value={form.cantidadCargada}
                        onChange={(e) => setForm({ ...form, cantidadCargada: e.target.value })}
                        className="w-16 text-center border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={form.estado}
                        onChange={(e) => setForm({ ...form, estado: e.target.value })}
                        className="border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
                      >
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CARGADO">Cargado</option>
                        <option value="PARCIAL">Parcial</option>
                        <option value="FALTANTE">Faltante</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        placeholder="Notas..."
                        value={form.notas}
                        onChange={(e) => setForm({ ...form, notas: e.target.value })}
                        className="w-full border border-gray-300 dark:border-zinc-600 rounded px-2 py-1 text-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100"
                      />
                    </td>
                    <td colSpan={2} className="px-4 py-2 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => guardar(item)}
                          disabled={isPending}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="px-3 py-1 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-zinc-600"
                        >
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-zinc-100">{item.materialNombre}</p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">
                        {item.materialCategoria}
                        {item.materialNumeroSerie ? ` · ${item.materialNumeroSerie}` : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 dark:text-zinc-300">{item.cantidadPlanificada}</td>
                    <td className="px-4 py-3 text-center">
                      {item.cantidadCargada != null
                        ? <span className={item.cantidadCargada < item.cantidadPlanificada ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-gray-700 dark:text-zinc-300'}>
                            {item.cantidadCargada}
                          </span>
                        : <span className="text-gray-300 dark:text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {ICONOS[item.estado]}
                        <span className="text-gray-700 dark:text-zinc-300 capitalize text-xs">
                          {item.estado === 'PENDIENTE' ? 'Pendiente' :
                           item.estado === 'CARGADO'   ? 'Cargado' :
                           item.estado === 'PARCIAL'   ? 'Parcial' : 'Faltante'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-400 max-w-[160px] truncate">
                      {item.notas ?? <span className="text-gray-300 dark:text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 dark:text-zinc-500">
                      {item.confirmadoEn
                        ? format(new Date(item.confirmadoEn), 'HH:mm', { locale: es })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => abrirEdicion(item)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {item.estado === 'PENDIENTE' ? 'Marcar' : 'Editar'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendientes === 0 && faltantes === 0 && (
        <p className="text-center text-sm text-green-600 dark:text-green-400 font-medium py-2">
          ✓ Todo el material comprobado — listo para confirmar salida
        </p>
      )}
      {faltantes > 0 && (
        <p className="text-center text-sm text-red-600 dark:text-red-400 font-medium py-2">
          ⚠ Hay {faltantes} ítem(s) marcados como faltantes — revisar antes de salir
        </p>
      )}
    </div>
  )
}
