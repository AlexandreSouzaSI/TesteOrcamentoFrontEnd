import { api } from '@/lib/axios'

export interface DeleteProdutoParams {
  productId: string
}

export async function deleteProduct({ productId }: DeleteProdutoParams) {
  await api.delete(`/produtos/${productId}`)
}
