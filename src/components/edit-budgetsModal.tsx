import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { editBudgets } from '@/api/budgets/edit-budgets'
import { getBudgetsDetails } from '@/api/budgets/get-budgets-details'
import { getCategory } from '@/api/category/get-category'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { formatValue } from '@/lib/formatValue'
import { format } from 'date-fns'

const budgetsBodyForm = z.object({
  budgetsId: z.string(),
  name: z.string().optional(),
  data: z.string().optional(),
  valor: z.coerce.number().optional(),
  status: z.string().optional(),
  dataVencimento: z.string().optional(),
  categoriaId: z.string().optional(),
  produtoId: z.string().optional(),
  quantidade: z.coerce.number().optional(),
  valorUnitario: z.coerce.number().optional(),
})

type BudgetsBodySchema = z.infer<typeof budgetsBodyForm>

export interface BudgetsDetailsProps {
  budgetsId: string
  open: boolean
  onClose: () => void
}

export function EditBudgetsModal({
  budgetsId,
  open,
  onClose,
}: BudgetsDetailsProps) {
  const queryClient = useQueryClient()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  )

  const { data: result, isLoading } = useQuery({
    queryKey: ['budgets', budgetsId],
    queryFn: () => getBudgetsDetails({ budgetsId }),
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
  } = useForm<BudgetsBodySchema>({
    resolver: zodResolver(budgetsBodyForm),
  })

  const { mutateAsync: updateBudgetsFn } = useMutation({
    mutationFn: editBudgets,
    onSuccess: async () => {
      toast.success('Despesa atualizada com sucesso')
      onClose()
      await queryClient.invalidateQueries()
    },
    onError: () => {
      toast.error('Falha ao atualizar a despesa. Tente novamente.')
    },
  })

  useEffect(() => {
    if (result) {
      reset({
        budgetsId: result.id,
        name: result.name ?? '',
        data: result.data ?? '',
        valor: result.valor ?? '',
        status: result.status ?? '',
        dataVencimento: result.dataVencimento ?? '',
        categoriaId: result.categoriaId ?? '',
        produtoId: result.produtoId ?? '',
        quantidade: result.quantidade ?? 0,
        valorUnitario: result.valorUnitario ?? 0,
      })
    }
  }, [result, reset])

  useEffect(() => {
    if (categoryResult) {
      setCategories(categoryResult.categoria)
    }
  }, [categoryResult])

  if (isLoading || !result) {
    return null
  }

  async function handleUpdateBudgets(data: BudgetsBodySchema) {
    const quantidade = formatValue(data.quantidade ?? '0');
    const valorUnitario = formatValue(data.valorUnitario ?? '0');
    let valor = formatValue(data.valor);

    console.log("valorUnitario: ", valorUnitario)
  
    if (quantidade && valorUnitario) {
      valor = quantidade * valorUnitario;
    }

    try {
      await updateBudgetsFn({
        budgetsId: data.budgetsId,
        name: data.name,
        valor: data.valor,
        data: data.data,
        status: data.status,
        dataVencimento: data.dataVencimento
          ? format(data.dataVencimento, 'yyyy-MM-dd')
          : undefined,
        categoriaId: data.categoriaId,
        produtoId: data.produtoId,
        quantidade: data.quantidade,
        valorUnitario: data.valorUnitario,
      })
    } catch (error) {
      toast.error('Falha ao atualizar a despesa. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Despesa</DialogTitle>
        <DialogDescription>Painel para editar uma despesa</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateBudgets)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />

            <Label className="text-right" htmlFor="name">
              Quantidade
            </Label>
            <Input className="col-span-3" id="name" {...register('quantidade')} />

            <Label className="text-right" htmlFor="name">
              Valor Unitario
            </Label>
            <Input className="col-span-3" id="name" {...register('valorUnitario')} />

            <Label className="text-right" htmlFor="valor">
              Valor
            </Label>
            <Input className="col-span-3" id="valor" {...register('valor')} />

            <Label className="text-right" htmlFor="dataVencimento">
              Data do Vencimento
            </Label>
            <Input
              type="date"
              className="col-span-3"
              id="dataVencimento"
              {...register('dataVencimento')}
            />

            <Label className="text-right" htmlFor="categoriaId">
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

            <Label className="text-right" htmlFor="status">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => (
                <Select
                  defaultValue="pendente"
                  name={name}
                  onValueChange={onChange}
                  value={value}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-[342px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                    <SelectItem value="hoje">Hoje</SelectItem>
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
