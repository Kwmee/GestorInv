import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, CalendarDays,
  FileText, LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/authStore'

const nav = [
  { to: '/',          label: 'Dashboard',  icono: LayoutDashboard },
  { to: '/inventario',label: 'Inventario', icono: Package },
  { to: '/clientes',  label: 'Clientes',   icono: Users },
  { to: '/eventos',   label: 'Eventos',    icono: CalendarDays },
  { to: '/albaranes', label: 'Albaranes',  icono: FileText },
]

export function Sidebar() {
  const { usuario, cerrarSesion } = useAuthStore()

  return (
    <aside className="w-60 min-h-screen bg-[#1e264a] flex flex-col text-white">
      {/* Logo / título */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-wide">GestorInventario</h1>
        <p className="text-xs text-blue-200 mt-0.5">Empresa de Sonido</p>
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
                ? 'bg-blue-600 text-white'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icono className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Usuario + cerrar sesión */}
      <div className="px-4 py-4 border-t border-white/10">
        {usuario && (
          <div className="mb-3 px-1">
            <p className="text-sm font-medium text-white truncate">{usuario.nombre}</p>
            <p className="text-xs text-blue-300 truncate">{usuario.rol}</p>
          </div>
        )}
        <button
          onClick={cerrarSesion}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
