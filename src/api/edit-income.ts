import { api } from '@/lib/axios'

export interface EditIncomeParams {
  incomeId: string
  name?: string
  data?: string | null
  valor?: number
  status?: string
}

export async function editIncome({
  incomeId,
  status,
  data,
  name,
  valor,
}: EditIncomeParams) {
  await api.put(`/renda/${incomeId}`, {
    status: status || 'pago',
    data,
    name,
    valor,
  })
}
