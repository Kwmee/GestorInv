import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro' | 'fantasma'
  tamano?: 'sm' | 'md' | 'lg'
  cargando?: boolean
}

const varianteClases = {
  primario:   'bg-blue-600 hover:bg-blue-700 text-white border-transparent dark:bg-blue-600 dark:hover:bg-blue-700',
  secundario: 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 shadow-sm dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700',
  peligro:    'bg-red-600 hover:bg-red-700 text-white border-transparent',
  fantasma:   'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent dark:hover:bg-zinc-800 dark:text-zinc-300',
}

const tamanoClases = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5 h-7',
  md: 'px-3.5 py-1.5 text-sm gap-2 h-8',
  lg: 'px-5 py-2 text-sm gap-2 h-9',
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
        'inline-flex items-center justify-center rounded-md border font-medium leading-none',
        'transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
        varianteClases[variante],
        tamanoClases[tamano],
        className
      )}
      {...props}
    >
      {cargando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {children}
    </button>
  )
}
