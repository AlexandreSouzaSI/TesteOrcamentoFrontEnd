import { api } from '@/lib/axios'

export interface GetOrdersQuery {
  pageIndex?: number | null
  name?: string | null
  status?: string | null
}

export interface Despesa {
  id: string
  name: string
  data: Date | null
  valor: number
  status: 'vencido' | 'pago' | 'normal' | 'pendente'
  dataVencimento: string | null
  createdAt: Date
  updatedAt: Date | null | undefined
  userId: string
  categoriaId: string
  categoria: string
}

export interface DespesaResponse {
  value: {
    despesas: Despesa[]
    meta: {
      pageIndex: number
      perPage: number
      totalCount: number
      totalValue: number
    }
  }
}

export async function getBudgets({ pageIndex, name, status }: GetOrdersQuery) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Token not found in localStorage')
  }

  if (pageIndex === 0) {
    pageIndex = 1
  }

  const response = await api.get<DespesaResponse>(
    `/despesas?pageIndex=${pageIndex}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
        status,
      },
    },
  )

  console.log('aqui: ', response.data.value)

  return response.data.value
}
