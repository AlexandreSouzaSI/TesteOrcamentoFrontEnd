import { DialogTitle } from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'

import { getCategoryDetails } from '@/api/category/get-category-details'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface CategoryDetailsProps {
  categoriaId: string
  open: boolean
}

export function CategoryDetails({ categoriaId, open }: CategoryDetailsProps) {
  const { data: category } = useQuery({
    queryKey: ['category', categoriaId],
    queryFn: () => getCategoryDetails({ categoriaId }),
    enabled: open,
  })

  if (!category) {
    return null
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Categoria: {category.id}</DialogTitle>
        <DialogDescription>Detalhes da Categoria</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Nome</TableCell>
              <TableCell className="flex justify-end">
                {category.name}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  )
}
