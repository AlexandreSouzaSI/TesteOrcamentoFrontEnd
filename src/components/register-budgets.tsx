import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getCategory } from '@/api/get-category' // Importar a função para buscar categorias
import { registerBudgets } from '@/api/register-budgets'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { Calendar } from './ui/calendar'
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

// Atualizar o schema para incluir a categoria
const budgetsBodyForm = z.object({
  name: z.string(),
  valor: z.coerce.number(),
  status: z.string().optional(),
  userId: z.string(),
  dataVencimento: z.date().optional(),
  categoriaId: z.string().optional(),
})

type BudgetsBodySchema = z.infer<typeof budgetsBodyForm>

export interface RegisterBudgetsModalProps {
  onClose: () => void
}

export function RegisterBudgetsModal({ onClose }: RegisterBudgetsModalProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<BudgetsBodySchema>()
  const queryClient = useQueryClient()

  const { mutateAsync: registerBudgetsFn } = useMutation({
    mutationFn: registerBudgets,
    onSuccess: async () => {
      toast.success('Despesa criada com sucesso')
      await queryClient.invalidateQueries()
      onClose()
    },
    onError: () => {
      toast.error('Falha ao criar uma despesa. Tente novamente.')
    },
  })

  const { data: result, isLoading: categoriesLoading } = useQuery({
    queryKey: ['category'],
    queryFn: () => getCategory({ pageIndex: 0, name: '' }),
  })

  useEffect(() => {
    if (result) {
      setCategories(result.categoria)
    }
  }, [result])

  async function handleRegisterBudgets(data: BudgetsBodySchema) {
    try {
      await registerBudgetsFn({
        name: data.name,
        valor: data.valor,
        status: data.status,
        dataVencimento: data.dataVencimento
          ? format(data.dataVencimento, 'yyyy-MM-dd')
          : undefined,
        categoriaId: data.categoriaId,
      })
    } catch (error) {
      // A mensagem de erro já está sendo tratada pelo onError do mutateAsync
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Despesa</DialogTitle>
        <DialogDescription>Painel para adicionar uma despesa</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterBudgets)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />

            <Label className="text-right" htmlFor="valor">
              Valor
            </Label>
            <Input className="col-span-3" id="valor" {...register('valor')} />

            <Label className="text-right" htmlFor="dataVencimento">
              Data Vencimento
            </Label>
            <Controller
              name="dataVencimento"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'col-span-3 w-[240px] justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? (
                        format(value, 'PPP', { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={value}
                      onSelect={(selectedDate) => onChange(selectedDate)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />

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

            <Label className="text-right" htmlFor="status">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => (
                <Select
                  defaultValue="all"
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
