/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteProduct } from '@/api/product/delete-product'
import { DeleteConfirmationModal } from '@/components/delete-ConfirmationModal'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { ProductDetails } from './product-details'
import { ProductEdit } from './product-edit'

export interface Produto {
  id: string
  name: string
  quantidadeEstoque?: number
  quantidadeMinima?: number
  categoria: string
}

export interface ProdutoTableRowProps {
  produto: Produto
}

export function ProductTableRow({ produto }: ProdutoTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutateAsync: deleteProductFn } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Produto excluído com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir o produto. Tente novamente.')
    },
  })

  return (
    <>
      <TableRow key={produto.id}>
        <TableCell>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes do produto</span>
              </Button>
            </DialogTrigger>
            {isDetailsOpen && (
              <ProductDetails open={isDetailsOpen} produtoId={produto.id} />
            )}
          </Dialog>
        </TableCell>
        <TableCell className="font-medium">{produto.name}</TableCell>
        <TableCell className="font-medium">{produto.categoria}</TableCell>
        <TableCell className="font-medium">
          {produto.quantidadeMinima}
        </TableCell>
        <TableCell className="font-medium">
          {produto.quantidadeEstoque}
        </TableCell>
        <TableCell>
          <ProductEdit produto={produto} />
        </TableCell>
        <TableCell>
          <DeleteConfirmationModal
            onConfirm={() => deleteProductFn({ productId: produto.id })}
            status={''}
            entityName="Produto"
          />
        </TableCell>
      </TableRow>
    </>
  )
}
