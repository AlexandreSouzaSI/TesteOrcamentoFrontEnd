import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { getProfile } from '@/api/get-profile'
import { updateProfile } from '@/api/update-profile'

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

interface getProfileUpdateResponse {
  name: string
  password: string
}

const storeProfileSchema = z.object({
  name: z.string(),
  password: z.string(),
})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export function StoreProfileDialog() {
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    values: {
      name: profile?.user.name ?? '',
      password: '',
    },
  })

  function updateManagedUserCache({ name, password }: StoreProfileSchema) {
    const cached = queryClient.getQueryData<getProfileUpdateResponse>([
      'profile',
    ])

    if (cached) {
      queryClient.setQueryData<getProfileUpdateResponse>(['profile'], {
        ...cached,
        name,
        password,
      })
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ name, password }) {
      const { cached } = updateManagedUserCache({ name, password })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateManagedUserCache(context.previousProfile)
      }
    },
  })

  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        password: data.password,
      })

      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      toast.error('Falha ao atualizar o perfil tente novamente')
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil do Usuario</DialogTitle>
        <DialogDescription>
          Painel para editar Nome ou senha do usuario
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />

            <Label className="text-right" htmlFor="password">
              Senha
            </Label>
            <Input
              className="col-span-3"
              id="password"
              {...register('password')}
            />
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
