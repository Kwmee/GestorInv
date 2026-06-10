import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {data ? `${data.totalElementos} ítems` : ''}
          </p>
        </div>
        <Button onClick={abrirCrear}>
          <Plus className="h-4 w-4" />
          Nuevo material
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Buscar por nombre, marca o modelo..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPagina(0) }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Categoría</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Marca / Modelo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nº Serie</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Cant.</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.contenido.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No se encontró material con los filtros aplicados
                  </td>
                </tr>
              )}
              {data?.contenido.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{m.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{m.categoria.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {[m.marca, m.modelo].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {m.numeroSerie ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={m.estado} />
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-center">{m.cantidad}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => abrirEditar(m)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmarBaja(m)}
                        disabled={m.estado === 'EN_EVENTO'}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Dar de baja"
                      >
                        <Trash2 className="h-4 w-4" />
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
