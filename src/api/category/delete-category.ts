import { api } from '@/lib/axios'

export interface DeleteCategoriaParams {
  categoriaId: string
}

export async function deleteCategory({ categoriaId }: DeleteCategoriaParams) {
  await api.delete(`/category/${categoriaId}`)
}
