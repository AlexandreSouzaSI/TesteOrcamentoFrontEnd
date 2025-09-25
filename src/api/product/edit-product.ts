import { api } from '@/lib/axios'

export interface EditProductParams {
  produtoId: string
  name?: string
  quantidadeEstoque?: number
  quantidadeMinima?: number
  categoriaId?: string
}

export async function editProduct({ produtoId, name, quantidadeEstoque, quantidadeMinima, categoriaId }: EditProductParams) {
  await api.put(`/produtos/${produtoId}`, {
    name,
    quantidadeEstoque,
    quantidadeMinima,
    categoriaId
  })
}
