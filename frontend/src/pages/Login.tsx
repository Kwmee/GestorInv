import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Package } from 'lucide-react'
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
    <div className="min-h-screen flex">
      {/* Panel izquierdo — marca */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-shrink-0 bg-[#18181b] flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Package className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-semibold text-[15px]">GestorInventario</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white leading-snug">
            Control total<br />de tu equipamiento
          </h2>
          <p className="text-zinc-400 mt-3 text-[14px] leading-relaxed">
            Gestiona inventario, eventos y logística de carga en un solo lugar.
            Diseñado para empresas de sonido e iluminación.
          </p>
        </div>

        <div className="flex gap-6">
          {[
            { valor: '100+', label: 'Equipos gestionados' },
            { valor: '0', label: 'Pérdidas de material' },
            { valor: '24/7', label: 'Acceso desde red local' },
          ].map(({ valor, label }) => (
            <div key={label}>
              <p className="text-white font-bold text-xl">{valor}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 bg-[#f5f4f2] dark:bg-[#09090b] flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] text-gray-900 dark:text-white">GestorInventario</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Acceder</h1>
            <p className="text-gray-500 dark:text-zinc-400 mt-1 text-sm">Introduce tus credenciales para continuar</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
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
                Entrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
