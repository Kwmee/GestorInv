import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import clsx from 'clsx'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  tamano?: 'sm' | 'md' | 'lg' | 'xl'
}

const tamanos = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ abierto, titulo, onCerrar, children, tamano = 'md' }: Props) {
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCerrar}
      />
      <div className={clsx(
        'relative w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl flex flex-col max-h-[90vh]',
        tamanos[tamano]
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
