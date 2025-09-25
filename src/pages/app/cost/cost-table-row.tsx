/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteCost } from '@/api/costs/delete-costs'
import { DeleteConfirmationModal } from '@/components/delete-ConfirmationModal'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { CostDetails } from './cost-details'
import { CostEdit } from './cost-edit'

export interface Custo {
  id: string
  name: string
  descricao?: string
  categoria: string
}

export interface CustoTableRowProps {
  custo: Custo
}

export function CostTableRow({ custo }: CustoTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutateAsync: deleteCostFn } = useMutation({
    mutationFn: deleteCost,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Custo excluído com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir o custo. Tente novamente.')
    },
  })

  return (
    <>
      <TableRow key={custo.id}>
        <TableCell>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes do custo</span>
              </Button>
            </DialogTrigger>
            {isDetailsOpen && (
              <CostDetails open={isDetailsOpen} custoId={custo.id} />
            )}
          </Dialog>
        </TableCell>
        <TableCell className="font-medium">{custo.name}</TableCell>
        <TableCell className="font-medium">{custo.categoria}</TableCell>
        <TableCell className="font-medium">{custo.descricao}</TableCell>
        <TableCell>
          <CostEdit custo={custo} />
        </TableCell>
        <TableCell>
          <DeleteConfirmationModal
            onConfirm={() => deleteCostFn({ custoId: custo.id })}
            status={''}
            entityName="Custo"
          />
        </TableCell>
      </TableRow>
    </>
  )
}
