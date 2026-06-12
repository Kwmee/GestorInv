import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { informesApi } from '@/api/informes.api'
import { TrendingUp, Package, CalendarDays, Wrench, AlertCircle } from 'lucide-react'

const COLORES_ESTADO = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

function StatCard({ label, valor, sub, color = 'text-zinc-900 dark:text-zinc-100' }: {
  label: string; valor: string | number; sub?: string; color?: string
}) {
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <p className="text-2xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{label}</p>
      <p className={`text-3xl font-bold mt-2 tabular ${color}`}>{valor}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  )
}

export function Informes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['informes'],
    queryFn: informesApi.obtener,
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-7 w-48 rounded" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-64 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 text-sm">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Error al cargar los informes
      </div>
    )
  }

  const { resumenMaterial: rm, resumenEventos: re, resumenMantenimiento: rmt } = data

  const dataPie = [
    { name: 'Disponible', value: rm.disponible },
    { name: 'En evento',  value: rm.enEvento },
    { name: 'Reparación', value: rm.enReparacion },
    { name: 'Baja',       value: rm.baja },
  ]

  const euroFormat = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Informes</h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">Resumen general de la operativa</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total inventario" valor={rm.totalItems} sub="ítems registrados" />
        <StatCard label="Valor inventario" valor={euroFormat.format(rm.valorTotal)} sub="valor total" color="text-blue-600 dark:text-blue-400" />
        <StatCard label="Eventos totales" valor={re.total} sub={`${re.finalizados} finalizados`} />
        <StatCard label="En mantenimiento" valor={rmt.enRevision + rmt.reparando} sub={`${rmt.reparados} reparados`} color="text-amber-600 dark:text-amber-400" />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-2 gap-5">
        {/* Eventos por mes */}
        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Eventos por mes (año actual)</p>
          </div>
          {data.eventosPorMes.length === 0 ? (
            <p className="text-sm text-zinc-400 text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.eventosPorMes} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--card-border)', background: 'var(--card)' }}
                  formatter={(v: number, n: string) => [v, n === 'total' ? 'Total' : 'Finalizados']}
                />
                <Bar dataKey="total"      fill="#3b82f6" radius={[3,3,0,0]} maxBarSize={28} name="total" />
                <Bar dataKey="finalizados" fill="#10b981" radius={[3,3,0,0]} maxBarSize={28} name="finalizados" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Material por estado */}
        <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-4 w-4 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Estado del inventario</p>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={dataPie} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {dataPie.map((_, i) => <Cell key={i} fill={COLORES_ESTADO[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {dataPie.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORES_ESTADO[i] }} />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tabular">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fila baja */}
      <div className="grid grid-cols-3 gap-5">
        {/* Material por categoría */}
        <div className="col-span-2 rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Material por categoría</p>
          </div>
          <div className="space-y-2.5">
            {data.materialPorCategoria.map(c => (
              <div key={c.categoria}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{c.categoria}</span>
                  <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 tabular">{c.total}</span>
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${rm.totalItems > 0 ? (c.total / rm.totalItems) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 material más usado + resumen mantenimiento */}
        <div className="space-y-4">
          <div className="rounded-xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Top 5 más usado</p>
            <div className="space-y-2">
              {data.top5MaterialUsado.map((m, i) => (
                <div key={m.nombre} className="flex items-center gap-2">
                  <span className="text-2xs font-bold text-zinc-300 dark:text-zinc-600 w-4">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{m.nombre}</p>
                    <p className="text-[10px] text-zinc-400">{m.vecesEnEventos} eventos</p>
                  </div>
                </div>
              ))}
              {data.top5MaterialUsado.length === 0 && (
                <p className="text-xs text-zinc-400">Sin datos de uso</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-3.5 w-3.5 text-zinc-400" />
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Mantenimiento</p>
            </div>
            {[
              { label: 'En revisión', val: rmt.enRevision, color: 'text-amber-600' },
              { label: 'Reparando',   val: rmt.reparando,  color: 'text-orange-600' },
              { label: 'Reparados',   val: rmt.reparados,  color: 'text-emerald-600' },
              { label: 'Irreparable', val: rmt.irreparables, color: 'text-red-600' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between py-1">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
                <span className={`text-sm font-bold tabular ${color}`}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
