import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

interface Props {
  abierto: boolean
  titulo: string
  mensaje: string
  onConfirmar: () => void
  onCancelar: () => void
  cargando?: boolean
  textoConfirmar?: string
}

export function ConfirmDialog({
  abierto, titulo, mensaje,
  onConfirmar, onCancelar,
  cargando = false,
  textoConfirmar = 'Confirmar',
}: Props) {
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar} tamano="sm">
      <div className="flex gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600">{mensaje}</p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variante="secundario" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Button>
        <Button variante="peligro" onClick={onConfirmar} cargando={cargando}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  )
}
