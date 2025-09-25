import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { FilePenIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Custo } from './cost-table-row'
import { EditCostModal } from '@/components/edit-costModal'


export interface CostDetailsProps {
  custo: Custo
}

export function CostEdit({ custo }: CostDetailsProps) {
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
        <EditCostModal
          onClose={() => setIsEditOpen(false)}
          open={isEditOpen}
          custoId={custo.id}
        />
      )}
    </Dialog>
  )
}
