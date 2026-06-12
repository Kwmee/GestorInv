import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, CalendarDays, AlertCircle, ArrowRight } from 'lucide-react'
import { dashboardApi } from '@/api/dashboard.api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuthStore } from '@/store/authStore'

const horaActual = new Date().getHours()
const saludo = horaActual < 13 ? 'Buenos días' : horaActual < 20 ? 'Buenas tardes' : 'Buenas noches'

function StatCard({
  label, valor, sub, color, onClick,
}: { label: string; valor: number; sub?: string; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-xl border p-5 text-left w-full transition-all hover:shadow-card"
      style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
    >
      <p className="text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className={`text-3xl font-bold mt-2 tabular ${color}`}>{valor}</p>
      {sub && <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">{sub}</p>}
    </button>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const usuario = useAuthStore((s) => s.usuario)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.resumen,
    refetchInterval: 60_000,
    retry: (count, error: any) => count < 3 && !(error?.response?.status < 500),
    retryDelay: 3000,
  })

  if (isLoading) {
    return (
      <div className="space-y-7">
        <div className="space-y-1.5">
          <div className="skeleton h-7 w-56" />
          <div className="skeleton h-4 w-36" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Error al cargar el dashboard
        </div>
        <button onClick={() => refetch()} className="text-sm text-red-600 dark:text-red-400 underline hover:no-underline">
          Reintentar
        </button>
      </div>
    )
  }

  const pctDisponible = data.totalMaterial > 0
    ? Math.round((data.disponible / data.totalMaterial) * 100)
    : 0

  return (
    <div className="space-y-7">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
          {saludo}{usuario ? `, ${usuario.nombre.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Disponible"
          valor={data.disponible}
          sub={`${pctDisponible}% del total`}
          color="text-emerald-600 dark:text-emerald-400"
          onClick={() => navigate('/inventario?estado=DISPONIBLE')}
        />
        <StatCard
          label="En evento"
          valor={data.enEvento}
          sub="Fuera de la nave"
          color="text-blue-600 dark:text-blue-400"
          onClick={() => navigate('/inventario?estado=EN_EVENTO')}
        />
        <StatCard
          label="En reparación"
          valor={data.enReparacion}
          sub="No disponible"
          color="text-amber-600 dark:text-amber-400"
          onClick={() => navigate('/inventario?estado=EN_REPARACION')}
        />
        <StatCard
          label="Baja"
          valor={data.baja}
          sub="Retirado del inventario"
          color="text-red-500 dark:text-red-400"
          onClick={() => navigate('/inventario?estado=BAJA')}
        />
      </div>

      {/* Fila resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Package, iconColor: 'text-zinc-400', label: 'Total inventario', valor: data.totalMaterial, valColor: 'text-zinc-900 dark:text-zinc-100', sub: 'equipos registrados' },
          { icon: CalendarDays, iconColor: 'text-blue-500', label: 'Eventos activos', valor: data.eventosActivos, valColor: 'text-blue-600 dark:text-blue-400', sub: 'en este momento' },
          { icon: Truck, iconColor: 'text-amber-500', label: 'Pendiente devolución', valor: data.materialPendienteDevolucion, valColor: 'text-amber-600 dark:text-amber-400', sub: 'ítems sin devolver' },
        ].map(({ icon: Icon, iconColor, label, valor, valColor, sub }) => (
          <div key={label} className="rounded-xl border p-5"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`h-4 w-4 ${iconColor}`} />
              <p className="text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
            </div>
            <p className={`text-3xl font-bold tabular ${valColor}`}>{valor}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Eventos activos */}
      {data.eventosActivosDetalle.length > 0 && (
        <div className="rounded-xl border overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="px-5 py-3.5 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Eventos en curso</h3>
            </div>
            <button
              onClick={() => navigate('/eventos')}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
            {data.eventosActivosDetalle.map((e) => (
              <button
                key={e.id}
                onClick={() => navigate(`/eventos/${e.id}`)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{e.nombre}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {e.cliente} · {e.fechaInicio}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {e.materialPendiente > 0 && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 px-2 py-0.5 rounded font-medium tabular">
                      {e.materialPendiente} pendientes
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
