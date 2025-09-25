import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerCategory } from '@/api/category/register-category'

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
import { registerProduct } from '@/api/product/register-product'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategory } from '@/api/category/get-category'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { editCategory } from '@/api/category/edit-category'

const productBodyForm = z.object({
  name: z.string(),
  quantidadeEstoque: z.coerce.number().optional(),
  quantidadeMinima: z.coerce.number().optional(),
  categoriaId: z.string().optional(),
})

type ProductBodySchema = z.infer<typeof productBodyForm>

export interface RegisterProductModalProps {
  onClose: () => void
}

export function RegisterProductModal({ onClose }: RegisterProductModalProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  )
  const [searchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<ProductBodySchema>()
  const queryClient = useQueryClient()

  const { mutateAsync: registerProductFn } = useMutation({
    mutationFn: registerProduct,
    onSuccess: async () => {
      toast.success('Produto criado com sucesso')
      await queryClient.invalidateQueries()
      onClose()
    },
    onError: () => {
      toast.error('Falha ao criar um produto. Tente novamente.')
    },
  })

  const name = searchParams.get('name')

  const pageIndex = z.coerce
    .number()
    .transform((pageIndex) => pageIndex - 1)
    .parse(searchParams.get('pageIndex') ?? '1')

  const { data: result, isLoading: categoriesLoading } = useQuery({
    queryKey: ['category', pageIndex, name],
    queryFn: () => getCategory({ pageIndex, name }),
  })

  useEffect(() => {
    if (result) {
      setCategories(result.categoria)
    }
  }, [result])

  async function handleRegisterProduct(data: ProductBodySchema) {
    try {
      if(data.categoriaId){
        await editCategory({
          categoriaId: data.categoriaId, // ou outro identificador da categoria
          produto: "true",       // definir produto como false
        });
      }
      await registerProductFn({
        name: data.name,
        quantidadeEstoque: data.quantidadeEstoque,
        quantidadeMinima: data.quantidadeMinima,
        categoriaId: data.categoriaId
      })
    } catch (error) {
      // A mensagem de erro já está sendo tratada pelo onError do mutateAsync
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Produto</DialogTitle>
        <DialogDescription>
          Painel para adicionar um produto
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterProduct)}>
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
