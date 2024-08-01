import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { FilePenIcon } from 'lucide-react'
import { useState } from 'react'

import { EditCategoryModal } from '@/components/edit-categoryModal'
import { Button } from '@/components/ui/button'

import { Categoria } from './category-table-row'

export interface CategoryDetailsProps {
  categoria: Categoria
}

export function CategoryEdit({ categoria }: CategoryDetailsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsEditOpen(true)} variant="ghost" size="xs">
          <FilePenIcon className="mr-2 h-3 w-3" />
          Editar
        </Button>
      </DialogTrigger>
      {isEditOpen && (
        <EditCategoryModal
          onClose={() => setIsEditOpen(false)}
          open={isEditOpen}
          categoriaId={categoria.id}
        />
      )}
    </Dialog>
  )
}
