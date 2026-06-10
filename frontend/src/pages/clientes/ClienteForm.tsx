import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { clienteApi } from '@/api/cliente.api'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { Cliente, ClienteRequest } from '@/types'

interface Props {
  cliente: Cliente | null
  onExito: () => void
}

export function ClienteForm({ cliente, onExito }: Props) {
  const esEdicion = !!cliente

  const { register, handleSubmit, formState: { errors } } = useForm<ClienteRequest>({
    defaultValues: cliente
      ? {
          razonSocial: cliente.razonSocial,
          nifCif: cliente.nifCif,
          telefono: cliente.telefono,
          email: cliente.email,
          direccion: cliente.direccion,
          tipo: cliente.tipo,
        }
      : { tipo: 'EMPRESA' },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ClienteRequest) =>
      esEdicion ? clienteApi.actualizar(cliente!.id, data) : clienteApi.crear(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Cliente actualizado' : 'Cliente creado')
      onExito()
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al guardar'),
  })

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
      <Input
        label="Razón social / Nombre *"
        placeholder="Ej: Eventos Madrid S.L."
        error={errors.razonSocial?.message}
        {...register('razonSocial', { required: 'La razón social es obligatoria' })}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="NIF / CIF"
          placeholder="Ej: B12345678"
          {...register('nifCif')}
        />
        <Select label="Tipo" {...register('tipo')}>
          <option value="EMPRESA">Empresa</option>
          <option value="PARTICULAR">Particular</option>
        </Select>

        <Input
          label="Teléfono"
          type="tel"
          placeholder="+34 600 000 000"
          {...register('telefono')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="contacto@empresa.com"
          error={errors.email?.message}
          {...register('email', {
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
          })}
        />
      </div>

      <Input
        label="Dirección"
        placeholder="Calle, número, localidad..."
        {...register('direccion')}
      />

      <div className="flex justify-end pt-2 border-t">
        <Button type="submit" cargando={isPending}>
          {esEdicion ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
      </div>
    </form>
  )
}
