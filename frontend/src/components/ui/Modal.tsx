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
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [abierto])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCerrar} />
      <div className={clsx(
        'relative w-full rounded-xl shadow-xl flex flex-col max-h-[90vh]',
        'border border-zinc-200 dark:border-zinc-800',
        tamanos[tamano]
      )} style={{ background: 'var(--card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--card-border)' }}>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
