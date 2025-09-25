import { DialogTitle } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'

import { getProdutoDetails } from '@/api/product/get-product-details'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface ProductDetailsProps {
  produtoId: string
  open: boolean
}

export function ProductDetails({ produtoId, open }: ProductDetailsProps) {
  const { data: produto } = useQuery({
    queryKey: ['product', produtoId],
    queryFn: () => getProdutoDetails({ produtoId }),
    enabled: open,
  })

  if (!produto) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {produto.id}</DialogTitle>
        <DialogDescription>Detalhes do Produto</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Nome</TableCell>
              <TableCell className="flex justify-end">{produto.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Quantidade em Estoque
              </TableCell>
              <TableCell className="flex justify-end">
                {produto.quantidadeEstoque}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">
                Quantidade Minima
              </TableCell>
              <TableCell className="flex justify-end">
                {produto.quantidadeMinima}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Categoria</TableCell>
              <TableCell className="flex justify-end">
                {produto.categoria}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
