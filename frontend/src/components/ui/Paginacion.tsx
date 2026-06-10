import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  paginaActual: number
  totalPaginas: number
  onCambiar: (pagina: number) => void
}

export function Paginacion({ paginaActual, totalPaginas, onCambiar }: Props) {
  if (totalPaginas <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        disabled={paginaActual === 0}
        onClick={() => onCambiar(paginaActual - 1)}
        className="p-1.5 rounded disabled:opacity-40 hover:bg-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => (
        <button
          key={i}
          onClick={() => onCambiar(i)}
          className={clsx(
            'w-8 h-8 rounded text-sm font-medium',
            i === paginaActual
              ? 'bg-blue-700 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={paginaActual === totalPaginas - 1}
        onClick={() => onCambiar(paginaActual + 1)}
        className="p-1.5 rounded disabled:opacity-40 hover:bg-gray-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
