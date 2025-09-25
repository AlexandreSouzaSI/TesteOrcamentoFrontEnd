import { DialogTitle } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'

import { getIncomeDetails } from '@/api/income/get-income-details'
import { Status } from '@/components/status'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface IncomeDetailsProps {
  incomeId: string
  open: boolean
}

export function IncomeDetails({ incomeId, open }: IncomeDetailsProps) {
  const { data: income } = useQuery({
    queryKey: ['income', incomeId],
    queryFn: () => getIncomeDetails({ incomeId }),
    enabled: open,
  })

  if (!income) {
    return null
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Receita: {income.id}</DialogTitle>
        <DialogDescription>Detalhes da Receita</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Status</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">
                    <Status status={income.status} />
                  </span>
                </div>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Nome</TableCell>
              <TableCell className="flex justify-end">{income.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Valor</TableCell>
              <TableCell className="flex justify-end">
                {`R$ ${income.valor.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}`}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="text-muted-foreground">Data</TableCell>
              <TableCell className="flex justify-end">{'-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
