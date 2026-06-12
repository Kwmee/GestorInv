import type { EstadoMaterial, EstadoEvento, EstadoDevolucion, EstadoChecklistItem } from '@/types'
import clsx from 'clsx'

type EstadoCombinado = EstadoMaterial | EstadoEvento | EstadoDevolucion | EstadoChecklistItem

const colores: Record<EstadoCombinado, { badge: string; dot: string }> = {
  DISPONIBLE:     { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
  EN_EVENTO:      { badge: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',                  dot: 'bg-blue-500' },
  EN_REPARACION:  { badge: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',             dot: 'bg-amber-500' },
  BAJA:           { badge: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',                         dot: 'bg-red-500' },
  PLANIFICADO:    { badge: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',                     dot: 'bg-gray-400' },
  EN_CARGA:       { badge: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',       dot: 'bg-orange-500' },
  ACTIVO:         { badge: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',                   dot: 'bg-blue-500 animate-pulse' },
  DEVOLVIENDO:    { badge: 'bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',       dot: 'bg-violet-500' },
  FINALIZADO:     { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
  CANCELADO:      { badge: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',                         dot: 'bg-red-400' },
  PENDIENTE:      { badge: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',             dot: 'bg-amber-400' },
  OK:             { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
  CON_INCIDENCIA: { badge: 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',       dot: 'bg-orange-500' },
  NO_DEVUELTO:    { badge: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',                         dot: 'bg-red-500' },
  CARGADO:        { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500' },
  PARCIAL:        { badge: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',             dot: 'bg-amber-500' },
  FALTANTE:       { badge: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',                         dot: 'bg-red-500' },
}

const etiquetas: Record<EstadoCombinado, string> = {
  DISPONIBLE:     'Disponible',
  EN_EVENTO:      'En evento',
  EN_REPARACION:  'En reparación',
  BAJA:           'Baja',
  PLANIFICADO:    'Planificado',
  EN_CARGA:       'Cargando',
  ACTIVO:         'En ruta',
  DEVOLVIENDO:    'Devolviendo',
  FINALIZADO:     'Finalizado',
  CANCELADO:      'Cancelado',
  PENDIENTE:      'Pendiente',
  OK:             'OK',
  CON_INCIDENCIA: 'Incidencia',
  NO_DEVUELTO:    'No devuelto',
  CARGADO:        'Cargado',
  PARCIAL:        'Parcial',
  FALTANTE:       'Faltante',
}

interface Props {
  estado: EstadoCombinado
  className?: string
}

export function EstadoBadge({ estado, className }: Props) {
  const { badge, dot } = colores[estado]
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium',
      badge,
      className
    )}>
      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dot)} />
      {etiquetas[estado]}
    </span>
  )
}
