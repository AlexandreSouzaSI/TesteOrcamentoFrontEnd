import { api } from '@/lib/axios'

export interface RegisterIncomeBody {
  name: string
  valor: number
  status: string
  data?: string | null
}

export async function registerIncome({
  name,
  valor,
  status,
  data,
}: RegisterIncomeBody) {
  await api.post('/renda', {
    name,
    valor,
    status,
    data,
  })
}
