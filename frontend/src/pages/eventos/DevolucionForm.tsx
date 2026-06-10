import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { eventoApi } from '@/api/evento.api'
import { Button } from '@/components/ui/Button'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import type { DevolucionRequest, Evento, EstadoDevolucion } from '@/types'

interface Props {
  evento: Evento
  onExito: () => void
}

type EstadoLinea = EstadoDevolucion

interface LineaDevolucion {
  materialId: number
  materialNombre: string
  estadoDevolucion: EstadoLinea
  observaciones: string
}

export function DevolucionForm({ evento, onExito }: Props) {
  const lineasPendientes = evento.lineas.filter((l) => l.estadoDevolucion === 'PENDIENTE')

  const [lineas, setLineas] = useState<LineaDevolucion[]>(
    lineasPendientes.map((l) => ({
      materialId: l.materialId,
      materialNombre: l.materialNombre,
      estadoDevolucion: 'OK',
      observaciones: '',
    }))
  )

  const { mutate, isPending } = useMutation({
    mutationFn: (data: DevolucionRequest) => eventoApi.registrarDevolucion(evento.id, data),
    onSuccess: (albaran) => {
      toast.success(`Devolución registrada · Albarán ${albaran.numero}`)
      onExito()
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al registrar devolución'),
  })

  const actualizarLinea = (materialId: number, campo: keyof LineaDevolucion, valor: string) => {
    setLineas((prev) =>
      prev.map((l) =>
        l.materialId === materialId ? { ...l, [campo]: valor } : l
      )
    )
  }

  const onSubmit = () => {
    mutate({ lineas: lineas.map(({ materialId, estadoDevolucion, observaciones }) => ({
      materialId, estadoDevolucion, observaciones: observaciones || undefined,
    })) })
  }

  if (lineasPendientes.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        No hay material pendiente de devolución en este evento.
      </p>
    )
  }

  const colorEstado: Record<EstadoLinea, string> = {
    PENDIENTE:      'border-gray-300',
    OK:             'border-green-400 bg-green-50',
    CON_INCIDENCIA: 'border-orange-400 bg-orange-50',
    NO_DEVUELTO:    'border-red-400 bg-red-50',
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Indica el estado de devolución de cada ítem. Se generará automáticamente el albarán de devolución.
      </p>

      <div className="space-y-3">
        {lineas.map((l) => (
          <div
            key={l.materialId}
            className={`rounded-lg border-2 p-4 transition-colors ${colorEstado[l.estadoDevolucion]}`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-900">{l.materialNombre}</p>
              <EstadoBadge estado={l.estadoDevolucion} />
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              {(['OK', 'CON_INCIDENCIA', 'NO_DEVUELTO'] as EstadoLinea[]).map((estado) => (
                <button
                  key={estado}
                  type="button"
                  onClick={() => actualizarLinea(l.materialId, 'estadoDevolucion', estado)}
                  className={`py-1.5 rounded text-xs font-medium border transition-colors ${
                    l.estadoDevolucion === estado
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {estado === 'OK' ? 'Devuelto OK' : estado === 'CON_INCIDENCIA' ? 'Con incidencia' : 'No devuelto'}
                </button>
              ))}
            </div>

            {l.estadoDevolucion !== 'OK' && (
              <input
                placeholder="Observaciones sobre el estado..."
                value={l.observaciones}
                onChange={(e) => actualizarLinea(l.materialId, 'observaciones', e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t">
        <Button onClick={onSubmit} cargando={isPending}>
          Registrar devolución y generar albarán
        </Button>
      </div>
    </div>
  )
}
