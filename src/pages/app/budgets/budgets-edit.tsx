import { Dialog, DialogTrigger } from '@radix-ui/react-dialog'
import { FilePenIcon } from 'lucide-react'
import { useState } from 'react'

import { EditBudgetsModal } from '@/components/edit-budgetsModal'
import { Button } from '@/components/ui/button'

import { Despesa } from './budgets-table-row'

export interface BudgetsDetailsProps {
  despesa: Despesa
}

export function BusgetsEdit({ despesa }: BudgetsDetailsProps) {
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
        <EditBudgetsModal
          onClose={() => setIsEditOpen(false)}
          open={isEditOpen}
          budgetsId={despesa.id}
        />
      )}
    </Dialog>
  )
}
