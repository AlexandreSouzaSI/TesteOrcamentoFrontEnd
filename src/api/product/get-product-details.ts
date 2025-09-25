import { api } from '@/lib/axios'

export interface GetProdutoDetailsParams {
  produtoId: string
}

export interface GetProdutoDetailsResponse {
  produto: {
    id: string
    name: string
    quantidadeEstoque: number
    quantidadeMinima: number
    categoria: string
    createdAt: Date
    updatedAt: Date | null | undefined
  }
}

export async function getProdutoDetails({
  produtoId,
}: GetProdutoDetailsParams) {
  const response = await api.get<GetProdutoDetailsResponse>(
    `/produtos/${produtoId}`,
  )

  return response.data.produto
}
