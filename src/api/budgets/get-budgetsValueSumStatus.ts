import { api } from '@/lib/axios'
import { getUserIdFromToken } from '@/lib/getUserIdFromToken'

export interface GetOrdersQuery {
  pageIndex?: number | null
  name?: string | null
  status?: string | null
}

export interface DespesaResponse {
  totalSum: {
    value: {
      despesa: number
    }
  }
}

export async function getBudgetsValueSumStatus({
  pageIndex,
  name,
  status,
}: GetOrdersQuery) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Token not found in localStorage')
  }

  const userId = getUserIdFromToken(token)

  if (pageIndex === undefined) {
    const response = await api.get<DespesaResponse>(`/despesa/sum/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
        status,
      },
    })

    return response.data.totalSum.value.despesa
  }
}
