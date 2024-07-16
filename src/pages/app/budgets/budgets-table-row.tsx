import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, FilePenIcon, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteBudgets } from '@/api/delete-budgets'
import { editBudgets } from '@/api/edit-budgets'
import { EditBudgetsModal } from '@/components/edit-budgets'
import { Status } from '@/components/status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { BusgetsDetails } from './budgets-details'

export interface Despesa {
  id: string
  name: string
  data: string | null
  valor: number
  status: 'vencido' | 'pago' | 'normal' | 'pendente'
  createdAt: Date
  updatedAt: Date | null | undefined
  userId: string
}

export interface DespesaTableRowProps {
  despesa: Despesa
}

export function BudgetsTableRow({ despesa }: DespesaTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: deleteBudgetsFn } = useMutation({
    mutationFn: deleteBudgets,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Despesa excluída com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir a despesa. Tente novamente.')
    },
  })

  const { mutateAsync: editBudgetsFn } = useMutation({
    mutationFn: editBudgets,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Despesa editada com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao editar a despesa. Tente novamente.')
    },
  })

  return (
    <>
      <TableRow key={despesa.id}>
        <TableCell>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes do orçamento</span>
              </Button>
            </DialogTrigger>
            <BusgetsDetails open={isDetailsOpen} budgetsId={despesa.id} />
          </Dialog>
        </TableCell>
        <TableCell className="font-medium">{despesa.name}</TableCell>
        <TableCell className="font-medium">{`R$ ${despesa.valor.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}`}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              <Status status={despesa.status ? despesa.status : 'pendente'} />
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Button
            onClick={() =>
              editBudgetsFn({ budgetsId: despesa.id, status: 'pago' })
            }
            variant="ghost"
            size="xs"
          >
            <Check className="mr-2 h-3 w-3 fill-green-500" />
            Informar pagamento
          </Button>
        </TableCell>
        <TableCell>
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsEditOpen(true)}
                variant="ghost"
                size="xs"
              >
                <FilePenIcon className="mr-2 h-3 w-3" />
                Editar
              </Button>
            </DialogTrigger>
            <EditBudgetsModal
              onClose={() => setIsEditOpen(false)}
              open={isEditOpen}
              budgetsId={despesa.id}
            />
          </Dialog>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => deleteBudgetsFn({ budgetsId: despesa.id })}
            disabled={
              !['vencido', 'normal', 'pendente'].includes(despesa.status)
            }
            variant="ghost"
            size="xs"
          >
            <Trash2 className="mr-2 h-3 w-3 fill-red-400" />
            Excluir
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
