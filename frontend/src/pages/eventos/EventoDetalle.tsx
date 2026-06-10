import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ArrowLeft, FileDown, Truck, RotateCcw, Plus, Trash2 } from 'lucide-react'
import { eventoApi } from '@/api/evento.api'
import { materialApi } from '@/api/material.api'
import { albaranApi } from '@/api/albaran.api'
import { Button } from '@/components/ui/Button'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { DevolucionForm } from './DevolucionForm'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function EventoDetalle() {
  const { id } = useParams<{ id: string }>()
  const eventoId = Number(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [confirmarSalida, setConfirmarSalida] = useState(false)
  const [modalDevolucion, setModalDevolucion] = useState(false)
  const [modalAnadirMaterial, setModalAnadirMaterial] = useState(false)
  const [materialAnadir, setMaterialAnadir] = useState('')

  const { data: evento, isLoading } = useQuery({
    queryKey: ['evento', eventoId],
    queryFn: () => eventoApi.obtener(eventoId),
  })

  const { data: materialDisponible } = useQuery({
    queryKey: ['material-disponible'],
    queryFn: () => materialApi.listar({ estado: 'DISPONIBLE', size: 200 }),
    enabled: modalAnadirMaterial,
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

  const { mutate: agregarMaterial, isPending: anadiendo } = useMutation({
    mutationFn: (materialId: number) =>
      eventoApi.agregarMaterial(eventoId, [{ materialId, cantidad: 1 }]),
    onSuccess: () => {
      toast.success('Material añadido')
      queryClient.invalidateQueries({ queryKey: ['evento', eventoId] })
      setModalAnadirMaterial(false)
      setMaterialAnadir('')
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

  const descargarAlbaran = async (albaranId: number, numero: string) => {
    try {
      const blob = await albaranApi.descargarPdf(albaranId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${numero}.pdf`
      a.click()
      URL.revokeObjectURL(url)
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

  const esPlanificado = evento.estado === 'PLANIFICADO'
  const esActivo = evento.estado === 'ACTIVO'
  const formatFecha = (iso: string) => format(new Date(iso), "d MMM yyyy HH:mm", { locale: es })

  return (
    <div className="space-y-5">
      {/* Cabecera */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/eventos')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{evento.nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <EstadoBadge estado={evento.estado} />
              <span className="text-sm text-gray-500">{evento.cliente.razonSocial}</span>
              {evento.lugar && <span className="text-sm text-gray-400">· {evento.lugar}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {esPlanificado && (
            <>
              <Button variante="secundario" onClick={() => setModalAnadirMaterial(true)}>
                <Plus className="h-4 w-4" />
                Añadir material
              </Button>
              <Button onClick={() => setConfirmarSalida(true)}>
                <Truck className="h-4 w-4" />
                Confirmar salida
              </Button>
            </>
          )}
          {esActivo && (
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
          { label: 'Técnico', valor: evento.tecnicoResponsable?.nombre ?? '—' },
        ].map(({ label, valor }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium text-gray-900 mt-0.5">{valor}</p>
          </div>
        ))}
      </div>

      {/* Material asignado */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            Material asignado ({evento.lineas.length} ítems)
          </h3>
        </div>
        {evento.lineas.length === 0 ? (
          <p className="text-center text-gray-400 py-8">Sin material asignado</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Material</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nº Serie</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">Cant.</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Devolución</th>
                {esPlanificado && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {evento.lineas.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{l.materialNombre}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {l.materialNumeroSerie ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center">{l.cantidad}</td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={l.estadoDevolucion} />
                  </td>
                  {esPlanificado && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => quitarMaterial(l.materialId)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
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

      {/* Albaranes */}
      {evento.albaranes && evento.albaranes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Albaranes</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {evento.albaranes.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium text-sm">{a.numero}</p>
                  <p className="text-xs text-gray-500">
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

      {/* Confirmar salida */}
      <ConfirmDialog
        abierto={confirmarSalida}
        titulo="Confirmar salida de material"
        mensaje={`Se generará el albarán de salida y el material pasará a estado EN EVENTO. ¿Confirmar?`}
        textoConfirmar="Confirmar salida"
        cargando={confirmando}
        onConfirmar={() => confirmarSalidaMutate()}
        onCancelar={() => setConfirmarSalida(false)}
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

      {/* Modal añadir material */}
      <Modal
        abierto={modalAnadirMaterial}
        titulo="Añadir material al evento"
        onCerrar={() => setModalAnadirMaterial(false)}
        tamano="sm"
      >
        <div className="space-y-4">
          <select
            value={materialAnadir}
            onChange={(e) => setMaterialAnadir(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Seleccionar material disponible...</option>
            {materialDisponible?.contenido
              .filter((m) => !evento.lineas.some((l) => l.materialId === m.id))
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.numeroSerie ? `· ${m.numeroSerie}` : ''}
                </option>
              ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variante="secundario" onClick={() => setModalAnadirMaterial(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => materialAnadir && agregarMaterial(Number(materialAnadir))}
              cargando={anadiendo}
              disabled={!materialAnadir}
            >
              Añadir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
