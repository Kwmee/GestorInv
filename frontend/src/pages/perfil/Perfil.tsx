import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { usuarioApi } from '@/api/usuario.api'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { CambiarContrasenaRequest, PerfilRequest } from '@/types'

export function Perfil() {
  const { actualizarUsuario } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: perfil } = useQuery({
    queryKey: ['perfil'],
    queryFn: usuarioApi.obtenerPerfil,
  })

  const formPerfil = useForm<PerfilRequest>({
    values: perfil ? { nombre: perfil.nombre, email: perfil.email } : undefined,
  })

  const formContrasena = useForm<CambiarContrasenaRequest & { confirmar: string }>()

  const { mutate: guardarPerfil, isPending: guardandoPerfil } = useMutation({
    mutationFn: (data: PerfilRequest) => usuarioApi.actualizarPerfil(data),
    onSuccess: (data) => {
      actualizarUsuario({ nombre: data.nombre, email: data.email })
      queryClient.setQueryData(['perfil'], data)
      toast.success('Perfil actualizado')
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al guardar'),
  })

  const { mutate: cambiarContrasena, isPending: cambiandoContrasena } = useMutation({
    mutationFn: (data: CambiarContrasenaRequest) => usuarioApi.cambiarContrasena(data),
    onSuccess: () => {
      formContrasena.reset()
      toast.success('Contraseña actualizada')
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al cambiar la contraseña'),
  })

  const onSubmitContrasena = formContrasena.handleSubmit((data) => {
    if (data.contrasenaNueva !== data.confirmar) {
      formContrasena.setError('confirmar', { message: 'Las contraseñas no coinciden' })
      return
    }
    cambiarContrasena({ contrasenaActual: data.contrasenaActual, contrasenaNueva: data.contrasenaNueva })
  })

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Mi perfil</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Actualiza tu nombre, email y contraseña</p>
      </div>

      {/* Datos personales */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 dark:text-zinc-100 mb-4">Datos personales</h2>
        <form onSubmit={formPerfil.handleSubmit((d) => guardarPerfil(d))} className="space-y-4">
          <Input
            label="Nombre"
            placeholder="Tu nombre"
            error={formPerfil.formState.errors.nombre?.message}
            {...formPerfil.register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={formPerfil.formState.errors.email?.message}
            {...formPerfil.register('email', {
              required: 'El email es obligatorio',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
            })}
          />
          <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
            <Button type="submit" cargando={guardandoPerfil}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 dark:text-zinc-100 mb-4">Cambiar contraseña</h2>
        <form onSubmit={onSubmitContrasena} className="space-y-4">
          <Input
            label="Contraseña actual"
            type="password"
            placeholder="••••••••"
            error={formContrasena.formState.errors.contrasenaActual?.message}
            {...formContrasena.register('contrasenaActual', { required: 'Introduce tu contraseña actual' })}
          />
          <Input
            label="Nueva contraseña"
            type="password"
            placeholder="••••••••"
            error={formContrasena.formState.errors.contrasenaNueva?.message}
            {...formContrasena.register('contrasenaNueva', {
              required: 'Introduce la nueva contraseña',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            placeholder="••••••••"
            error={formContrasena.formState.errors.confirmar?.message}
            {...formContrasena.register('confirmar', { required: 'Confirma la nueva contraseña' })}
          />
          <div className="flex justify-end pt-2 border-t dark:border-zinc-800">
            <Button type="submit" cargando={cambiandoContrasena}>
              Cambiar contraseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
