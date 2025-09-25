import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { FilePenIcon } from 'lucide-react'
import { useState } from 'react'

import { EditProductModal } from '@/components/edit-productModal'
import { Button } from '@/components/ui/button'

import { Produto } from './product-table-row'

export interface ProductDetailsProps {
  produto: Produto
}

export function ProductEdit({ produto }: ProductDetailsProps) {
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
        <EditProductModal
          onClose={() => setIsEditOpen(false)}
          open={isEditOpen}
          produtoId={produto.id}
        />
      )}
    </Dialog>
  )
}
