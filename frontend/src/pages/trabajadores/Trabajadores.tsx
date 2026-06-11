import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { UserPlus, UserX } from 'lucide-react'
import { trabajadorApi } from '@/api/trabajador.api'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { useForm } from 'react-hook-form'

export function Trabajadores() {
  const queryClient = useQueryClient()
  const [modalNuevo, setModalNuevo] = useState(false)

  const { data: trabajadores, isLoading } = useQuery({
    queryKey: ['trabajadores'],
    queryFn: trabajadorApi.listar,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ nombre: string }>()

  const { mutate: crear, isPending: creando } = useMutation({
    mutationFn: (nombre: string) => trabajadorApi.crear(nombre),
    onSuccess: () => {
      toast.success('Trabajador añadido')
      queryClient.invalidateQueries({ queryKey: ['trabajadores'] })
      setModalNuevo(false)
      reset()
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al crear trabajador'),
  })

  const { mutate: desactivar } = useMutation({
    mutationFn: (id: number) => trabajadorApi.desactivar(id),
    onSuccess: () => {
      toast.success('Trabajador desactivado')
      queryClient.invalidateQueries({ queryKey: ['trabajadores'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error'),
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Trabajadores</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">
            Personas que aparecerán en albaranes y listas de carga
          </p>
        </div>
        <Button onClick={() => setModalNuevo(true)}>
          <UserPlus className="h-4 w-4" />
          Añadir trabajador
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
          </div>
        ) : trabajadores?.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-zinc-500 py-12">
            No hay trabajadores. Añade el primero.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Nombre</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {trabajadores?.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-zinc-100">{t.nombre}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      t.activo
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-500'
                    }`}>
                      {t.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {t.activo && (
                      <button
                        onClick={() => desactivar(t.id)}
                        title="Desactivar"
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        abierto={modalNuevo}
        titulo="Añadir trabajador"
        onCerrar={() => { setModalNuevo(false); reset() }}
        tamano="sm"
      >
        <form
          onSubmit={handleSubmit((data) => crear(data.nombre))}
          className="space-y-4"
        >
          <Input
            label="Nombre *"
            placeholder="Ej: Juan García"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variante="secundario"
              onClick={() => { setModalNuevo(false); reset() }}
            >
              Cancelar
            </Button>
            <Button type="submit" cargando={creando}>
              Añadir
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
