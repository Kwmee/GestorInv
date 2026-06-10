import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FileDown, FileText } from 'lucide-react'
import { albaranApi } from '@/api/albaran.api'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Paginacion } from '@/components/ui/Paginacion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import clsx from 'clsx'

export function AlbaranListado() {
  const [pagina, setPagina] = useState(0)
  const [tipo, setTipo] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['albaranes', { pagina, tipo }],
    queryFn: () => albaranApi.listar({ page: pagina, tipo: tipo || undefined }),
  })

  const descargar = async (id: number, numero: string) => {
    try {
      const blob = await albaranApi.descargarPdf(id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${numero}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Error al descargar el PDF')
    }
  }

  const formatFecha = (iso: string) => format(new Date(iso), "d MMM yyyy HH:mm", { locale: es })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Albaranes</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {data ? `${data.totalElementos} albaranes` : ''}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <Select
          value={tipo}
          onChange={(e) => { setTipo(e.target.value); setPagina(0) }}
          className="w-52"
        >
          <option value="">Todos los tipos</option>
          <option value="SALIDA">Albaranes de salida</option>
          <option value="DEVOLUCION">Albaranes de devolución</option>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Número</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Evento</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Fecha emisión</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.contenido.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No se encontraron albaranes
                  </td>
                </tr>
              )}
              {data?.contenido.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="font-mono font-medium text-gray-900">{a.numero}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      'text-xs font-medium px-2.5 py-0.5 rounded-full',
                      a.tipo === 'SALIDA'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    )}>
                      {a.tipo === 'SALIDA' ? 'Salida' : 'Devolución'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{a.eventoNombre}</td>
                  <td className="px-4 py-3 text-gray-500">{formatFecha(a.fechaEmision)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variante="fantasma"
                      tamano="sm"
                      onClick={() => descargar(a.id, a.numero)}
                    >
                      <FileDown className="h-4 w-4" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {data && (
          <Paginacion
            paginaActual={data.paginaActual}
            totalPaginas={data.totalPaginas}
            onCambiar={setPagina}
          />
        )}
      </div>
    </div>
  )
}
