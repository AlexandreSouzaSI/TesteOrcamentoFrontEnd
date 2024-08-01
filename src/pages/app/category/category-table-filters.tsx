import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { RegisterCategoryModal } from '@/components/register-category'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const categoryFilterSchema = z.object({
  name: z.string().optional(),
})

type CategoryFilterSchema = z.infer<typeof categoryFilterSchema>

export function CategoryTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const name = searchParams.get('name')

  const { register, handleSubmit, reset } = useForm<CategoryFilterSchema>({
    resolver: zodResolver(categoryFilterSchema),
    defaultValues: {
      name: name ?? '',
    },
  })

  function handleFilter({ name }: CategoryFilterSchema) {
    setSearchParams((state) => {
      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('name')
      state.set('page', '1')

      return state
    })

    reset({
      name: '',
    })
  }

  return (
    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
      <div className="flex justify-between">
        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmit(handleFilter)}
        >
          <span className="text-sm font-semibold">Filtros</span>
          <Input
            placeholder="Nome do Orçamento"
            className="h-8 w-[320px]"
            {...register('name')}
          />
          <Button type="submit" variant="secondary" size="xs">
            <Search className="mr-2 h-4 w-4" />
            Filtrar resultados
          </Button>

          <Button
            onClick={handleClearFilters}
            type="button"
            variant="outline"
            size="xs"
          >
            <Search className="mr-2 h-4 w-4" />
            Remover filtros
          </Button>
        </form>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsRegisterOpen(true)}
            type="button"
            variant="green"
            size="xs"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Categoria
          </Button>
        </DialogTrigger>
      </div>
      <RegisterCategoryModal onClose={() => setIsRegisterOpen(false)} />
    </Dialog>
  )
}
