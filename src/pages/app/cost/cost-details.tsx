import { DialogTitle } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getProdutoDetails } from '@/api/product/get-product-details'
import { getCustosDetails } from '@/api/costs/get-costs-details'

export interface CostDetailsProps {
  custoId: string
  open: boolean
}

export function CostDetails({ custoId, open }: CostDetailsProps) {
  const { data: custo } = useQuery({
    queryKey: ['costs', custoId],
    queryFn: () => getCustosDetails({ custoId }),
    enabled: open,
  })

  if (!custo) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Custo: {custo.id}</DialogTitle>
        <DialogDescription>Detalhes do Custo</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Nome</TableCell>
              <TableCell className="flex justify-end">
                {custo.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Descrição</TableCell>
              <TableCell className="flex justify-end">
                {custo.descricao}
              </TableCell>
              </TableRow>
              <TableRow>
              <TableCell className="text-muted-foreground">Categoria</TableCell>
              <TableCell className="flex justify-end">
                {custo.categoria}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
