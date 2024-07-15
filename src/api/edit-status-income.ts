import { api } from '@/lib/axios'

export interface EditIncomeParams {
  incomeId: string
  name?: string
  data?: Date | null
  valor?: number
  status?: string
}

export async function editIncome({ incomeId, status, data, name, valor }: EditIncomeParams) {

  await api.put(`/renda/${incomeId}`, {
    status: 'pago',
    data,
    name,
    valor,
  })
}