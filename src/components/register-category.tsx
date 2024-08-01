import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { registerCategory } from '@/api/register-category'

import { Button } from './ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

const categoryBodyForm = z.object({
  name: z.string(),
})

type CategoryBodySchema = z.infer<typeof categoryBodyForm>

export interface RegisterCategoryModalProps {
  onClose: () => void
}

export function RegisterCategoryModal({ onClose }: RegisterCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CategoryBodySchema>()
  const queryClient = useQueryClient()

  const { mutateAsync: registerCategoryFn } = useMutation({
    mutationFn: registerCategory,
    onSuccess: async () => {
      toast.success('Categoria criada com sucesso')
      await queryClient.invalidateQueries()
      onClose()
    },
    onError: () => {
      toast.error('Falha ao criar uma Categoria. Tente novamente.')
    },
  })

  async function handleRegisterBudgets(data: CategoryBodySchema) {
    try {
      await registerCategoryFn({
        name: data.name,
      })
    } catch (error) {
      // A mensagem de erro já está sendo tratada pelo onError do mutateAsync
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Categoria</DialogTitle>
        <DialogDescription>
          Painel para adicionar uma categoria
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleRegisterBudgets)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="green" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
