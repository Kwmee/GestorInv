import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import { presupuestoApi } from '@/api/presupuesto.api'
import { materialApi } from '@/api/material.api'
import { clienteApi } from '@/api/cliente.api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { Presupuesto, LineaPresupuesto } from '@/types'
import { format } from 'date-fns'

interface LineaForm {
  materialId: number
  cantidad: number
  precioUnitario: string
  descripcion: string
}

interface Props {
  presupuesto: Presupuesto | null
  onExito: () => void
}

export default function PresupuestoForm({ presupuesto, onExito }: Props) {
  const { data: clientes } = useQuery({
    queryKey: ['clientes-todos'],
    queryFn: () => clienteApi.listar({ size: 200 }).then(r => r.contenido),
  })
  const { data: materiales } = useQuery({
    queryKey: ['material-todos'],
    queryFn: () => materialApi.listar({ size: 200 }).then(r => r.contenido),
  })

  const [clienteId, setClienteId] = useState(presupuesto?.cliente.id ?? 0)
  const [fechaEmision, setFechaEmision] = useState(presupuesto?.fechaEmision ?? format(new Date(), 'yyyy-MM-dd'))
  const [fechaValidez, setFechaValidez] = useState(presupuesto?.fechaValidez ?? '')
  const [notas, setNotas] = useState(presupuesto?.notas ?? '')
  const [lineas, setLineas] = useState<LineaForm[]>(
    presupuesto?.lineas.map(l => ({
      materialId: l.material.id,
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario.toString(),
      descripcion: l.descripcion ?? '',
    })) ?? [{ materialId: 0, cantidad: 1, precioUnitario: '', descripcion: '' }]
  )

  const agregarLinea = () =>
    setLineas(p => [...p, { materialId: 0, cantidad: 1, precioUnitario: '', descripcion: '' }])

  const quitarLinea = (i: number) => setLineas(p => p.filter((_, idx) => idx !== i))

  const actualizarLinea = (i: number, campo: keyof LineaForm, valor: string | number) =>
    setLineas(p => p.map((l, idx) => idx === i ? { ...l, [campo]: valor } : l))

  const autocompletarPrecio = (i: number, materialId: number) => {
    const mat = materiales?.find(m => m.id === materialId)
    if (mat?.precio) {
      setLineas(p => p.map((l, idx) => idx === i ? { ...l, materialId, precioUnitario: mat.precio!.toString() } : l))
    } else {
      actualizarLinea(i, 'materialId', materialId)
    }
  }

  const total = lineas.reduce((acc, l) => acc + (l.cantidad * (parseFloat(l.precioUnitario) || 0)), 0)

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        clienteId: Number(clienteId),
        fechaEmision,
        fechaValidez: fechaValidez || undefined,
        notas: notas || undefined,
        lineas: lineas.filter(l => l.materialId > 0).map(l => ({
          materialId: Number(l.materialId),
          cantidad: Number(l.cantidad),
          precioUnitario: parseFloat(l.precioUnitario) || 0,
          descripcion: l.descripcion || undefined,
        })),
      }
      return presupuesto
        ? presupuestoApi.actualizar(presupuesto.id, payload)
        : presupuestoApi.crear(payload)
    },
    onSuccess: () => {
      toast.success(presupuesto ? 'Presupuesto actualizado' : 'Presupuesto creado')
      onExito()
    },
    onError: () => toast.error('Error al guardar el presupuesto'),
  })

  const euroFormat = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

  return (
    <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cliente *</label>
          <Select value={clienteId} onChange={e => setClienteId(Number(e.target.value))} required>
            <option value={0}>Selecciona cliente...</option>
            {clientes?.map(c => <option key={c.id} value={c.id}>{c.razonSocial}</option>)}
          </Select>
        </div>
        <Input label="Fecha emisión *" type="date" value={fechaEmision}
          onChange={e => setFechaEmision(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Fecha validez" type="date" value={fechaValidez}
          onChange={e => setFechaValidez(e.target.value)} />
        <Input label="Notas" value={notas} onChange={e => setNotas(e.target.value)} />
      </div>

      {/* Líneas */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Líneas del presupuesto</p>
          <button type="button" onClick={agregarLinea}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <Plus className="h-3.5 w-3.5" /> Añadir línea
          </button>
        </div>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
          <table className="w-full text-sm">
            <thead style={{ background: 'var(--muted)' }}>
              <tr className="border-b" style={{ borderColor: 'var(--card-border)' }}>
                <th className="px-3 py-2 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-widest">Equipo/Material</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-widest w-20">Cant.</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-widest w-28">Precio/ud</th>
                <th className="px-3 py-2 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-widest">Descripción</th>
                <th className="px-3 py-2 text-right text-2xs font-semibold text-zinc-400 uppercase tracking-widest w-24">Subtotal</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {lineas.map((l, i) => (
                <tr key={i}>
                  <td className="px-2 py-1.5">
                    <Select value={l.materialId} onChange={e => autocompletarPrecio(i, Number(e.target.value))} required>
                      <option value={0}>Selecciona...</option>
                      {materiales?.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </Select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" min={1} value={l.cantidad}
                      onChange={e => actualizarLinea(i, 'cantidad', Number(e.target.value))}
                      className="w-full h-8 rounded border border-zinc-200 dark:border-zinc-700 px-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 tabular" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" min={0} step="0.01" value={l.precioUnitario}
                      onChange={e => actualizarLinea(i, 'precioUnitario', e.target.value)}
                      className="w-full h-8 rounded border border-zinc-200 dark:border-zinc-700 px-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 tabular" />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={l.descripcion} onChange={e => actualizarLinea(i, 'descripcion', e.target.value)}
                      className="w-full h-8 rounded border border-zinc-200 dark:border-zinc-700 px-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      placeholder="Descripción opcional" />
                  </td>
                  <td className="px-3 py-1.5 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300 tabular">
                    {euroFormat.format(l.cantidad * (parseFloat(l.precioUnitario) || 0))}
                  </td>
                  <td className="px-1 py-1.5">
                    {lineas.length > 1 && (
                      <button type="button" onClick={() => quitarLinea(i)}
                        className="p-1 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-2 pr-8">
          <div className="text-right">
            <p className="text-2xs text-zinc-400 uppercase tracking-widest font-semibold">Total</p>
            <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tabular">{euroFormat.format(total)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" cargando={mutation.isPending} disabled={clienteId === 0 || lineas.every(l => l.materialId === 0)}>
          {presupuesto ? 'Guardar cambios' : 'Crear presupuesto'}
        </Button>
      </div>
    </form>
  )
}
