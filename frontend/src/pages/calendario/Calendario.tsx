import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday,
  addMonths, subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { eventoApi } from '@/api/evento.api'
import { EstadoBadge } from '@/components/ui/EstadoBadge'
import type { Evento } from '@/types'
import clsx from 'clsx'

const COLOR_ESTADO: Record<string, string> = {
  PLANIFICADO: 'bg-zinc-200 text-zinc-700',
  EN_CARGA:    'bg-orange-100 text-orange-700',
  ACTIVO:      'bg-blue-100 text-blue-700',
  DEVOLVIENDO: 'bg-violet-100 text-violet-700',
  FINALIZADO:  'bg-emerald-100 text-emerald-700',
  CANCELADO:   'bg-red-100 text-red-600',
}

export function Calendario() {
  const navigate = useNavigate()
  const [mes, setMes] = useState(new Date())

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos-todos'],
    queryFn: () => eventoApi.listar({ size: 200 }).then(r => r.contenido),
  })

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  const inicio = startOfWeek(startOfMonth(mes), { weekStartsOn: 1 })
  const fin    = endOfWeek(endOfMonth(mes),     { weekStartsOn: 1 })
  const dias   = eachDayOfInterval({ start: inicio, end: fin })

  const eventosDelDia = (dia: Date) =>
    eventos.filter(e => {
      const ini = new Date(e.fechaInicio)
      const fin = e.fechaFin ? new Date(e.fechaFin) : ini
      return dia >= new Date(ini.toDateString()) && dia <= new Date(fin.toDateString())
    })

  const eventosSemana = eventos.filter(e => {
    const ini = new Date(e.fechaInicio)
    return ini.getMonth() === mes.getMonth() && ini.getFullYear() === mes.getFullYear()
  }).sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Calendario</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-0.5">Vista de eventos por mes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMes(subMonths(mes, 1))}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 capitalize w-36 text-center">
            {format(mes, "MMMM yyyy", { locale: es })}
          </span>
          <button
            onClick={() => setMes(addMonths(mes, 1))}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button
            onClick={() => setMes(new Date())}
            className="px-3 h-8 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 ml-2"
          >
            Hoy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        {/* Cuadrícula del calendario */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          {/* Cabecera días semana */}
          <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--card-border)' }}>
            {diasSemana.map(d => (
              <div key={d} className="py-2.5 text-center text-2xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {d}
              </div>
            ))}
          </div>

          {/* Días */}
          <div className="grid grid-cols-7">
            {dias.map((dia, i) => {
              const evs = eventosDelDia(dia)
              const esHoy = isToday(dia)
              const esMes = isSameMonth(dia, mes)
              return (
                <div
                  key={i}
                  className={clsx(
                    'min-h-[100px] p-1.5 border-b border-r',
                    !esMes && 'opacity-40',
                    i % 7 === 6 && 'border-r-0',
                    Math.floor(i / 7) === Math.floor((dias.length - 1) / 7) && 'border-b-0',
                  )}
                  style={{ borderColor: 'var(--card-border)' }}
                >
                  <div className={clsx(
                    'w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1',
                    esHoy ? 'bg-blue-600 text-white' : 'text-zinc-700 dark:text-zinc-300'
                  )}>
                    {format(dia, 'd')}
                  </div>
                  <div className="space-y-0.5">
                    {evs.slice(0, 3).map(e => (
                      <button
                        key={e.id}
                        onClick={() => navigate(`/eventos/${e.id}`)}
                        className={clsx(
                          'w-full text-left text-[10px] font-medium px-1.5 py-0.5 rounded truncate',
                          COLOR_ESTADO[e.estado] ?? 'bg-zinc-100 text-zinc-600'
                        )}
                        title={e.nombre}
                      >
                        {e.nombre}
                      </button>
                    ))}
                    {evs.length > 3 && (
                      <span className="text-[10px] text-zinc-400 pl-1">+{evs.length - 3} más</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel lateral — eventos del mes */}
        <div className="rounded-xl border flex flex-col max-h-[680px]" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Este mes
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">{eventosSemana.length} eventos</p>
          </div>
          <div className="overflow-y-auto flex-1 divide-y" style={{ borderColor: 'var(--card-border)' }}>
            {isLoading && (
              <div className="p-4 space-y-2">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-md" />)}
              </div>
            )}
            {!isLoading && eventosSemana.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-400 dark:text-zinc-500">
                <CalendarDays className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Sin eventos este mes</p>
              </div>
            )}
            {eventosSemana.map(e => (
              <button
                key={e.id}
                onClick={() => navigate(`/eventos/${e.id}`)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors"
              >
                <div className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                  style={{ background: e.estado === 'ACTIVO' ? '#3b82f6' : e.estado === 'FINALIZADO' ? '#10b981' : e.estado === 'CANCELADO' ? '#ef4444' : '#a1a1aa' }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">{e.nombre}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{format(new Date(e.fechaInicio), "d MMM", { locale: es })}</p>
                </div>
                <EstadoBadge estado={e.estado} className="shrink-0 text-[10px]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
