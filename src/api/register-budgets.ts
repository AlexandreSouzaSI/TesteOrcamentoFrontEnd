import { api } from '@/lib/axios'

export interface RegisterBudgetsBody {
  name: string
  valor: number
  status?: string | null
  dataVencimento?: string | null
  categoriaId?: string | null
}

export async function registerBudgets({
  name,
  valor,
  status,
  dataVencimento,
  categoriaId,
}: RegisterBudgetsBody) {
  await api.post('/despesa', {
    name,
    valor,
    status,
    dataVencimento,
    categoriaId,
  })
}
