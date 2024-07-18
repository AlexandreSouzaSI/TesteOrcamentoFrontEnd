/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteBudgets } from '@/api/delete-budgets'
import { editBudgets } from '@/api/edit-budgets'
import { DeleteConfirmationModal } from '@/components/delete-ConfirmationModal'
import { Status } from '@/components/status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate, isDateFuture, isDateToday } from '@/lib/formatData'

import { BusgetsDetails } from './budgets-details'
import { BusgetsEdit } from './budgets-edit'

export interface Despesa {
  id: string
  name: string
  dataVencimento: string | null
  valor: number
  status: 'vencido' | 'pago' | 'normal' | 'pendente' | 'hoje'
  createdAt: Date
  updatedAt: Date | null | undefined
  userId: string
}

export interface DespesaTableRowProps {
  despesa: Despesa
}

export function BudgetsTableRow({ despesa }: DespesaTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

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

  const handleStatusChange = async (newStatus: Despesa['status']) => {
    try {
      await editBudgetsFn({ budgetsId: despesa.id, status: newStatus })
      queryClient.invalidateQueries()
      toast.success('Status atualizado com sucesso.')
    } catch (error) {
      toast.error('Falha ao atualizar o status. Tente novamente.')
    }
  }

  const getStatus = () => {
    if (despesa.dataVencimento) {
      if (isDateToday(despesa.dataVencimento) && despesa.status !== 'pago') {
        return 'hoje'
      }
      if (isDateFuture(despesa.dataVencimento) && despesa.status !== 'pago') {
        return 'pendente'
      }
      if (
        !isDateFuture(despesa.dataVencimento) &&
        !isDateToday(despesa.dataVencimento) &&
        despesa.status !== 'pago'
      ) {
        return 'vencido'
      }
    }
    return despesa.status || 'pendente'
  }

  useEffect(() => {
    const visualStatus = getStatus()
    if (visualStatus !== despesa.status) {
      handleStatusChange(visualStatus)
    }
  }, [despesa])

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
            {isDetailsOpen && (
              <BusgetsDetails open={isDetailsOpen} budgetsId={despesa.id} />
            )}
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
              {despesa.dataVencimento
                ? formatDate(despesa.dataVencimento)
                : '-'}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              <Status status={getStatus()} />
            </span>
          </div>
        </TableCell>
        <TableCell>
          <Button
            onClick={() => handleStatusChange('pago')}
            variant="ghost"
            size="xs"
          >
            <Check className="mr-2 h-3 w-3 fill-green-500" />
            Informar pagamento
          </Button>
        </TableCell>
        <TableCell>
          <BusgetsEdit despesa={despesa} />
        </TableCell>
        <TableCell>
          <DeleteConfirmationModal
            onConfirm={() => deleteBudgetsFn({ budgetsId: despesa.id })}
            status={despesa.status}
          />
        </TableCell>
      </TableRow>
    </>
  )
}
