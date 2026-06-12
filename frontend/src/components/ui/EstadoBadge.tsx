import type { EstadoMaterial, EstadoEvento, EstadoDevolucion, EstadoChecklistItem } from '@/types'
import clsx from 'clsx'

type EstadoCombinado = EstadoMaterial | EstadoEvento | EstadoDevolucion | EstadoChecklistItem

const colores: Record<EstadoCombinado, string> = {
  DISPONIBLE:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  EN_EVENTO:       'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  EN_REPARACION:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  BAJA:            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  PLANIFICADO:     'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400',
  EN_CARGA:        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  ACTIVO:          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  DEVOLVIENDO:     'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  FINALIZADO:      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELADO:       'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  PENDIENTE:       'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  OK:              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CON_INCIDENCIA:  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  NO_DEVUELTO:     'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  CARGADO:         'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PARCIAL:         'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  FALTANTE:        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const etiquetas: Record<EstadoCombinado, string> = {
  DISPONIBLE:      'Disponible',
  EN_EVENTO:       'En evento',
  EN_REPARACION:   'En reparación',
  BAJA:            'Baja',
  PLANIFICADO:     'Planificado',
  EN_CARGA:        'Cargando',
  ACTIVO:          'En ruta / evento',
  DEVOLVIENDO:     'Devolviendo',
  FINALIZADO:      'Finalizado',
  CANCELADO:       'Cancelado',
  PENDIENTE:       'Pendiente',
  OK:              'OK',
  CON_INCIDENCIA:  'Con incidencia',
  NO_DEVUELTO:     'No devuelto',
  CARGADO:         'Cargado',
  PARCIAL:         'Parcial',
  FALTANTE:        'Faltante',
}

interface Props {
  estado: EstadoCombinado
  className?: string
}

export function EstadoBadge({ estado, className }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      colores[estado],
      className
    )}>
      {etiquetas[estado]}
    </span>
  )
}
