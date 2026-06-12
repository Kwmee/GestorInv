import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, FileDown, Truck, RotateCcw, Plus, Trash2, ClipboardList, ChevronDown, Search, PackageCheck, PackageOpen } from 'lucide-react'
import { descargarBlob } from '@/lib/descargar'
import { eventoApi } from '@/api/evento.api'
import { materialApi } from '@/api/material.api'
import { albaranApi } from '@/api/albaran.api'
import { Button } from '@/components/ui/Button'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { DevolucionForm } from './DevolucionForm'
import { ChecklistCarga } from './ChecklistCarga'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function EventoDetalle() {
  const { id } = useParams<{ id: string }>()
  const eventoId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [confirmarSalida, setConfirmarSalida] = useState(false)
  const [confirmarIniciarCarga, setConfirmarIniciarCarga] = useState(false)
  const [confirmarIniciarDevolucion, setConfirmarIniciarDevolucion] = useState(false)
  const [modalDevolucion, setModalDevolucion] = useState(false)
  const [panelAnadir, setPanelAnadir] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')

  const { data: evento, isLoading } = useQuery({
    queryKey: ['evento', eventoId],
    queryFn: () => eventoApi.obtener(eventoId),
  })

  const { data: materialDisponible } = useQuery({
    queryKey: ['material-disponible'],
    queryFn: () => materialApi.listar({ estado: 'DISPONIBLE', size: 200 }),
    enabled: evento?.estado === 'PLANIFICADO',
  })

  const { mutate: confirmarSalidaMutate, isPending: confirmando } = useMutation({
    mutationFn: () => eventoApi.confirmarSalida(eventoId),
    onSuccess: (albaran) => {
      toast.success(`Albarán ${albaran.numero} generado`)
      queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setConfirmarSalida(false)
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al confirmar salida'),
  })

  const { mutate: iniciarCargaMutate, isPending: iniciandoCarga } = useMutation({
    mutationFn: () => eventoApi.iniciarCarga(eventoId),
    onSuccess: () => {
      toast.success('Checklist de carga iniciado')
      queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
      queryClient.invalidateQueries({ queryKey: ['checklist', eventoId] })
      setConfirmarIniciarCarga(false)
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al iniciar carga'),
  })

  const { mutate: iniciarDevolucionMutate, isPending: iniciandoDevolucion } = useMutation({
    mutationFn: () => eventoApi.iniciarDevolucion(eventoId),
    onSuccess: () => {
      toast.success('El material está en camino de vuelta')
      queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
      setConfirmarIniciarDevolucion(false)
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al iniciar devolución'),
  })

  const { mutate: agregarMaterial } = useMutation({
    mutationFn: (materialId: number) =>
      eventoApi.agregarMaterial(eventoId, [{ materialId, cantidad: 1 }]),
    onSuccess: () => {
      toast.success('Añadido')
      queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al añadir material'),
  })

  const { mutate: quitarMaterial } = useMutation({
    mutationFn: (materialId: number) => eventoApi.quitarMaterial(eventoId, materialId),
    onSuccess: () => {
      toast.success('Material eliminado del evento')
      queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error'),
  })

  const descargarListaCarga = async () => {
    try {
      const blob = await eventoApi.listaCarga(eventoId)
      descargarBlob(blob, `lista-carga-${evento?.nombre ?? eventoId}.pdf`)
    } catch {
      toast.error('No se pudo generar la lista de carga')
    }
  }

  const descargarAlbaran = async (albaranId: number, numero: string) => {
    try {
      const blob = await albaranApi.descargarPdf(albaranId)
      descargarBlob(blob, `${numero}.pdf`)
    } catch {
      toast.error('No se pudo descargar el albarán')
    }
  }

  if (isLoading || !evento) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    )
  }

  const esPlanificado  = evento.estado === 'PLANIFICADO'
  const esEnCarga      = evento.estado === 'EN_CARGA'
  const esActivo       = evento.estado === 'ACTIVO'
  const esDevolviendo  = evento.estado === 'DEVOLVIENDO'
  const formatFecha = (iso: string) => format(new Date(iso), "d MMM yyyy HH:mm", { locale: es })

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/eventos')} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">{evento.nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <EstadoBadge estado={evento.estado} />
              <span className="text-sm text-gray-500 dark:text-zinc-400">{evento.cliente.razonSocial}</span>
              {evento.lugar && <span className="text-sm text-gray-400 dark:text-zinc-500">· {evento.lugar}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {evento.lineas.length > 0 && (
            <Button variante="secundario" onClick={descargarListaCarga}>
              <ClipboardList className="h-4 w-4" />
              Lista de carga
            </Button>
          )}

          {/* PLANIFICADO: iniciar carga o salida directa */}
          {esPlanificado && (
            <>
              <Button variante="secundario" onClick={() => setConfirmarIniciarCarga(true)}>
                <PackageOpen className="h-4 w-4" />
                Iniciar carga
              </Button>
              <Button onClick={() => setConfirmarSalida(true)}>
                <Truck className="h-4 w-4" />
                Confirmar salida
              </Button>
            </>
          )}

          {/* EN_CARGA: salida (checklist abajo) */}
          {esEnCarga && (
            <Button onClick={() => setConfirmarSalida(true)}>
              <Truck className="h-4 w-4" />
              Confirmar salida
            </Button>
          )}

          {/* ACTIVO: iniciar devolución */}
          {esActivo && (
            <>
              <Button variante="secundario" onClick={() => setConfirmarIniciarDevolucion(true)}>
                <PackageCheck className="h-4 w-4" />
                Material en ruta de vuelta
              </Button>
              <Button onClick={() => setModalDevolucion(true)}>
                <RotateCcw className="h-4 w-4" />
                Registrar devolución
              </Button>
            </>
          )}

          {/* DEVOLVIENDO: solo registrar devolución */}
          {esDevolviendo && (
            <Button onClick={() => setModalDevolucion(true)}>
              <RotateCcw className="h-4 w-4" />
              Registrar devolución
            </Button>
          )}
        </div>
      </div>

      {/* Datos del evento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Cliente', valor: evento.cliente.razonSocial },
          { label: 'Fecha inicio', valor: formatFecha(evento.fechaInicio) },
          { label: 'Fecha fin', valor: evento.fechaFin ? formatFecha(evento.fechaFin) : '—' },
          { label: 'Responsable', valor: evento.trabajador?.nombre ?? '—' },
        ].map(({ label, valor }) => (
          <div key={label} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4">
            <p className="text-xs text-gray-500 dark:text-zinc-400">{label}</p>
            <p className="font-medium text-gray-900 dark:text-zinc-100 mt-0.5">{valor}</p>
          </div>
        ))}
      </div>

      {/* Checklist de carga (solo EN_CARGA) */}
      {esEnCarga && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-orange-200 dark:border-orange-800/40 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-orange-100 dark:border-orange-800/30 bg-orange-50 dark:bg-orange-900/10 flex items-center gap-2">
            <PackageOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <h3 className="font-semibold text-orange-900 dark:text-orange-300">Checklist de carga del camión</h3>
          </div>
          <div className="p-5">
            <ChecklistCarga eventoId={eventoId} />
          </div>
        </div>
      )}

      {/* Material asignado */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
          <h3 className="font-semibold text-gray-900 dark:text-zinc-100">
            Material asignado ({evento.lineas.length} ítems)
          </h3>
        </div>
        {evento.lineas.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-zinc-500 py-8">Sin material asignado</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Material</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Nº Serie</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600 dark:text-zinc-400">Cant.</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-zinc-400">Devolución</th>
                {esPlanificado && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {evento.lineas.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-100">{l.materialNombre}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-zinc-500 font-mono text-xs">
                    {l.materialNumeroSerie ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-zinc-300">{l.cantidad}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={l.estadoDevolucion} />
                  </td>
                  {esPlanificado && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => quitarMaterial(l.materialId)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Panel añadir material (solo PLANIFICADO) */}
      {esPlanificado && (() => {
        const yaAsignados = new Set(evento.lineas.map((l) => l.materialId))
        const categorias = [...new Set(materialDisponible?.contenido.map((m) => m.categoria.nombre) ?? [])]
        const disponibleFiltrado = (materialDisponible?.contenido ?? []).filter((m) => {
          if (yaAsignados.has(m.id)) return false
          if (categoriaFiltro && m.categoria.nombre !== categoriaFiltro) return false
          if (busqueda && !m.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
          return true
        })

        return (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <button
              onClick={() => setPanelAnadir(!panelAnadir)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-sm text-gray-900 dark:text-zinc-100">Añadir material al evento</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${panelAnadir ? 'rotate-180' : ''}`} />
            </button>

            {panelAnadir && (
              <div className="border-t border-gray-100 dark:border-zinc-800 p-4 space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-100 dark:border-zinc-800 divide-y divide-gray-50 dark:divide-zinc-800">
                  {disponibleFiltrado.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-6">
                      {materialDisponible ? 'Sin resultados' : 'Cargando...'}
                    </p>
                  ) : (
                    disponibleFiltrado.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{m.nombre}</p>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">
                            {m.categoria.nombre}
                            {m.marca ? ` · ${m.marca}` : ''}
                            {m.numeroSerie ? ` · ${m.numeroSerie}` : ''}
                          </p>
                        </div>
                        <button
                          onClick={() => agregarMaterial(m.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-medium transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Añadir
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  {disponibleFiltrado.length} ítem(s) disponibles
                </p>
              </div>
            )}
          </div>
        )
      })()}

      {/* Albaranes */}
      {evento.albaranes && evento.albaranes.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
            <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Albaranes</h3>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-zinc-800">
            {evento.albaranes.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-zinc-100">{a.numero}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-500">
                    {a.tipo === 'SALIDA' ? 'Albarán de salida' : 'Albarán de devolución'} ·{' '}
                    {formatFecha(a.fechaEmision)}
                  </p>
                </div>
                <Button
                  variante="fantasma"
                  tamano="sm"
                  onClick={() => descargarAlbaran(a.id, a.numero)}
                >
                  <FileDown className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diálogo: Iniciar carga */}
      <ConfirmDialog
        abierto={confirmarIniciarCarga}
        titulo="Iniciar carga del camión"
        mensaje="Se generará el checklist con el material planificado para este evento. Los operarios podrán marcar cada ítem a medida que lo cargan. ¿Continuar?"
        textoConfirmar="Iniciar carga"
        cargando={iniciandoCarga}
        onConfirmar={() => iniciarCargaMutate()}
        onCancelar={() => setConfirmarIniciarCarga(false)}
      />

      {/* Diálogo: Confirmar salida */}
      <ConfirmDialog
        abierto={confirmarSalida}
        titulo="Confirmar salida de material"
        mensaje="Se generará el albarán de salida y el material pasará a estado EN EVENTO. ¿Confirmar?"
        textoConfirmar="Confirmar salida"
        cargando={confirmando}
        onConfirmar={() => confirmarSalidaMutate()}
        onCancelar={() => setConfirmarSalida(false)}
      />

      {/* Diálogo: Iniciar devolución */}
      <ConfirmDialog
        abierto={confirmarIniciarDevolucion}
        titulo="Material en ruta de vuelta"
        mensaje="El evento pasará a estado DEVOLVIENDO. Úsalo cuando el camión ya está de regreso hacia la nave. ¿Confirmar?"
        textoConfirmar="Confirmar"
        cargando={iniciandoDevolucion}
        onConfirmar={() => iniciarDevolucionMutate()}
        onCancelar={() => setConfirmarIniciarDevolucion(false)}
      />

      {/* Modal devolución */}
      <Modal
        abierto={modalDevolucion}
        titulo="Registrar devolución"
        onCerrar={() => setModalDevolucion(false)}
        tamano="lg"
      >
        <DevolucionForm
          evento={evento}
          onExito={() => {
            setModalDevolucion(false)
            queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
            queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          }}
        />
      </Modal>
    </div>
  )
}
