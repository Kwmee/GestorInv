import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Sun, Moon, Upload, ImageOff, Wifi, WifiOff, Monitor } from 'lucide-react'
import { usuarioApi } from '@/api/usuario.api'
import { empresaApi } from '@/api/empresa.api'
import { redApi } from '@/api/red.api'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { CambiarContrasenaRequest, EmpresaRequest, PerfilRequest } from '@/types'

function Seccion({ titulo, descripcion, children }: { titulo: string; descripcion?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{titulo}</h2>
        {descripcion && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{descripcion}</p>}
      </div>
      {children}
    </div>
  )
}

export function Perfil() {
  const { usuario, actualizarUsuario } = useAuthStore()
  const { tema, toggleTema } = useThemeStore()
  const queryClient = useQueryClient()

  // ── Perfil personal ──────────────────────────────────────────
  const { data: perfil } = useQuery({
    queryKey: ['perfil'],
    queryFn: usuarioApi.obtenerPerfil,
  })

  const formPerfil = useForm<PerfilRequest>({
    values: perfil ? { nombre: perfil.nombre, email: perfil.email } : undefined,
  })

  const { mutate: guardarPerfil, isPending: guardandoPerfil } = useMutation({
    mutationFn: (data: PerfilRequest) => usuarioApi.actualizarPerfil(data),
    onSuccess: (data) => {
      actualizarUsuario({ nombre: data.nombre, email: data.email })
      queryClient.setQueryData(['perfil'], data)
      toast.success('Perfil actualizado')
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al guardar'),
  })

  // ── Contraseña ───────────────────────────────────────────────
  const formContrasena = useForm<CambiarContrasenaRequest & { confirmar: string }>()

  const { mutate: cambiarContrasena, isPending: cambiandoContrasena } = useMutation({
    mutationFn: (data: CambiarContrasenaRequest) => usuarioApi.cambiarContrasena(data),
    onSuccess: () => { formContrasena.reset(); toast.success('Contraseña actualizada') },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al cambiar la contraseña'),
  })

  const onSubmitContrasena = formContrasena.handleSubmit((data) => {
    if (data.contrasenaNueva !== data.confirmar) {
      formContrasena.setError('confirmar', { message: 'Las contraseñas no coinciden' })
      return
    }
    cambiarContrasena({ contrasenaActual: data.contrasenaActual, contrasenaNueva: data.contrasenaNueva })
  })

  // ── Empresa (solo ADMIN) ─────────────────────────────────────
  const esAdmin = usuario?.rol === 'ADMIN'
  const inputRef = useRef<HTMLInputElement>(null)
  const [logoKey, setLogoKey] = useState(0)
  const [reiniciando, setReiniciando] = useState(false)
  const [cuenta, setCuenta] = useState(0)

  const { data: empresa } = useQuery({
    queryKey: ['empresa'],
    queryFn: empresaApi.obtener,
    enabled: esAdmin,
  })

  const { data: red, isLoading: cargandoRed } = useQuery({
    queryKey: ['red-status'],
    queryFn: redApi.obtener,
    enabled: esAdmin,
  })

  const formEmpresa = useForm<EmpresaRequest>({
    values: empresa
      ? { nombre: empresa.nombre, direccion: empresa.direccion, telefono: empresa.telefono, email: empresa.email }
      : undefined,
  })

  const { mutate: guardarEmpresa, isPending: guardandoEmpresa } = useMutation({
    mutationFn: (data: EmpresaRequest) => empresaApi.actualizar(data),
    onSuccess: (data) => { queryClient.setQueryData(['empresa'], data); toast.success('Datos guardados') },
    onError: () => toast.error('Error al guardar los datos'),
  })

  const { mutate: subirLogo, isPending: subiendoLogo } = useMutation({
    mutationFn: (file: File) => empresaApi.subirLogo(file),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['empresa'] }); setLogoKey(k => k + 1); toast.success('Logo actualizado') },
    onError: () => toast.error('Error al subir el logo'),
  })

  const { mutate: cambiarModoRed, isPending: cambiandoRed } = useMutation({
    mutationFn: (modoRed: boolean) => redApi.establecer(modoRed),
    onSuccess: (data) => { queryClient.setQueryData(['red-status'], data); setReiniciando(true); setCuenta(10) },
    onError: () => toast.error('Error al cambiar el modo de red'),
  })

  useEffect(() => {
    if (!reiniciando) return
    if (cuenta <= 0) { window.location.reload(); return }
    const t = setTimeout(() => setCuenta(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [reiniciando, cuenta])

  if (reiniciando) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <p className="text-lg font-semibold text-gray-800 dark:text-zinc-100">Aplicando cambios...</p>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Recargando en {cuenta}s</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Ajustes</h1>
        <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">Personalización, cuenta y configuración de empresa</p>
      </div>

      {/* Apariencia */}
      <Seccion titulo="Apariencia" descripcion="Cambia el tema de la interfaz">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tema === 'dark'
              ? <Sun className="h-4 w-4 text-amber-500" />
              : <Moon className="h-4 w-4 text-zinc-500" />}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                {tema === 'dark' ? 'Modo oscuro activo' : 'Modo claro activo'}
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                {tema === 'dark' ? 'Interfaz con fondo oscuro' : 'Interfaz con fondo claro'}
              </p>
            </div>
          </div>
          <Button variante="secundario" tamano="sm" onClick={toggleTema}>
            {tema === 'dark' ? <><Sun className="h-3.5 w-3.5" /> Modo claro</> : <><Moon className="h-3.5 w-3.5" /> Modo oscuro</>}
          </Button>
        </div>
      </Seccion>

      {/* Datos personales */}
      <Seccion titulo="Datos personales" descripcion="Tu nombre y email de acceso">
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
          <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="submit" cargando={guardandoPerfil}>Guardar cambios</Button>
          </div>
        </form>
      </Seccion>

      {/* Contraseña */}
      <Seccion titulo="Contraseña" descripcion="Actualiza tu contraseña de acceso">
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
          <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="submit" cargando={cambiandoContrasena}>Cambiar contraseña</Button>
          </div>
        </form>
      </Seccion>

      {/* ── Solo ADMIN ─────────────────────────────────────── */}
      {esAdmin && (
        <>
          {/* Logo */}
          <Seccion titulo="Logo de empresa" descripcion="Se muestra en la cabecera de los albaranes PDF">
            <div className="flex items-center gap-5">
              <div className="w-32 h-16 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
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
              <div>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mb-3">PNG o JPG, recomendado 300×100 px.</p>
                <Button variante="secundario" tamano="sm" cargando={subiendoLogo} onClick={() => inputRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" />
                  {empresa?.tieneLogo ? 'Cambiar logo' : 'Subir logo'}
                </Button>
                <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) subirLogo(f) }} />
              </div>
            </div>
          </Seccion>

          {/* Datos empresa */}
          <Seccion titulo="Datos de la empresa" descripcion="Información que aparece en todos los albaranes generados">
            <form onSubmit={formEmpresa.handleSubmit(d => guardarEmpresa(d))} className="space-y-4">
              <Input
                label="Nombre *"
                placeholder="Ej: Sonido Madrid S.L."
                error={formEmpresa.formState.errors.nombre?.message}
                {...formEmpresa.register('nombre', { required: 'El nombre es obligatorio' })}
              />
              <Input label="Dirección" placeholder="Calle, polígono, localidad..." {...formEmpresa.register('direccion')} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Teléfono" placeholder="+34 600 000 000" {...formEmpresa.register('telefono')} />
                <Input
                  label="Email"
                  type="email"
                  placeholder="info@empresa.com"
                  error={formEmpresa.formState.errors.email?.message}
                  {...formEmpresa.register('email', { pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' } })}
                />
              </div>
              <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-zinc-800">
                <Button type="submit" cargando={guardandoEmpresa}>Guardar cambios</Button>
              </div>
            </form>
          </Seccion>

          {/* Modo red */}
          <Seccion titulo="Modo red" descripcion="Permite que otros ordenadores de la red accedan a la aplicación">
            {cargandoRed ? (
              <div className="h-8 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {red?.modoRed
                      ? <Wifi className="h-4 w-4 text-emerald-500" />
                      : <Monitor className="h-4 w-4 text-gray-400 dark:text-zinc-500" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                        {red?.modoRed ? 'Modo red activo' : 'Solo local'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">
                        {red?.modoRed ? 'Accesible desde la red local' : 'Solo desde este ordenador'}
                      </p>
                    </div>
                  </div>
                  <Button variante={red?.modoRed ? 'secundario' : 'primario'} tamano="sm" cargando={cambiandoRed} onClick={() => cambiarModoRed(!red?.modoRed)}>
                    {red?.modoRed ? <><WifiOff className="h-3.5 w-3.5" /> Desactivar</> : <><Wifi className="h-3.5 w-3.5" /> Activar</>}
                  </Button>
                </div>

                {red?.modoRed && red.ipsLocales.length > 0 && (
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 space-y-2">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Comparte esta URL:</p>
                    {red.ipsLocales.map((ip) => (
                      <div key={ip} className="flex items-center gap-3">
                        <code className="text-sm font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded">
                          http://{ip}:{red.puerto === 80 ? '' : red.puerto}
                        </code>
                        <button
                          onClick={() => { navigator.clipboard.writeText(`http://${ip}:${red.puerto}`); toast.success('URL copiada') }}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          Copiar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Seccion>
        </>
      )}
    </div>
  )
}
