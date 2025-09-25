import { api } from '@/lib/axios'


export interface GetOrdersQuery {
  pageIndex?: number | null
  name?: string | null
  categoriaId?: string | null
}

interface Produto {
    id: string
    name: string
    quantidadeEstoque: number
    quantidadeMinima: number
    categoria: string
    createdAt: Date
    updatedAt: Date | null | undefined
}

export interface ProdutoResponse {
  value: {
    produto: Produto[]
    meta: {
      pageIndex: number
      perPage: number
      totalCount: number
      totalValue: number
    }
  }
}

export async function getProduct({ pageIndex, name, categoriaId }: GetOrdersQuery) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Token not found in localStorage')
  }

  if (pageIndex === undefined) {
    
    const response = await api.get<ProdutoResponse>(
      `/produtos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name,
          categoriaId
        },
      },
    )

    return response.data.value
  }
    
  if (pageIndex === 0) {
    pageIndex = 1
  }

  const response = await api.get<ProdutoResponse>(
    `/produtos?pageIndex=${pageIndex}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
        categoriaId
      },
    },
  )

  return response.data.value
}
