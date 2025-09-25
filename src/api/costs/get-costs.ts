import { api } from '@/lib/axios'


export interface GetOrdersQuery {
  pageIndex?: number | null
  name?: string | null
  categoriaId?: string | null
}

interface Custos {
  id: string
  name: string
  descricao?: string
  categoria: string
  createdAt: Date
  updatedAt: Date | null | undefined
}

export interface CustosResponse {
  value: {
    custo: Custos[]
    meta: {
      pageIndex: number
      perPage: number
      totalCount: number
      totalValue: number
    }
  }
}

export async function getCosts({ pageIndex, name, categoriaId }: GetOrdersQuery) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Token not found in localStorage')
  }

  if (pageIndex === undefined) {

    const response = await api.get<CustosResponse>(
      `/custos`,
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

  const response = await api.get<CustosResponse>(
    `/custos?pageIndex=${pageIndex}`,
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
