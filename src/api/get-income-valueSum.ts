import { api } from '@/lib/axios'

export interface GetIncomeQuery {
  pageIndex?: number | null
  name?: string | null
  status?: string | null
}

interface Renda {
  id: string
  name: string
  data: string | null
  valor: number
  status: 'vencido' | 'pago' | 'normal' | 'pendente'
  createdAt: Date
  updatedAt: Date | null | undefined
  userId: string
}

export interface RendaResponse {
  value: {
    renda: Renda[]
    meta: {
      pageIndex: number
      perPage: number
      totalCount: number
      totalValue: number
    }
  }
}

export async function getIncomeValueSum({
  pageIndex,
  name,
  status,
}: GetIncomeQuery) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Token not found in localStorage')
  }

  if (pageIndex === undefined) {
    const response = await api.get<RendaResponse>(`/renda`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
        status,
      },
    })

    return response.data.value
  }
}
