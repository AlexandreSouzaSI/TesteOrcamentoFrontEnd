import { api } from '@/lib/axios'

export interface EditCategoryParams {
  categoriaId: string
  name?: string
  produto?: string
}

export async function editCategory({ categoriaId, name, produto }: EditCategoryParams) {
  console.log("aqui: ", produto, categoriaId)
  await api.put(`/categoryEdit/${categoriaId}`, {
    name,
    produto
  })
}
