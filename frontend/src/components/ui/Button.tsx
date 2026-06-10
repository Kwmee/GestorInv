import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro' | 'fantasma'
  tamano?: 'sm' | 'md' | 'lg'
  cargando?: boolean
}

const varianteClases = {
  primario:   'bg-blue-700 hover:bg-blue-800 text-white border-transparent',
  secundario: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
  peligro:    'bg-red-600 hover:bg-red-700 text-white border-transparent',
  fantasma:   'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent',
}

const tamanoClases = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variante = 'primario',
  tamano = 'md',
  cargando = false,
  disabled,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || cargando}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md border font-medium',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        varianteClases[variante],
        tamanoClases[tamano],
        className
      )}
      {...props}
    >
      {cargando && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
