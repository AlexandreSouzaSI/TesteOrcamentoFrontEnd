import { api } from '@/lib/axios'

export interface EditCategoryParams {
  categoriaId: string
  name?: string
}

export async function editCategory({ categoriaId, name }: EditCategoryParams) {
  await api.put(`/category/${categoriaId}`, {
    name,
  })
}
