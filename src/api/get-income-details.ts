import { api } from '@/lib/axios'

export interface GetIncomeDetailsParams {
  incomeId: string
}

export interface GetIncomeDetailsResponse {
  renda: {
    id: string
    name: string
    data: string | null | undefined
    valor: number
    status: 'vencido' | 'pago' | 'normal' | 'pendente'
    createdAt: Date
    updatedAt: Date | null | undefined
    userId: string
    categoriaId?: string | null
  }
}

export async function getIncomeDetails({ incomeId }: GetIncomeDetailsParams) {
  const response = await api.get<GetIncomeDetailsResponse>(`/renda/${incomeId}`)

  return response.data.renda
}
