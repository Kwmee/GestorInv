import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, CalendarDays,
  FileText, LogOut, HardHat, Settings, Wrench,
  ReceiptText, BarChart3, Calendar,
} from 'lucide-react'
import clsx from 'clsx'
import { useAuthStore } from '@/store/authStore'

const navPrincipal = [
  { to: '/',             label: 'Dashboard',    icono: LayoutDashboard },
  { to: '/eventos',      label: 'Eventos',      icono: CalendarDays },
  { to: '/calendario',   label: 'Calendario',   icono: Calendar },
  { to: '/inventario',   label: 'Inventario',   icono: Package },
  { to: '/clientes',     label: 'Clientes',     icono: Users },
  { to: '/albaranes',    label: 'Albaranes',    icono: FileText },
  { to: '/trabajadores', label: 'Trabajadores', icono: HardHat },
]

const navGestion = [
  { to: '/mantenimiento', label: 'Mantenimiento', icono: Wrench },
  { to: '/presupuestos',  label: 'Presupuestos',  icono: ReceiptText },
  { to: '/informes',      label: 'Informes',      icono: BarChart3 },
]

function NavItem({ to, label, icono: Icono, end }: {
  to: string; label: string; icono: React.ElementType; end?: boolean
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => clsx(
        'group flex items-center gap-2.5 px-3 h-9 rounded-md text-sm font-medium transition-colors duration-100',
        isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
      )}
    >
      {({ isActive }) => (
        <>
          <Icono className={clsx(
            'h-[18px] w-[18px] shrink-0',
            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
          )} />
          <span className="leading-none">{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const { usuario, cerrarSesion } = useAuthStore()
  const navigate = useNavigate()

  const iniciales = usuario?.nombre
    ?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() ?? 'U'

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Logo */}
      <div className="px-4 h-14 flex items-center gap-2.5 border-b"
        style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Package className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">GestorInv.</p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">Empresa de Sonido</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
          Menú
        </p>
        {navPrincipal.map(({ to, label, icono }) => (
          <NavItem key={to} to={to} label={label} icono={icono} end={to === '/'} />
        ))}

        <p className="px-3 pt-4 pb-2 text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-600">
          Gestión
        </p>
        {navGestion.map(({ to, label, icono }) => (
          <NavItem key={to} to={to} label={label} icono={icono} />
        ))}
      </nav>

      {/* Pie — usuario */}
      <div className="px-3 pb-3 border-t space-y-0.5 pt-3"
        style={{ borderColor: 'var(--sidebar-border)' }}>
        <button
          onClick={() => navigate('/perfil')}
          className="w-full flex items-center gap-2.5 px-3 h-10 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">{iniciales}</span>
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate leading-none">{usuario?.nombre}</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 capitalize">{usuario?.rol?.toLowerCase()}</p>
          </div>
          <Settings className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 shrink-0 transition-colors" />
        </button>

        <button
          onClick={cerrarSesion}
          className="w-full flex items-center gap-2.5 px-3 h-9 rounded-md text-sm text-zinc-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
