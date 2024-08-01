import { api } from '@/lib/axios'

import { Despesa } from './get-budgets'
import { Renda } from './get-income'

export interface GetOrdersQuery {
  pageIndex?: number | null
  name?: string | null
}

interface Categoria {
  id: string
  name: string
  despesas?: Despesa[]
  rendas?: Renda[]
  // produtos?: Produto[]
}

export interface CategoriaResponse {
  value: {
    categoria: Categoria[]
    meta: {
      pageIndex: number
      perPage: number
      totalCount: number
      totalValue: number
    }
  }
}

export async function getCategory({ pageIndex, name }: GetOrdersQuery) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Token not found in localStorage')
  }

  if (pageIndex === 0) {
    pageIndex = 1
  }

  const response = await api.get<CategoriaResponse>(
    `/category?pageIndex=${pageIndex}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
      },
    },
  )

  return response.data.value
}
