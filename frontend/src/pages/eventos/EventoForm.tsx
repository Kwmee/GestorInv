import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { eventoApi } from '@/api/evento.api'
import { clienteApi } from '@/api/cliente.api'
import { materialApi } from '@/api/material.api'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import type { EventoRequest, LineaMaterialRequest, Material } from '@/types'

interface Props {
  onExito: (eventoId: number) => void
}

export function EventoForm({ onExito }: Props) {
  const [lineas, setLineas] = useState<(LineaMaterialRequest & { material: Material })[]>([])
  const [materialSeleccionado, setMaterialSeleccionado] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<EventoRequest>()

  const { data: clientes } = useQuery({
    queryKey: ['clientes-select'],
    queryFn: () => clienteApi.listar(undefined, 0, 100),
  })

  const { data: materialDisponible } = useQuery({
    queryKey: ['material-disponible'],
    queryFn: () => materialApi.listar({ estado: 'DISPONIBLE', size: 200 }),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: EventoRequest) => eventoApi.crear(data),
    onSuccess: (evento) => {
      toast.success('Evento creado')
      onExito(evento.id)
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al crear el evento'),
  })

  const agregarMaterial = () => {
    const id = Number(materialSeleccionado)
    if (!id) return
    const mat = materialDisponible?.contenido.find((m) => m.id === id)
    if (!mat) return
    if (lineas.some((l) => l.materialId === id)) {
      toast.error('El material ya está añadido')
      return
    }
    setLineas((prev) => [...prev, { materialId: id, cantidad: 1, material: mat }])
    setMaterialSeleccionado('')
  }

  const quitarLinea = (materialId: number) =>
    setLineas((prev) => prev.filter((l) => l.materialId !== materialId))

  const onSubmit = (data: EventoRequest) => {
    mutate({
      ...data,
      lineas: lineas.map(({ materialId, cantidad, observaciones }) => ({
        materialId, cantidad, observaciones,
      })),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Nombre del evento *"
            placeholder="Ej: Festival Rock 2026"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
        </div>

        <Select
          label="Cliente *"
          error={errors.clienteId?.message}
          {...register('clienteId', { required: 'Selecciona un cliente', valueAsNumber: true })}
        >
          <option value="">Seleccionar cliente...</option>
          {clientes?.contenido.map((c) => (
            <option key={c.id} value={c.id}>{c.razonSocial}</option>
          ))}
        </Select>

        <Input
          label="Lugar"
          placeholder="Ej: Auditorio Municipal"
          {...register('lugar')}
        />

        <Input
          label="Fecha inicio *"
          type="datetime-local"
          error={errors.fechaInicio?.message}
          {...register('fechaInicio', { required: 'La fecha de inicio es obligatoria' })}
        />

        <Input
          label="Fecha fin"
          type="datetime-local"
          {...register('fechaFin')}
        />

        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 block mb-1">Observaciones</label>
          <textarea
            rows={2}
            className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('observaciones')}
          />
        </div>
      </div>

      {/* Asignación de material */}
      <div className="border-t dark:border-zinc-800 pt-4">
        <h3 className="font-semibold text-gray-800 dark:text-zinc-200 mb-3">Material asignado</h3>

        <div className="flex gap-2 mb-3">
          <select
            value={materialSeleccionado}
            onChange={(e) => setMaterialSeleccionado(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar material disponible...</option>
            {materialDisponible?.contenido
              .filter((m) => !lineas.some((l) => l.materialId === m.id))
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.numeroSerie ? `· ${m.numeroSerie}` : ''}
                </option>
              ))}
          </select>
          <Button type="button" variante="secundario" onClick={agregarMaterial}>
            <Plus className="h-4 w-4" />
            Añadir
          </Button>
        </div>

        {lineas.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-4 border border-dashed dark:border-zinc-700 rounded-lg">
            Sin material asignado — puedes añadirlo ahora o más tarde
          </p>
        )}

        {lineas.length > 0 && (
          <div className="space-y-2">
            {lineas.map((l) => (
              <div key={l.materialId} className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{l.material.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <EstadoBadge estado={l.material.estado} />
                    {l.material.numeroSerie && (
                      <span className="text-xs text-gray-400 font-mono">{l.material.numeroSerie}</span>
                    )}
                  </div>
                </div>
                <input
                  type="number"
                  min={1}
                  value={l.cantidad}
                  onChange={(e) =>
                    setLineas((prev) =>
                      prev.map((x) =>
                        x.materialId === l.materialId ? { ...x, cantidad: Number(e.target.value) } : x
                      )
                    )
                  }
                  className="w-16 text-center rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => quitarLinea(l.materialId)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
        <Button type="submit" cargando={isPending}>
          Crear evento
        </Button>
      </div>
    </form>
  )
}
