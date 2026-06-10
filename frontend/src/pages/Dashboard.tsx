import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Package, Truck, Wrench, XCircle, CalendarDays, AlertCircle } from 'lucide-react'
import { dashboardApi } from '@/api/dashboard.api'

function TarjetaEstado({
  icono: Icono,
  etiqueta,
  valor,
  color,
  onClick,
}: {
  icono: React.ElementType
  etiqueta: string
  valor: number
  color: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-md transition-shadow w-full"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icono className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{valor}</p>
          <p className="text-sm text-gray-500">{etiqueta}</p>
        </div>
      </div>
    </button>
  )
}

export function Dashboard() {
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.resumen,
    refetchInterval: 60_000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-4">
        <AlertCircle className="h-5 w-5" />
        <span>Error al cargar el dashboard</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Estado del inventario en tiempo real</p>
      </div>

      {/* Tarjetas de estado */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TarjetaEstado
          icono={Package}
          etiqueta="Disponible"
          valor={data.disponible}
          color="bg-green-100 text-green-700"
          onClick={() => navigate('/inventario?estado=DISPONIBLE')}
        />
        <TarjetaEstado
          icono={Truck}
          etiqueta="En evento"
          valor={data.enEvento}
          color="bg-blue-100 text-blue-700"
          onClick={() => navigate('/inventario?estado=EN_EVENTO')}
        />
        <TarjetaEstado
          icono={Wrench}
          etiqueta="En reparación"
          valor={data.enReparacion}
          color="bg-yellow-100 text-yellow-700"
          onClick={() => navigate('/inventario?estado=EN_REPARACION')}
        />
        <TarjetaEstado
          icono={XCircle}
          etiqueta="Baja"
          valor={data.baja}
          color="bg-red-100 text-red-700"
          onClick={() => navigate('/inventario?estado=BAJA')}
        />
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total material</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{data.totalMaterial}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Eventos activos</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{data.eventosActivos}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Material pendiente de devolución</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{data.materialPendienteDevolucion}</p>
        </div>
      </div>

      {/* Eventos activos */}
      {data.eventosActivosDetalle.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-700" />
            <h3 className="font-semibold text-gray-900">Eventos activos</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {data.eventosActivosDetalle.map((e) => (
              <button
                key={e.id}
                onClick={() => navigate(`/eventos/${e.id}`)}
                className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 text-left transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{e.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.cliente} · {e.fechaInicio}</p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                  {e.materialPendiente} pendientes
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
