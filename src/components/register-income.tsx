import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerIncome } from '@/api/register-income'

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
  name: z.string(),
  valor: z.coerce.number(),
  status: z.string(),
})

type IncomeBodySchema = z.infer<typeof incomeBodyForm>

export interface RegisterIncomeModalProps {
  onClose: () => void
}

export function RegisterIncomeModal({ onClose }: RegisterIncomeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<IncomeBodySchema>()
  const queryClient = useQueryClient()

  const { mutateAsync: registerIncomeFn } = useMutation({
    mutationFn: registerIncome,
    onSuccess: async () => {
      toast.success('Renda criada com sucesso')
      await queryClient.invalidateQueries()
      onClose()
    },
    onError: () => {
      toast.error('Falha ao criar uma renda. Tente novamente.')
    },
  })

  async function handleRegisterIncome(data: IncomeBodySchema) {
    try {
      await registerIncomeFn({
        name: data.name,
        valor: data.valor,
        status: data.status,
      })
    } catch (error) {}
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Renda</DialogTitle>
        <DialogDescription>Painel para adicionar uma renda</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterIncome)}>
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

            {/* <Label className="text-right" htmlFor="date">
                            Data
                        </Label>
                        <Input type="date" className="col-span-3" id="dataVencimento" {...register('data')}/> */}

            <Label className="text-right" htmlFor="status">
              Status
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field: { name, onChange, value, disabled } }) => {
                return (
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
                      <SelectItem value="pendente">pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="vencido">Vencido</SelectItem>
                    </SelectContent>
                  </Select>
                )
              }}
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
