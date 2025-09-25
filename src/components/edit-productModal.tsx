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

const productBodyForm = z.object({
  produtoId: z.string(),
  name: z.string().optional(),
  quantidadeEstoque: z.coerce.number().optional(),
  quantidadeMinima: z.coerce.number().optional(),
  categoriaId: z.string().optional(),
})

type ProductBodySchema = z.infer<typeof productBodyForm>

export interface ProductDetailsProps {
  produtoId: string
  open: boolean
  onClose: () => void
}

export function EditProductModal({
  produtoId,
  open,
  onClose,
}: ProductDetailsProps) {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  )

  const { data: result, isLoading } = useQuery({
    queryKey: ['product', produtoId],
    queryFn: () => getProdutoDetails({ produtoId }),
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
  } = useForm<ProductBodySchema>({
    resolver: zodResolver(productBodyForm),
  })

  const { mutateAsync: updateProductFn } = useMutation({
    mutationFn: editProduct,
    onSuccess: async () => {
      toast.success('Produto atualizado com sucesso')
      onClose()
      await queryClient.invalidateQueries()
    },
    onError: () => {
      toast.error('Falha ao atualizar o produto. Tente novamente.')
    },
  })

  useEffect(() => {
    if (result) {
      reset({
        produtoId: result.id,
        name: result.name ?? '',
        quantidadeEstoque: result.quantidadeEstoque ?? '',
        quantidadeMinima: result.quantidadeMinima ?? '',
        categoriaId: result.categoria ?? '',
      })
    }
  }, [result, reset])

  if (isLoading || !result) {
    return null
  }

  async function handleUpdateProduct(data: ProductBodySchema) {
    try {
      await updateProductFn({
        produtoId: data.produtoId,
        name: data.name,
        quantidadeEstoque: data.quantidadeEstoque,
        quantidadeMinima: data.quantidadeMinima,
        categoriaId: data.categoriaId
      })
    } catch (error) {
      toast.error('Falha ao atualizar a categoria. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Produto</DialogTitle>
        <DialogDescription>Painel para editar um produto</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProduct)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />

            <Label className="text-right" htmlFor="quantidadeEstoque">
              Quantidade Estoque
            </Label>
            <Input className="col-span-3" id="name" {...register('quantidadeEstoque')} />

            <Label className="text-right" htmlFor="quantidadeMinima">
              Quantidade Minima
            </Label>
            <Input className="col-span-3" id="name" {...register('quantidadeMinima')} />

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
