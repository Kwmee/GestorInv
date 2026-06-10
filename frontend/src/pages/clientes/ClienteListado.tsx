import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Plus, Search, Pencil, Trash2, Building2, User } from 'lucide-react'
import { clienteApi } from '@/api/cliente.api'
import { Button } from '@/components/ui/Button'
import { Paginacion } from '@/components/ui/Paginacion'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { ClienteForm } from './ClienteForm'
import type { Cliente } from '@/types'

export function ClienteListado() {
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null)
  const [confirmarDesactivar, setConfirmarDesactivar] = useState<Cliente | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['clientes', { pagina, busqueda }],
    queryFn: () => clienteApi.listar(busqueda || undefined, pagina),
  })

  const { mutate: desactivar, isPending: desactivando } = useMutation({
    mutationFn: (id: number) => clienteApi.desactivar(id),
    onSuccess: () => {
      toast.success('Cliente desactivado')
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
      setConfirmarDesactivar(null)
    },
    onError: () => toast.error('No se pudo desactivar el cliente'),
  })

  const abrirCrear  = () => { setClienteEditar(null); setModalAbierto(true) }
  const abrirEditar = (c: Cliente) => { setClienteEditar(c); setModalAbierto(true) }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Clientes</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            {data ? `${data.totalElementos} clientes` : ''}
          </p>
        </div>
        <Button onClick={abrirCrear}>
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
          <input
            placeholder="Buscar por nombre o NIF/CIF..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPagina(0) }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Razón social</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">NIF/CIF</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Teléfono</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Tipo</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {data?.contenido.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400 dark:text-zinc-500">
                    No se encontraron clientes
                  </td>
                </tr>
              )}
              {data?.contenido.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">{c.razonSocial}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-zinc-400 font-mono text-xs">{c.nifCif ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">{c.telefono ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-zinc-400">{c.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-500">
                      {c.tipo === 'EMPRESA'
                        ? <><Building2 className="h-3.5 w-3.5" /> Empresa</>
                        : <><User className="h-3.5 w-3.5" /> Particular</>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => abrirEditar(c)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmarDesactivar(c)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
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

      <Modal
        abierto={modalAbierto}
        titulo={clienteEditar ? 'Editar cliente' : 'Nuevo cliente'}
        onCerrar={() => setModalAbierto(false)}
      >
        <ClienteForm
          cliente={clienteEditar}
          onExito={() => {
            setModalAbierto(false)
            queryClient.invalidateQueries({ queryKey: ['clientes'] })
          }}
        />
      </Modal>

      <ConfirmDialog
        abierto={!!confirmarDesactivar}
        titulo="Desactivar cliente"
        mensaje={`¿Desactivar a "${confirmarDesactivar?.razonSocial}"?`}
        textoConfirmar="Desactivar"
        cargando={desactivando}
        onConfirmar={() => confirmarDesactivar && desactivar(confirmarDesactivar.id)}
        onCancelar={() => setConfirmarDesactivar(null)}
      />
    </div>
  )
}
