import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Search, Pencil, Trash2, FileDown } from 'lucide-react'
import { descargarBlob } from '@/lib/descargar'
import { materialApi } from '@/api/material.api'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import { Paginacion } from '@/components/ui/Paginacion'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { MaterialForm } from './MaterialForm'
import type { Material } from '@/types'

export function InventarioListado() {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<string>(searchParams.get('estado') ?? '')
  const [categoriaId, setCategoriaId] = useState<string>('')

  const [modalAbierto, setModalAbierto] = useState(false)
  const [materialEditar, setMaterialEditar] = useState<Material | null>(null)
  const [confirmarBaja, setConfirmarBaja] = useState<Material | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['material', { pagina, busqueda, estado, categoriaId }],
    queryFn: () => materialApi.listar({
      page: pagina,
      q: busqueda || undefined,
      estado: estado || undefined,
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
    }),
  })

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: materialApi.listarCategorias,
  })

  const { mutate: darDeBaja, isPending: dandoDeBaja } = useMutation({
    mutationFn: (id: number) => materialApi.darDeBaja(id),
    onSuccess: () => {
      toast.success('Material dado de baja')
      queryClient.invalidateQueries({ queryKey: ['material'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setConfirmarBaja(null)
    },
    onError: () => toast.error('No se pudo dar de baja el material'),
  })

  const abrirCrear = () => { setMaterialEditar(null); setModalAbierto(true) }
  const abrirEditar = (m: Material) => { setMaterialEditar(m); setModalAbierto(true) }

  const exportarPdf = async () => {
    try {
      const blob = await materialApi.listadoPdf({
        estado: estado || undefined,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        q: busqueda || undefined,
      })
      descargarBlob(blob, 'inventario.pdf')
    } catch {
      toast.error('No se pudo generar el PDF')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Inventario</h2>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">
            {data ? `${data.totalElementos} ítems` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variante="secundario" onClick={exportarPdf}>
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={abrirCrear}>
            <Plus className="h-4 w-4" />
            Nuevo material
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        {/* Filtros */}
        <div className="px-4 py-3 border-b flex flex-wrap gap-3" style={{ borderColor: 'var(--card-border)' }}>
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <input
              placeholder="Buscar por nombre, marca o modelo..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(0) }}
              className="w-full pl-9 pr-3 h-9 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-shadow"
            />
          </div>
          <Select
            value={estado}
            onChange={(e) => { setEstado(e.target.value); setPagina(0) }}
            className="w-44"
          >
            <option value="">Todos los estados</option>
            <option value="DISPONIBLE">Disponible</option>
            <option value="EN_EVENTO">En evento</option>
            <option value="EN_REPARACION">En reparación</option>
            <option value="BAJA">Baja</option>
          </Select>
          <Select
            value={categoriaId}
            onChange={(e) => { setCategoriaId(e.target.value); setPagina(0) }}
            className="w-44"
          >
            <option value="">Todas las categorías</option>
            {categorias?.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </Select>
        </div>
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-10 rounded-md" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b" style={{ background: 'var(--muted)', borderColor: 'var(--card-border)' }}>
              <tr>
                <th className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Nombre</th>
                <th className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Categoría</th>
                <th className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Marca / Modelo</th>
                <th className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Nº Serie</th>
                <th className="px-4 py-2.5 text-left text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Estado</th>
                <th className="px-4 py-2.5 text-right text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Cant.</th>
                <th className="px-4 py-2.5 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {data?.contenido.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-zinc-400 dark:text-zinc-500">
                    No se encontró material con los filtros aplicados
                  </td>
                </tr>
              )}
              {data?.contenido.map((m) => (
                <tr key={m.id} className="h-10 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 font-medium text-zinc-900 dark:text-zinc-100">{m.nombre}</td>
                  <td className="px-4 text-zinc-500 dark:text-zinc-400">{m.categoria.nombre}</td>
                  <td className="px-4 text-zinc-500 dark:text-zinc-400">
                    {[m.marca, m.modelo].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-4 text-zinc-400 dark:text-zinc-500 font-mono text-xs">
                    {m.numeroSerie ?? '—'}
                  </td>
                  <td className="px-4">
                    <EstadoBadge estado={m.estado} />
                  </td>
                  <td className="px-4 text-zinc-600 dark:text-zinc-400 text-right tabular">{m.cantidad}</td>
                  <td className="px-4">
                    <div className="flex items-center gap-0.5 justify-end">
                      <button
                        onClick={() => abrirEditar(m)}
                        className="p-1.5 text-zinc-300 dark:text-zinc-600 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmarBaja(m)}
                        disabled={m.estado === 'EN_EVENTO'}
                        className="p-1.5 text-zinc-300 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Dar de baja"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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

      {/* Modal crear/editar */}
      <Modal
        abierto={modalAbierto}
        titulo={materialEditar ? 'Editar material' : 'Nuevo material'}
        onCerrar={() => setModalAbierto(false)}
        tamano="lg"
      >
        <MaterialForm
          material={materialEditar}
          categorias={categorias ?? []}
          onExito={() => {
            setModalAbierto(false)
            queryClient.invalidateQueries({ queryKey: ['material'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          }}
        />
      </Modal>

      {/* Confirmar baja */}
      <ConfirmDialog
        abierto={!!confirmarBaja}
        titulo="Dar de baja material"
        mensaje={`¿Seguro que quieres dar de baja "${confirmarBaja?.nombre}"? Esta acción cambiará su estado a BAJA.`}
        textoConfirmar="Dar de baja"
        cargando={dandoDeBaja}
        onConfirmar={() => confirmarBaja && darDeBaja(confirmarBaja.id)}
        onCancelar={() => setConfirmarBaja(null)}
      />
    </div>
  )
}
