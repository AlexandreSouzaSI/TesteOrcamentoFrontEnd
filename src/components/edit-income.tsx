/* eslint-disable react-hooks/rules-of-hooks */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { editIncome } from '@/api/edit-income'
import { getIncomeDetails } from '@/api/get-income-details'

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

const incomeBodyForm = z.object({
  incomeId: z.string(),
  name: z.string().optional(),
  valor: z.coerce.number().optional(),
  status: z.string().optional(),
})

type IncomeBodySchema = z.infer<typeof incomeBodyForm>

export interface IncomeDetailsProps {
  incomeId: string
  open: boolean
  onClose: () => void
}

export function EditIncomeModal({
  incomeId,
  open,
  onClose,
}: IncomeDetailsProps) {
  const queryClient = useQueryClient()
  const { data: result } = useQuery({
    queryKey: ['income', incomeId],
    queryFn: () => getIncomeDetails({ incomeId }),
    enabled: open,
  })

  if (!result) {
    return null
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<IncomeBodySchema>({
    resolver: zodResolver(incomeBodyForm),
    defaultValues: {
      incomeId: result.id,
      name: result.name ?? '',
      valor: result.valor ?? '',
      status: result.status ?? '',
    },
  })

  const { mutateAsync: updateIncomeFn } = useMutation({
    mutationFn: editIncome,
    onSuccess: async () => {
      toast.success('Renda atualizada com sucesso')
      onClose()
      await queryClient.invalidateQueries()
    },
    onError: () => {
      toast.error('Falha ao atualizar a renda. Tente novamente.')
    },
  })

  async function handleUpdateIncome(data: IncomeBodySchema) {
    try {
      await updateIncomeFn({
        incomeId: data.incomeId,
        name: data.name,
        valor: data.valor,
        status: data.status,
      })
    } catch (error) {
      toast.error('Falha ao atualizar a renda. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Renda</DialogTitle>
        <DialogDescription>Painel para editar uma renda</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateIncome)}>
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
