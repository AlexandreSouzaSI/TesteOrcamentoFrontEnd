/* eslint-disable react-hooks/exhaustive-deps */
import { DialogTrigger } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, FilePenIcon, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteIncome } from '@/api/income/delete-income'
import { editIncome } from '@/api/income/edit-income'
import { DeleteConfirmationModal } from '@/components/delete-ConfirmationModal'
import { EditIncomeModal } from '@/components/edit-incomeModal'
import { Status } from '@/components/status'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDate, isDateFuture, isDateToday } from '@/lib/formatData'

import { IncomeDetails } from './income-details'

export interface Renda {
  id: string
  name: string
  data: string | null
  valor: number
  status: 'vencido' | 'pago' | 'normal' | 'pendente' | 'hoje'
  createdAt: Date
  updatedAt: Date | null | undefined
  userId: string
  categoria: string
}

export interface RendaTableRowProps {
  income: Renda
}

export function IncomeTableRow({ income }: RendaTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync: deleteIncomeFn } = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Renda excluída com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir a renda. Tente novamente.')
    },
  })

  const { mutateAsync: editIncomeFn } = useMutation({
    mutationFn: editIncome,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Renda editada com sucesso.')
      setIsEditOpen(false) // Fechar o modal ao sucesso
    },
    onError: () => {
      toast.error('Falha ao editar a renda. Tente novamente.')
    },
  })

  const handleStatusChange = async (newStatus: Renda['status']) => {
    try {
      await editIncomeFn({
        incomeId: income.id,
        status: newStatus,
        data: income.data,
      })
      queryClient.invalidateQueries()
      toast.success('Status atualizado com sucesso.')
    } catch (error) {
      toast.error('Falha ao atualizar o status. Tente novamente.')
    }
  }

  const getStatus = () => {
    if (income.data) {
      if (isDateToday(income.data) && income.status !== 'pago') {
        return 'hoje'
      }
      if (isDateFuture(income.data) && income.status !== 'pago') {
        return 'pendente'
      }
      if (
        !isDateFuture(income.data) &&
        !isDateToday(income.data) &&
        income.status !== 'pago'
      ) {
        return 'vencido'
      }
    }
    return income.status || 'pendente'
  }

  useEffect(() => {
    const visualStatus = getStatus()
    if (visualStatus !== income.status) {
      handleStatusChange(visualStatus)
    }
  }, [income])

  return (
    <>
      <TableRow key={income.id}>
        <TableCell>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes da receita</span>
              </Button>
            </DialogTrigger>
            {isDetailsOpen && (
              <IncomeDetails open={isDetailsOpen} incomeId={income.id} />
            )}
          </Dialog>
        </TableCell>
        <TableCell className="font-medium">{income.name}</TableCell>
        <TableCell className="font-medium">{income.categoria || '-'}</TableCell>
        <TableCell className="font-medium">{`R$ ${income.valor.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL',
          },
        )}`}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              {income.data ? formatDate(income.data) : '-'}
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
            Informar recebimento
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
            <EditIncomeModal
              onClose={() => setIsEditOpen(false)}
              open={isEditOpen}
              incomeId={income.id}
            />
          </Dialog>
        </TableCell>
        <TableCell>
          <DeleteConfirmationModal
            onConfirm={() => deleteIncomeFn({ incomeId: income.id })}
            status={income.status}
            entityName="Renda"
          />
        </TableCell>
      </TableRow>
    </>
  )
}
