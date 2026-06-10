import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, CalendarDays,
  FileText, LogOut, Settings, Sun, Moon, Building2,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const nav = [
  { to: '/',          label: 'Dashboard',  icono: LayoutDashboard },
  { to: '/inventario',label: 'Inventario', icono: Package },
  { to: '/clientes',  label: 'Clientes',   icono: Users },
  { to: '/eventos',   label: 'Eventos',    icono: CalendarDays },
  { to: '/albaranes', label: 'Albaranes',  icono: FileText },
]

export function Sidebar() {
  const { usuario, cerrarSesion } = useAuthStore()
  const { tema, toggleTema } = useThemeStore()

  return (
    <aside className="w-60 flex-shrink-0 bg-[#1e264a] dark:bg-black flex flex-col text-white border-r border-transparent dark:border-zinc-800">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10 dark:border-zinc-800">
        <h1 className="text-lg font-bold tracking-wide">GestorInventario</h1>
        <p className="text-xs text-blue-200 dark:text-zinc-500 mt-0.5">Empresa de Sonido</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, label, icono: Icono }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-600 dark:bg-zinc-700 text-white'
                : 'text-blue-100 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white'
            )}
          >
            <Icono className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Tema + usuario + cerrar sesión */}
      <div className="px-4 py-4 border-t border-white/10 dark:border-zinc-800 space-y-1">
        {/* Toggle tema */}
        <button
          onClick={toggleTema}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white transition-colors"
        >
          {tema === 'dark'
            ? <Sun className="h-4 w-4" />
            : <Moon className="h-4 w-4" />}
          {tema === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>

        {/* Configuración empresa (solo admin) */}
        {usuario?.rol === 'ADMIN' && (
          <NavLink
            to="/configuracion"
            className={({ isActive }) => clsx(
              'flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-blue-600 dark:bg-zinc-700 text-white'
                : 'text-blue-200 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white'
            )}
          >
            <Building2 className="h-4 w-4" />
            Mi empresa
          </NavLink>
        )}

        {/* Perfil */}
        <NavLink
          to="/perfil"
          className={({ isActive }) => clsx(
            'flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            isActive
              ? 'bg-blue-600 dark:bg-zinc-700 text-white'
              : 'text-blue-200 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white'
          )}
        >
          <Settings className="h-4 w-4" />
          Mi perfil
        </NavLink>

        {/* Info usuario */}
        {usuario && (
          <div className="px-3 py-1.5">
            <p className="text-sm font-medium text-white truncate">{usuario.nombre}</p>
            <p className="text-xs text-blue-300 dark:text-zinc-500 truncate">{usuario.email}</p>
          </div>
        )}

        {/* Cerrar sesión */}
        <button
          onClick={cerrarSesion}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
