import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Upload, ImageOff } from 'lucide-react'
import { empresaApi } from '@/api/empresa.api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { EmpresaRequest } from '@/types'

export function Configuracion() {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [logoKey, setLogoKey] = useState(0)

  const { data: empresa } = useQuery({
    queryKey: ['empresa'],
    queryFn: empresaApi.obtener,
  })

  const form = useForm<EmpresaRequest>({
    values: empresa
      ? { nombre: empresa.nombre, direccion: empresa.direccion, telefono: empresa.telefono, email: empresa.email }
      : undefined,
  })

  const { mutate: guardar, isPending: guardando } = useMutation({
    mutationFn: (data: EmpresaRequest) => empresaApi.actualizar(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['empresa'], data)
      toast.success('Datos guardados')
    },
    onError: () => toast.error('Error al guardar los datos'),
  })

  const { mutate: subirLogo, isPending: subiendoLogo } = useMutation({
    mutationFn: (file: File) => empresaApi.subirLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa'] })
      setLogoKey(k => k + 1)
      toast.success('Logo actualizado')
    },
    onError: () => toast.error('Error al subir el logo'),
  })

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) subirLogo(file)
  }

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Configuración de empresa</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Esta información aparece en todos los albaranes PDF generados
        </p>
      </div>

      {/* Logo */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 dark:text-zinc-100 mb-4">Logo de empresa</h2>
        <div className="flex items-center gap-5">
          <div className="w-32 h-16 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
            {empresa?.tieneLogo ? (
              <img
                key={logoKey}
                src={`${empresaApi.logoUrl()}?t=${logoKey}`}
                alt="Logo empresa"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <ImageOff className="h-6 w-6 text-gray-300 dark:text-zinc-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-2">
              PNG o JPG. Se mostrará en la cabecera de los albaranes (100×40 px).
            </p>
            <Button
              type="button"
              variante="secundario"
              tamano="sm"
              cargando={subiendoLogo}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              {empresa?.tieneLogo ? 'Cambiar logo' : 'Subir logo'}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>
      </div>

      {/* Datos empresa */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 dark:text-zinc-100 mb-4">Datos de la empresa</h2>
        <form onSubmit={form.handleSubmit(d => guardar(d))} className="space-y-4">
          <Input
            label="Nombre *"
            placeholder="Ej: Sonido Madrid S.L."
            error={form.formState.errors.nombre?.message}
            {...form.register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input
            label="Dirección"
            placeholder="Calle, polígono, localidad..."
            {...form.register('direccion')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Teléfono"
              placeholder="+34 600 000 000"
              {...form.register('telefono')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="info@empresa.com"
              error={form.formState.errors.email?.message}
              {...form.register('email', {
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
              })}
            />
          </div>
          <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
            <Button type="submit" cargando={guardando}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
