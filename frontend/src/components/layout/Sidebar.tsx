import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, CalendarDays,
  FileText, LogOut, Settings, Sun, Moon, Building2, HardHat,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'

const navPrincipal = [
  { to: '/',             label: 'Dashboard',    icono: LayoutDashboard },
  { to: '/eventos',      label: 'Eventos',      icono: CalendarDays },
  { to: '/inventario',   label: 'Inventario',   icono: Package },
  { to: '/clientes',     label: 'Clientes',     icono: Users },
  { to: '/albaranes',    label: 'Albaranes',    icono: FileText },
  { to: '/trabajadores', label: 'Trabajadores', icono: HardHat },
]

function NavItem({ to, label, icono: Icono, end }: { to: string; label: string; icono: React.ElementType; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => clsx(
        'group flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-100',
        isActive
          ? 'bg-white/10 text-white'
          : 'text-zinc-400 hover:text-white hover:bg-white/5'
      )}
    >
      {({ isActive }) => (
        <>
          <Icono className={clsx(
            'h-4 w-4 shrink-0 transition-colors',
            isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
          )} />
          {label}
          {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const { usuario, cerrarSesion } = useAuthStore()
  const { tema, toggleTema } = useThemeStore()

  const iniciales = usuario?.nombre
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'U'

  return (
    <aside className="w-56 flex-shrink-0 bg-[#18181b] dark:bg-black flex flex-col border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
            <Package className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-white leading-none">GestorInventario</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 truncate">Empresa de Sonido</p>
          </div>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 px-2 overflow-y-auto">
        <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
          Gestión
        </p>
        <div className="space-y-0.5">
          {navPrincipal.map(({ to, label, icono }) => (
            <NavItem key={to} to={to} label={label} icono={icono} end={to === '/'} />
          ))}
        </div>
      </nav>

      {/* Sección inferior */}
      <div className="px-2 pb-3 border-t border-white/[0.06] pt-3">
        <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
          Cuenta
        </p>

        <div className="space-y-0.5">
          <button
            onClick={toggleTema}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {tema === 'dark'
              ? <Sun className="h-4 w-4 text-zinc-500 shrink-0" />
              : <Moon className="h-4 w-4 text-zinc-500 shrink-0" />}
            {tema === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </button>

          {usuario?.rol === 'ADMIN' && (
            <NavLink
              to="/configuracion"
              className={({ isActive }) => clsx(
                'flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all',
                isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Building2 className="h-4 w-4 text-zinc-500 shrink-0" />
              Mi empresa
            </NavLink>
          )}

          <NavLink
            to="/perfil"
            className={({ isActive }) => clsx(
              'flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all',
              isActive ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            )}
          >
            <Settings className="h-4 w-4 text-zinc-500 shrink-0" />
            Mi perfil
          </NavLink>
        </div>

        {/* Usuario + logout */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-2 border-t border-white/[0.06]">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">{iniciales}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-zinc-200 truncate leading-none">{usuario?.nombre}</p>
            <p className="text-[11px] text-zinc-500 truncate mt-0.5 capitalize">{usuario?.rol?.toLowerCase()}</p>
          </div>
          <button
            onClick={cerrarSesion}
            title="Cerrar sesión"
            className="text-zinc-600 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
