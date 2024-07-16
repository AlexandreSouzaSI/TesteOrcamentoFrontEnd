import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerBudgets } from '@/api/register-budgets'

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

const budgetsBodyForm = z.object({
  name: z.string(),
  valor: z.coerce.number(),
  status: z.string().optional(),
  userId: z.string(),
})

type BudgetsBodySchema = z.infer<typeof budgetsBodyForm>

export interface RegisterBudgetsModalProps {
  onClose: () => void
}

export function RegisterBudgetsModal({ onClose }: RegisterBudgetsModalProps) {
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

  async function handleRegisterBudgets(data: BudgetsBodySchema) {
    try {
      await registerBudgetsFn({
        name: data.name,
        valor: data.valor,
        status: data.status,
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
