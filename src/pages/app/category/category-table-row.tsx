/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteCategory } from '@/api/delete-category'
import { DeleteConfirmationModal } from '@/components/delete-ConfirmationModal'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { CategoryDetails } from './category-details'
import { CategoryEdit } from './category-edit'

export interface Categoria {
  id: string
  name: string
}

export interface CategoriaTableRowProps {
  categoria: Categoria
}

export function CategoryTableRow({ categoria }: CategoriaTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutateAsync: deleteCategoryFn } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Categoria excluída com sucesso.')
    },
    onError: () => {
      toast.error('Falha ao excluir a categoria. Tente novamente.')
    },
  })

  return (
    <>
      <TableRow key={categoria.id}>
        <TableCell>
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <Search className="h-3 w-3" />
                <span className="sr-only">Detalhes da Caregoria</span>
              </Button>
            </DialogTrigger>
            {isDetailsOpen && (
              <CategoryDetails
                open={isDetailsOpen}
                categoriaId={categoria.id}
              />
            )}
          </Dialog>
        </TableCell>
        <TableCell className="font-medium">{categoria.name}</TableCell>
        <TableCell>
          <CategoryEdit categoria={categoria} />
        </TableCell>
        <TableCell>
          <DeleteConfirmationModal
            onConfirm={() => deleteCategoryFn({ categoriaId: categoria.id })}
            status={''}
            entityName="Categoria"
          />
        </TableCell>
      </TableRow>
    </>
  )
}
