import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { RegisterBudgetsModal } from '@/components/register-budgets'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const budgetsFilterSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional(),
})

type BudgetsFilterSchema = z.infer<typeof budgetsFilterSchema>

export function BudgetsTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const name = searchParams.get('name')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } =
    useForm<BudgetsFilterSchema>({
      resolver: zodResolver(budgetsFilterSchema),
      defaultValues: {
        name: name ?? '',
        status: status ?? '',
      },
    })

  function handleFilter({ name, status }: BudgetsFilterSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }

      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('name')
      state.delete('status')
      state.set('page', '1')

      return state
    })

    reset({
      name: '',
      status: '',
    })
  }

  return (
    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
      <div className="flex justify-between">
        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmit(handleFilter)}
        >
          <span className="text-sm font-semibold">Filtros</span>
          <Input
            placeholder="Nome do Orçamento"
            className="h-8 w-[320px]"
            {...register('name')}
          />
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
                <SelectTrigger className="h-8 w-[180px]">
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

          <Button type="submit" variant="secondary" size="xs">
            <Search className="mr-2 h-4 w-4" />
            Filtrar resultados
          </Button>

          <Button
            onClick={handleClearFilters}
            type="button"
            variant="outline"
            size="xs"
          >
            <Search className="mr-2 h-4 w-4" />
            Remover filtros
          </Button>
        </form>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsRegisterOpen(true)}
            type="button"
            variant="green"
            size="xs"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Orçamento
          </Button>
        </DialogTrigger>
      </div>
      <RegisterBudgetsModal onClose={() => setIsRegisterOpen(false)} />
    </Dialog>
  )
}
