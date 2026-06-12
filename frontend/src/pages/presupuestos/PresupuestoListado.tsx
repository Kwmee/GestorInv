import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, FileText, Pencil, Trash2, Send, CheckCircle, XCircle } from 'lucide-react'
import { presupuestoApi } from '@/api/presupuesto.api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Select } from '@/components/ui/Select'
import { Paginacion } from '@/components/ui/Paginacion'
import type { Presupuesto, EstadoPresupuesto } from '@/types'
import { format } from 'date-fns'
import PresupuestoForm from './PresupuestoForm'
import clsx from 'clsx'

const BADGE_ESTADO: Record<EstadoPresupuesto, string> = {
  BORRADOR:  'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  ENVIADO:   'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  ACEPTADO:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  RECHAZADO: 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400',
  EXPIRADO:  'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
}

const ETIQUETA_ESTADO: Record<EstadoPresupuesto, string> = {
  BORRADOR: 'Borrador', ENVIADO: 'Enviado', ACEPTADO: 'Aceptado', RECHAZADO: 'Rechazado', EXPIRADO: 'Expirado',
}

export function PresupuestoListado() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [pagina, setPagina] = useState(0)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Presupuesto | null>(null)
  const [eliminando, setEliminando] = useState<Presupuesto | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['presupuestos', pagina],
    queryFn: () => presupuestoApi.listar(pagina),
  })

  const { mutate: cambiarEstado } = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPresupuesto }) =>
      presupuestoApi.cambiarEstado(id, estado),
    onSuccess: () => {
      toast.success('Estado actualizado')
      qc.invalidateQueries({ queryKey: ['presupuestos'] })
    },
    onError: () => toast.error('Error al cambiar estado'),
  })

  const { mutate: eliminar, isPending: eliminandoPend } = useMutation({
    mutationFn: (id: number) => presupuestoApi.eliminar(id),
    onSuccess: () => {
      toast.success('Presupuesto eliminado')
      qc.invalidateQueries({ queryKey: ['presupuestos'] })
      setEliminando(null)
    },
    onError: () => toast.error('Solo se pueden eliminar borradores'),
  })

  const abrirCrear = () => { setEditando(null); setModalAbierto(true) }

  const contenido = (data?.contenido ?? []).filter(p => !filtroEstado || p.estado === filtroEstado)

  const euroFormat = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Presupuestos</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {data ? `${data.totalElementos} presupuestos` : ''}
          </p>
        </div>
        <Button onClick={abrirCrear}>
          <Plus className="h-4 w-4" />
          Nuevo presupuesto
        </Button>
      </div>

      {/* Filtros */}
      <div className="rounded-xl border p-4 flex gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <Select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className="w-48">
          <option value="">Todos los estados</option>
          {Object.entries(ETIQUETA_ESTADO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </Select>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-10 rounded-md" />)}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b" style={{ background: 'var(--muted)', borderColor: 'var(--card-border)' }}>
              <tr>
                {['Número', 'Cliente', 'Fecha', 'Válido hasta', 'Estado', 'Total', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {contenido.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-zinc-400">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No hay presupuestos
                </td></tr>
              )}
              {contenido.map(p => (
                <tr key={p.id} className="h-10 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/presupuestos/${p.id}`)}>
                  <td className="px-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">{p.numero}</td>
                  <td className="px-4 font-medium text-zinc-900 dark:text-zinc-100">{p.cliente.razonSocial}</td>
                  <td className="px-4 text-zinc-500 tabular">{format(new Date(p.fechaEmision), 'dd/MM/yyyy')}</td>
                  <td className="px-4 text-zinc-500 tabular">{p.fechaValidez ? format(new Date(p.fechaValidez), 'dd/MM/yyyy') : '—'}</td>
                  <td className="px-4">
                    <span className={clsx('inline-flex px-2 py-0.5 rounded text-xs font-medium', BADGE_ESTADO[p.estado])}>
                      {ETIQUETA_ESTADO[p.estado]}
                    </span>
                  </td>
                  <td className="px-4 text-zinc-700 dark:text-zinc-300 font-medium tabular">{euroFormat.format(p.total)}</td>
                  <td className="px-4" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-0.5 justify-end">
                      {p.estado === 'BORRADOR' && (
                        <>
                          <button onClick={() => cambiarEstado({ id: p.id, estado: 'ENVIADO' })}
                            className="p-1.5 text-zinc-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Marcar como enviado">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => { setEditando(p); setModalAbierto(true) }}
                            className="p-1.5 text-zinc-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setEliminando(p)}
                            className="p-1.5 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {p.estado === 'ENVIADO' && (
                        <>
                          <button onClick={() => cambiarEstado({ id: p.id, estado: 'ACEPTADO' })}
                            className="p-1.5 text-zinc-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Marcar aceptado">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => cambiarEstado({ id: p.id, estado: 'RECHAZADO' })}
                            className="p-1.5 text-zinc-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Marcar rechazado">
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data && <Paginacion paginaActual={data.paginaActual} totalPaginas={data.totalPaginas} onCambiar={setPagina} />}
      </div>

      <Modal abierto={modalAbierto} titulo={editando ? 'Editar presupuesto' : 'Nuevo presupuesto'} onCerrar={() => setModalAbierto(false)} tamano="xl">
        <PresupuestoForm presupuesto={editando} onExito={() => { setModalAbierto(false); qc.invalidateQueries({ queryKey: ['presupuestos'] }) }} />
      </Modal>

      <ConfirmDialog
        abierto={!!eliminando}
        titulo="Eliminar presupuesto"
        mensaje={`¿Eliminar el presupuesto ${eliminando?.numero}?`}
        textoConfirmar="Eliminar"
        cargando={eliminandoPend}
        onConfirmar={() => eliminando && eliminar(eliminando.id)}
        onCancelar={() => setEliminando(null)}
      />
    </div>
  )
}
