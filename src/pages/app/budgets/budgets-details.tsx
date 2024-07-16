import { DialogTitle } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'

import { getBudgetsDetails } from '@/api/get-budgets-details'
import { Status } from '@/components/status'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface BudgetsDetailsProps {
  budgetsId: string
  open: boolean
}

export function BusgetsDetails({ budgetsId, open }: BudgetsDetailsProps) {
  const { data: budgets } = useQuery({
    queryKey: ['budgets', budgetsId],
    queryFn: () => getBudgetsDetails({ budgetsId }),
    enabled: open,
  })

  if (!budgets) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Orçamento: {budgets.id}</DialogTitle>
        <DialogDescription>Detalhes do Orçamento</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">
                    <Status status={budgets.status} />
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Nome</TableCell>
              <TableCell className="flex justify-end">{budgets.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Valor</TableCell>
              <TableCell className="flex justify-end">
                {`R$ ${budgets.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}`}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">
                Vencimento
              </TableCell>
              <TableCell className="flex justify-end">{'-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
