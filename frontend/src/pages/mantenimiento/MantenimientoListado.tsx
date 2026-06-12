import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Wrench, Pencil, Trash2 } from 'lucide-react'
import { mantenimientoApi } from '@/api/mantenimiento.api'
import { materialApi } from '@/api/material.api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import { Select } from '@/components/ui/Select'
import type { Mantenimiento, EstadoMantenimiento } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const ETIQUETAS_ESTADO: Record<EstadoMantenimiento, string> = {
  EN_REVISION: 'En revisión', REPARANDO: 'Reparando',
  REPARADO: 'Reparado', IRREPARABLE: 'Irreparable',
}

function MantenimientoForm({ item, onExito }: { item: Mantenimiento | null; onExito: () => void }) {
  const { data: materiales } = useQuery({
    queryKey: ['material', { page: 0, size: 200 }],
    queryFn: () => materialApi.listar({ size: 200 }),
  })

  const qc = useQueryClient()
  const [form, setForm] = useState({
    materialId: item?.material.id ?? 0,
    fechaEntrada: item?.fechaEntrada ?? format(new Date(), 'yyyy-MM-dd'),
    fechaSalida: item?.fechaSalida ?? '',
    descripcion: item?.descripcion ?? '',
    tecnicoExterno: item?.tecnicoExterno ?? '',
    coste: item?.coste?.toString() ?? '',
    estado: item?.estado ?? 'EN_REVISION' as EstadoMantenimiento,
    observaciones: item?.observaciones ?? '',
  })

  const mutation = useMutation({
    mutationFn: () => item
      ? mantenimientoApi.actualizar(item.id, { ...form, materialId: Number(form.materialId), coste: form.coste ? Number(form.coste) : undefined })
      : mantenimientoApi.crear({ ...form, materialId: Number(form.materialId), coste: form.coste ? Number(form.coste) : undefined }),
    onSuccess: () => {
      toast.success(item ? 'Registro actualizado' : 'Registro creado')
      qc.invalidateQueries({ queryKey: ['mantenimiento'] })
      qc.invalidateQueries({ queryKey: ['material'] })
      onExito()
    },
    onError: () => toast.error('Error al guardar'),
  })

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <form onSubmit={e => { e.preventDefault(); mutation.mutate() }} className="space-y-4">
      {!item && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Equipo *</label>
          <Select value={form.materialId} onChange={f('materialId')} required>
            <option value={0}>Selecciona equipo...</option>
            {materiales?.contenido.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} {m.marca ? `— ${m.marca}` : ''}</option>
            ))}
          </Select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Fecha entrada *" type="date" value={form.fechaEntrada} onChange={f('fechaEntrada')} required />
        <Input label="Fecha salida" type="date" value={form.fechaSalida} onChange={f('fechaSalida')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descripción *</label>
        <textarea
          className="h-20 rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          value={form.descripcion} onChange={f('descripcion')} required
          placeholder="Descripción de la avería o revisión..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Técnico externo" value={form.tecnicoExterno} onChange={f('tecnicoExterno')} placeholder="Empresa o nombre" />
        <Input label="Coste (€)" type="number" min="0" step="0.01" value={form.coste} onChange={f('coste')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Estado</label>
        <Select value={form.estado} onChange={f('estado')}>
          {Object.entries(ETIQUETAS_ESTADO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      </div>
      <Input label="Observaciones" value={form.observaciones} onChange={f('observaciones')} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" cargando={mutation.isPending}>
          {item ? 'Guardar cambios' : 'Crear registro'}
        </Button>
      </div>
    </form>
  )
}

export function MantenimientoListado() {
  const qc = useQueryClient()
  const [materialFiltro, setMaterialFiltro] = useState<number | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Mantenimiento | null>(null)
  const [eliminando, setEliminando] = useState<Mantenimiento | null>(null)

  const { data: materiales } = useQuery({
    queryKey: ['material-todos'],
    queryFn: () => materialApi.listar({ size: 200 }),
  })

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['mantenimiento', materialFiltro],
    queryFn: () => materialFiltro
      ? mantenimientoApi.listarPorMaterial(materialFiltro)
      : Promise.resolve([] as Mantenimiento[]),
    enabled: materialFiltro !== null,
  })

  const { data: todos = [], isLoading: cargandoTodos } = useQuery({
    queryKey: ['mantenimiento-todos'],
    queryFn: async () => {
      const mats = await materialApi.listar({ estado: 'EN_REPARACION', size: 100 })
      const lists = await Promise.all(mats.contenido.map(m => mantenimientoApi.listarPorMaterial(m.id)))
      return lists.flat().sort((a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime())
    },
    enabled: materialFiltro === null,
  })

  const { mutate: eliminar, isPending: eliminandoPend } = useMutation({
    mutationFn: (id: number) => mantenimientoApi.eliminar(id),
    onSuccess: () => {
      toast.success('Registro eliminado')
      qc.invalidateQueries({ queryKey: ['mantenimiento'] })
      qc.invalidateQueries({ queryKey: ['mantenimiento-todos'] })
      setEliminando(null)
    },
    onError: () => toast.error('Error al eliminar'),
  })

  const datos = materialFiltro ? registros : todos
  const cargando = materialFiltro ? isLoading : cargandoTodos

  const abrirCrear = () => { setEditando(null); setModalAbierto(true) }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Mantenimiento</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">Historial de reparaciones y revisiones</p>
        </div>
        <Button onClick={abrirCrear}>
          <Plus className="h-4 w-4" />
          Nuevo registro
        </Button>
      </div>

      {/* Filtro */}
      <div className="rounded-xl border p-4 flex gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <Select
          className="w-72"
          value={materialFiltro ?? ''}
          onChange={e => setMaterialFiltro(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Todos los equipos en reparación</option>
          {materiales?.contenido.map(m => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </Select>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        {cargando ? (
          <div className="p-4 space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded-md" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b" style={{ background: 'var(--muted)', borderColor: 'var(--card-border)' }}>
              <tr>
                {['Equipo', 'Entrada', 'Salida', 'Descripción', 'Técnico', 'Coste', 'Estado', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {datos.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-zinc-400">
                  <Wrench className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No hay registros de mantenimiento
                </td></tr>
              )}
              {datos.map(r => (
                <tr key={r.id} className="h-10 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 font-medium text-zinc-900 dark:text-zinc-100">{r.material.nombre}</td>
                  <td className="px-4 text-zinc-500 tabular">{format(new Date(r.fechaEntrada), 'dd/MM/yyyy')}</td>
                  <td className="px-4 text-zinc-500 tabular">{r.fechaSalida ? format(new Date(r.fechaSalida), 'dd/MM/yyyy') : '—'}</td>
                  <td className="px-4 text-zinc-500 max-w-[200px] truncate">{r.descripcion}</td>
                  <td className="px-4 text-zinc-400">{r.tecnicoExterno ?? '—'}</td>
                  <td className="px-4 text-zinc-600 tabular">{r.coste != null ? `${r.coste.toFixed(2)} €` : '—'}</td>
                  <td className="px-4"><EstadoBadge estado={r.estado} /></td>
                  <td className="px-4">
                    <div className="flex gap-0.5 justify-end">
                      <button onClick={() => { setEditando(r); setModalAbierto(true) }}
                        className="p-1.5 text-zinc-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setEliminando(r)}
                        className="p-1.5 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal abierto={modalAbierto} titulo={editando ? 'Editar registro' : 'Nuevo registro de mantenimiento'} onCerrar={() => setModalAbierto(false)}>
        <MantenimientoForm item={editando} onExito={() => setModalAbierto(false)} />
      </Modal>

      <ConfirmDialog
        abierto={!!eliminando}
        titulo="Eliminar registro"
        mensaje={`¿Eliminar el registro de "${eliminando?.material.nombre}"?`}
        textoConfirmar="Eliminar"
        cargando={eliminandoPend}
        onConfirmar={() => eliminando && eliminar(eliminando.id)}
        onCancelar={() => setEliminando(null)}
      />
    </div>
  )
}
