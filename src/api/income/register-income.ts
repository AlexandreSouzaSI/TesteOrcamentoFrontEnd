import { api } from '@/lib/axios'

export interface RegisterIncomeBody {
  name: string
  valor: number
  status?: string | null
  data?: string | null
  categoriaId?: string | null
}

export async function registerIncome({
  name,
  valor,
  status,
  data,
  categoriaId,
}: RegisterIncomeBody) {
  await api.post('/renda', {
    name,
    valor,
    status,
    data,
    categoriaId,
  })
}
