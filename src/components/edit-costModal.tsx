import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { editCategory } from '@/api/category/edit-category'
import { getCategoryDetails } from '@/api/category/get-category-details'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { getProdutoDetails } from '@/api/product/get-product-details'
import { editProduct } from '@/api/product/edit-product'
import { getCategory } from '@/api/category/get-category'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { getCustosDetails } from '@/api/costs/get-costs-details'
import { editCosts } from '@/api/costs/edit-costs'

const costBodyForm = z.object({
  custoId: z.string(),
  name: z.string().optional(),
  descricao: z.string().optional(),
  categoriaId: z.string().optional(),
})

type CostBodySchema = z.infer<typeof costBodyForm>

export interface CostDetailsProps {
  custoId: string
  open: boolean
  onClose: () => void
}

export function EditCostModal({
  custoId,
  open,
  onClose,
}: CostDetailsProps) {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  )

  const { data: result, isLoading } = useQuery({
    queryKey: ['costs', custoId],
    queryFn: () => getCustosDetails({ custoId }),
    enabled: open,
  })

  const { data: categoryResult, isLoading: categoriesLoading } = useQuery({
    queryKey: ['category'],
    queryFn: () => getCategory({ pageIndex: 0, name: '' }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
    reset,
  } = useForm<CostBodySchema>({
    resolver: zodResolver(costBodyForm),
  })

  const { mutateAsync: updateCostFn } = useMutation({
    mutationFn: editCosts,
    onSuccess: async () => {
      toast.success('Custo atualizado com sucesso')
      onClose()
      await queryClient.invalidateQueries()
    },
    onError: () => {
      toast.error('Falha ao atualizar o custo. Tente novamente.')
    },
  })

  useEffect(() => {
    if (result) {
      reset({
        custoId: result.id,
        name: result.name ?? '',
        descricao: result.descricao ?? '',
        categoriaId: result.categoria ?? '',
      })
    }
  }, [result, reset])

  if (isLoading || !result) {
    return null
  }

  async function handleUpdateCost(data: CostBodySchema) {
    try {
      await updateCostFn({
        custoId: data.custoId,
        name: data.name,
        descricao: data.descricao,
        categoriaId: data.categoriaId
      })
    } catch (error) {
      toast.error('Falha ao atualizar o custo. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Custo</DialogTitle>
        <DialogDescription>Painel para editar um custo</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateCost)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />

            <Label className="text-right" htmlFor="descricao">
              Descrição
            </Label>
            <Input className="col-span-3" id="name" {...register('descricao')} />

            <Label className="text-right" htmlFor="categoria">
              Categoria
            </Label>
            <Controller
              name="categoriaId"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => (
                <Select
                  name={name}
                  onValueChange={onChange}
                  value={value}
                  disabled={disabled || categoriesLoading}
                >
                  <SelectTrigger className="col-span-3 w-[342px]">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="green" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
