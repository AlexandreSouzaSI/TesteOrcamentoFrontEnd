import { api } from '@/lib/axios'

export interface EditIncomeParams {
  incomeId: string
  name?: string
  data?: string | null
  valor?: number
  status?: string
  categoriaId?: string | null
}

export async function editIncome({
  incomeId,
  status,
  data,
  name,
  valor,
  categoriaId,
}: EditIncomeParams) {
  await api.put(`/renda/${incomeId}`, {
    status: status || 'pago',
    data,
    name,
    valor,
    categoriaId,
  })
}
