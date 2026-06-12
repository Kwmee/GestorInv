import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Upload, ImageOff, Wifi, WifiOff, Monitor, User, Lock, Palette, Building2 } from 'lucide-react'
import { usuarioApi } from '@/api/usuario.api'
import { empresaApi } from '@/api/empresa.api'
import { redApi } from '@/api/red.api'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { CambiarContrasenaRequest, EmpresaRequest, PerfilRequest } from '@/types'
import clsx from 'clsx'

type Tab = 'apariencia' | 'cuenta' | 'contrasena' | 'empresa'

// ─── Panel: Apariencia ───────────────────────────────────────────────────────
function PanelApariencia() {
  const { tema, toggleTema } = useThemeStore()
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">Apariencia</h2>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Elige el tema de la interfaz</p>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        {(['light', 'dark'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { if (tema !== t) toggleTema() }}
            className={clsx(
              'relative rounded-xl border-2 p-4 text-left transition-all',
              tema === t
                ? 'border-zinc-900 dark:border-white'
                : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
            )}
          >
            {/* Miniatura */}
            <div className={clsx(
              'rounded-md h-20 mb-3 overflow-hidden border',
              t === 'dark' ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'
            )}>
              <div className={clsx('flex h-full', t === 'dark' ? '' : '')}>
                <div className={clsx('w-10 h-full', t === 'dark' ? 'bg-zinc-800' : 'bg-white border-r border-gray-200')} />
                <div className="flex-1 p-2 space-y-1.5">
                  <div className={clsx('h-2 w-3/4 rounded', t === 'dark' ? 'bg-zinc-700' : 'bg-gray-200')} />
                  <div className={clsx('h-2 w-1/2 rounded', t === 'dark' ? 'bg-zinc-700' : 'bg-gray-200')} />
                  <div className={clsx('h-2 w-2/3 rounded', t === 'dark' ? 'bg-zinc-700' : 'bg-gray-200')} />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                  {t === 'light' ? 'Claro' : 'Oscuro'}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                  {t === 'light' ? 'Fondo blanco / gris claro' : 'Fondo negro / zinc'}
                </p>
              </div>
              {tema === t && (
                <span className="w-4 h-4 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white dark:bg-zinc-900" />
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Panel: Cuenta ───────────────────────────────────────────────────────────
function PanelCuenta() {
  const { actualizarUsuario } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: perfil } = useQuery({ queryKey: ['perfil'], queryFn: usuarioApi.obtenerPerfil })
  const form = useForm<PerfilRequest>({
    values: perfil ? { nombre: perfil.nombre, email: perfil.email } : undefined,
  })

  const { mutate: guardar, isPending } = useMutation({
    mutationFn: (data: PerfilRequest) => usuarioApi.actualizarPerfil(data),
    onSuccess: (data) => {
      actualizarUsuario({ nombre: data.nombre, email: data.email })
      queryClient.setQueryData(['perfil'], data)
      toast.success('Perfil actualizado')
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al guardar'),
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">Datos personales</h2>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Tu nombre y email de acceso al sistema</p>
      </div>
      <form onSubmit={form.handleSubmit((d) => guardar(d))} className="space-y-4">
        <Input label="Nombre" placeholder="Tu nombre"
          error={form.formState.errors.nombre?.message}
          {...form.register('nombre', { required: 'El nombre es obligatorio' })}
        />
        <Input label="Email" type="email" placeholder="tu@email.com"
          error={form.formState.errors.email?.message}
          {...form.register('email', {
            required: 'El email es obligatorio',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' },
          })}
        />
        <div className="pt-2">
          <Button type="submit" cargando={isPending}>Guardar cambios</Button>
        </div>
      </form>
    </div>
  )
}

// ─── Panel: Contraseña ───────────────────────────────────────────────────────
function PanelContrasena() {
  const form = useForm<CambiarContrasenaRequest & { confirmar: string }>()

  const { mutate: cambiar, isPending } = useMutation({
    mutationFn: (data: CambiarContrasenaRequest) => usuarioApi.cambiarContrasena(data),
    onSuccess: () => { form.reset(); toast.success('Contraseña actualizada') },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error'),
  })

  const onSubmit = form.handleSubmit((data) => {
    if (data.contrasenaNueva !== data.confirmar) {
      form.setError('confirmar', { message: 'Las contraseñas no coinciden' })
      return
    }
    cambiar({ contrasenaActual: data.contrasenaActual, contrasenaNueva: data.contrasenaNueva })
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">Cambiar contraseña</h2>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Mínimo 6 caracteres</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Contraseña actual" type="password" placeholder="••••••••"
          error={form.formState.errors.contrasenaActual?.message}
          {...form.register('contrasenaActual', { required: 'Introduce tu contraseña actual' })}
        />
        <Input label="Nueva contraseña" type="password" placeholder="••••••••"
          error={form.formState.errors.contrasenaNueva?.message}
          {...form.register('contrasenaNueva', {
            required: 'Introduce la nueva contraseña',
            minLength: { value: 6, message: 'Mínimo 6 caracteres' },
          })}
        />
        <Input label="Confirmar nueva contraseña" type="password" placeholder="••••••••"
          error={form.formState.errors.confirmar?.message}
          {...form.register('confirmar', { required: 'Confirma la nueva contraseña' })}
        />
        <div className="pt-2">
          <Button type="submit" cargando={isPending}>Cambiar contraseña</Button>
        </div>
      </form>
    </div>
  )
}

// ─── Panel: Empresa ──────────────────────────────────────────────────────────
function PanelEmpresa() {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [logoKey, setLogoKey] = useState(0)
  const [reiniciando, setReiniciando] = useState(false)
  const [cuenta, setCuenta] = useState(0)

  const { data: empresa } = useQuery({ queryKey: ['empresa'], queryFn: empresaApi.obtener })
  const { data: red, isLoading: cargandoRed } = useQuery({ queryKey: ['red-status'], queryFn: redApi.obtener })

  const form = useForm<EmpresaRequest>({
    values: empresa
      ? { nombre: empresa.nombre, direccion: empresa.direccion, telefono: empresa.telefono, email: empresa.email }
      : undefined,
  })

  const { mutate: guardar, isPending: guardando } = useMutation({
    mutationFn: (data: EmpresaRequest) => empresaApi.actualizar(data),
    onSuccess: (data) => { queryClient.setQueryData(['empresa'], data); toast.success('Guardado') },
    onError: () => toast.error('Error al guardar'),
  })

  const { mutate: subirLogo, isPending: subiendoLogo } = useMutation({
    mutationFn: (file: File) => empresaApi.subirLogo(file),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['empresa'] }); setLogoKey(k => k + 1); toast.success('Logo actualizado') },
    onError: () => toast.error('Error al subir el logo'),
  })

  const { mutate: cambiarRed, isPending: cambiandoRed } = useMutation({
    mutationFn: (v: boolean) => redApi.establecer(v),
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
      <div className="flex flex-col items-center py-16 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Reiniciando en {cuenta}s...</p>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {/* Logo */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100">Logo</h2>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Aparece en la cabecera de los albaranes PDF</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-32 h-16 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
            {empresa?.tieneLogo
              ? <img key={logoKey} src={`${empresaApi.logoUrl()}?t=${logoKey}`} alt="Logo" className="max-w-full max-h-full object-contain" />
              : <ImageOff className="h-5 w-5 text-gray-300 dark:text-zinc-600" />}
          </div>
          <div>
            <Button variante="secundario" tamano="sm" cargando={subiendoLogo} onClick={() => inputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" />
              {empresa?.tieneLogo ? 'Cambiar logo' : 'Subir logo'}
            </Button>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5">PNG o JPG, máx. 2 MB</p>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) subirLogo(f) }} />
          </div>
        </div>
      </div>

      <hr className="border-gray-100 dark:border-zinc-800" />

      {/* Datos */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Datos de la empresa</h3>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Se imprimen en todos los albaranes</p>
        </div>
        <form onSubmit={form.handleSubmit(d => guardar(d))} className="space-y-4">
          <Input label="Nombre *" placeholder="Ej: Sonido Madrid S.L."
            error={form.formState.errors.nombre?.message}
            {...form.register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input label="Dirección" placeholder="Calle, polígono, localidad..." {...form.register('direccion')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Teléfono" placeholder="+34 600 000 000" {...form.register('telefono')} />
            <Input label="Email" type="email" placeholder="info@empresa.com"
              error={form.formState.errors.email?.message}
              {...form.register('email', { pattern: { value: /\S+@\S+\.\S+/, message: 'Email no válido' } })}
            />
          </div>
          <div className="pt-2">
            <Button type="submit" cargando={guardando}>Guardar cambios</Button>
          </div>
        </form>
      </div>

      <hr className="border-gray-100 dark:border-zinc-800" />

      {/* Modo red */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">Modo red</h3>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Permite acceso desde otros ordenadores de la red local</p>
        </div>
        {cargandoRed ? (
          <div className="h-8 flex items-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" /></div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {red?.modoRed ? <Wifi className="h-4 w-4 text-emerald-500" /> : <Monitor className="h-4 w-4 text-gray-400 dark:text-zinc-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{red?.modoRed ? 'Activo' : 'Solo local'}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500">{red?.modoRed ? 'Red local habilitada' : 'Solo este ordenador'}</p>
                </div>
              </div>
              <Button variante={red?.modoRed ? 'secundario' : 'primario'} tamano="sm" cargando={cambiandoRed} onClick={() => cambiarRed(!red?.modoRed)}>
                {red?.modoRed ? <><WifiOff className="h-3.5 w-3.5" />Desactivar</> : <><Wifi className="h-3.5 w-3.5" />Activar</>}
              </Button>
            </div>
            {red?.modoRed && red.ipsLocales.length > 0 && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-3.5 space-y-2">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">URL para otros ordenadores:</p>
                {red.ipsLocales.map((ip) => (
                  <div key={ip} className="flex items-center gap-3">
                    <code className="text-sm font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded">
                      http://{ip}:{red.puerto === 80 ? '' : red.puerto}
                    </code>
                    <button onClick={() => { navigator.clipboard.writeText(`http://${ip}:${red.puerto}`); toast.success('Copiado') }} className="text-xs text-emerald-600 hover:underline">Copiar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Página principal ────────────────────────────────────────────────────────
export function Perfil() {
  const usuario = useAuthStore((s) => s.usuario)
  const esAdmin = usuario?.rol === 'ADMIN'
  const [tab, setTab] = useState<Tab>('apariencia')

  const tabs: { id: Tab; label: string; icono: React.ElementType; soloAdmin?: boolean }[] = (
    [
      { id: 'apariencia' as Tab, label: 'Apariencia', icono: Palette },
      { id: 'cuenta'     as Tab, label: 'Cuenta',     icono: User },
      { id: 'contrasena' as Tab, label: 'Contraseña', icono: Lock },
      { id: 'empresa'    as Tab, label: 'Empresa',    icono: Building2, soloAdmin: true },
    ] as { id: Tab; label: string; icono: React.ElementType; soloAdmin?: boolean }[]
  ).filter(t => !t.soloAdmin || esAdmin)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Ajustes</h1>
        <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">Personalización y configuración de la cuenta</p>
      </div>

      <div className="flex gap-8">
        {/* Nav lateral */}
        <nav className="w-44 shrink-0">
          <ul className="space-y-0.5">
            {tabs.map(({ id, label, icono: Icono }) => (
              <li key={id}>
                <button
                  onClick={() => setTab(id)}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
                    tab === id
                      ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 shadow-sm border border-gray-200 dark:border-zinc-800'
                      : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900/60'
                  )}
                >
                  <Icono className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contenido */}
        <div className="flex-1 min-w-0 max-w-lg bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6">
          {tab === 'apariencia' && <PanelApariencia />}
          {tab === 'cuenta'     && <PanelCuenta />}
          {tab === 'contrasena' && <PanelContrasena />}
          {tab === 'empresa'    && esAdmin && <PanelEmpresa />}
        </div>
      </div>
    </div>
  )
}
