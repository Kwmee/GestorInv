import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { materialApi } from '@/api/material.api'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { CategoriaMaterial, Material, MaterialRequest } from '@/types'

interface Props {
  material: Material | null
  categorias: CategoriaMaterial[]
  onExito: () => void
}

export function MaterialForm({ material, categorias, onExito }: Props) {
  const esEdicion = !!material

  const { register, handleSubmit, formState: { errors } } = useForm<MaterialRequest>({
    defaultValues: material
      ? {
          categoriaId: material.categoria.id,
          nombre: material.nombre,
          descripcion: material.descripcion,
          marca: material.marca,
          modelo: material.modelo,
          numeroSerie: material.numeroSerie,
          cantidad: material.cantidad,
          valorUnitario: material.valorUnitario,
          fechaAdquisicion: material.fechaAdquisicion,
          esFungible: material.esFungible,
          stockMinimo: material.stockMinimo,
          observaciones: material.observaciones,
        }
      : { cantidad: 1, esFungible: false, stockMinimo: 0 },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MaterialRequest) =>
      esEdicion ? materialApi.actualizar(material!.id, data) : materialApi.crear(data),
    onSuccess: () => {
      toast.success(esEdicion ? 'Material actualizado' : 'Material creado')
      onExito()
    },
    onError: (err: any) => toast.error(err.response?.data?.mensaje ?? 'Error al guardar'),
  })

  return (
    <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Nombre *"
            placeholder="Ej: Line Array L-Acoustics K2"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
        </div>

        <Select
          label="Categoría *"
          error={errors.categoriaId?.message}
          {...register('categoriaId', { required: 'Selecciona una categoría', valueAsNumber: true })}
        >
          <option value="">Seleccionar...</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </Select>

        <Input
          label="Número de serie"
          placeholder="Ej: LA-K2-001"
          {...register('numeroSerie')}
        />

        <Input label="Marca" placeholder="Ej: L-Acoustics" {...register('marca')} />
        <Input label="Modelo" placeholder="Ej: K2" {...register('modelo')} />

        <Input
          label="Cantidad *"
          type="number"
          min={1}
          error={errors.cantidad?.message}
          {...register('cantidad', { required: true, valueAsNumber: true, min: 1 })}
        />

        <Input
          label="Valor unitario (€)"
          type="number"
          step="0.01"
          min={0}
          placeholder="0.00"
          {...register('valorUnitario', { valueAsNumber: true })}
        />

        <Input
          label="Fecha de adquisición"
          type="date"
          {...register('fechaAdquisicion')}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-zinc-300">Es fungible / consumible</label>
          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded" {...register('esFungible')} />
            <span className="text-sm text-gray-600 dark:text-zinc-400">Sí, gestionar por stock</span>
          </label>
        </div>

        <Input
          label="Stock mínimo"
          type="number"
          min={0}
          {...register('stockMinimo', { valueAsNumber: true })}
        />

        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 block mb-1">Descripción</label>
          <textarea
            rows={2}
            placeholder="Descripción técnica del material..."
            className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('descripcion')}
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 block mb-1">Observaciones</label>
          <textarea
            rows={2}
            placeholder="Notas adicionales..."
            className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('observaciones')}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 border-t dark:border-zinc-800">
        <Button type="submit" cargando={isPending}>
          {esEdicion ? 'Guardar cambios' : 'Crear material'}
        </Button>
      </div>
    </form>
  )
}
