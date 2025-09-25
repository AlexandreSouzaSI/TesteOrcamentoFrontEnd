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
import { registerCosts } from '@/api/costs/register-costs'
import { editCategory } from '@/api/category/edit-category'

const costBodyForm = z.object({
  name: z.string(),
  descricao: z.string().optional(),
  categoriaId: z.string().optional(),
  produto: z.string().optional(),
})

type CostBodySchema = z.infer<typeof costBodyForm>

export interface RegisterCostModalProps {
  onClose: () => void
}

export function RegisterCostModal({ onClose }: RegisterCostModalProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  )
  const [searchParams] = useSearchParams()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<CostBodySchema>()
  const queryClient = useQueryClient()

  const { mutateAsync: registerCostFn } = useMutation({
    mutationFn: registerCosts,
    onSuccess: async () => {
      toast.success('Custo criado com sucesso')
      await queryClient.invalidateQueries()
      onClose()
    },
    onError: () => {
      toast.error('Falha ao criar um custo. Tente novamente.')
    },
  })

  const name = searchParams.get('name')
  const descricao = searchParams.get('descricao')

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

  async function handleRegisterCost(data: CostBodySchema) {
    try {
      if(data.categoriaId){
        await editCategory({
          categoriaId: data.categoriaId, // ou outro identificador da categoria
          produto: "false",       // definir produto como false
        });
      }
  
      // Registrar o custo
      await registerCostFn({
        name: data.name,
        descricao: data.descricao,
        categoriaId: data.categoriaId,
      });
    } catch (error) {
      // A mensagem de erro já está sendo tratada pelo onError do mutateAsync
    }
  }
  

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Custo</DialogTitle>
        <DialogDescription>
          Painel para adicionar um custo
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterCost)}>
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
