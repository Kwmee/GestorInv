import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/authStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { LoginRequest } from '@/types'

export function Login() {
  const navigate = useNavigate()
  const { iniciarSesion } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>()

  const { mutate: login, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      iniciarSesion(data.token, data.usuario)
      navigate('/')
    },
    onError: () => toast.error('Credenciales incorrectas'),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e264a] to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">GestorInventario</h1>
          <p className="text-sm text-gray-500 mt-1">Empresa de Sonido</p>
        </div>

        <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="admin@empresa.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'El email es obligatorio',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
            })}
          />

          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'La contraseña es obligatoria' })}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            tamano="lg"
            cargando={isPending}
          >
            Acceder
          </Button>
        </form>
      </div>
    </div>
  )
}
