import { api } from '@/lib/axios'

export interface GetIncomeDetailsParams {
  incomeId: string
}

export async function deleteIncome({ incomeId }: GetIncomeDetailsParams) {
  await api.delete(`/renda/${incomeId}`)
}
