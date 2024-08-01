import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { editCategory } from '@/api/edit-category'
import { getCategoryDetails } from '@/api/get-category-details'

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
  categoriaId: z.string(),
  name: z.string().optional(),
})

type CategoryBodySchema = z.infer<typeof categoryBodyForm>

export interface CategoryDetailsProps {
  categoriaId: string
  open: boolean
  onClose: () => void
}

export function EditCategoryModal({
  categoriaId,
  open,
  onClose,
}: CategoryDetailsProps) {
  const queryClient = useQueryClient()
  const { data: result, isLoading } = useQuery({
    queryKey: ['category', categoriaId],
    queryFn: () => getCategoryDetails({ categoriaId }),
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<CategoryBodySchema>({
    resolver: zodResolver(categoryBodyForm),
  })

  const { mutateAsync: updateCategoryFn } = useMutation({
    mutationFn: editCategory,
    onSuccess: async () => {
      toast.success('Categoria atualizada com sucesso')
      onClose()
      await queryClient.invalidateQueries()
    },
    onError: () => {
      toast.error('Falha ao atualizar a Categoria. Tente novamente.')
    },
  })

  useEffect(() => {
    if (result) {
      reset({
        categoriaId: result.id,
        name: result.name ?? '',
      })
    }
  }, [result, reset])

  if (isLoading || !result) {
    return null
  }

  async function handleUpdateCategory(data: CategoryBodySchema) {
    try {
      await updateCategoryFn({
        categoriaId: data.categoriaId,
        name: data.name,
      })
    } catch (error) {
      toast.error('Falha ao atualizar a categoria. Tente novamente.')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Categoria</DialogTitle>
        <DialogDescription>Painel para editar uma categoria</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateCategory)}>
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
