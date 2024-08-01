import { api } from '@/lib/axios'

export interface EditBudgetsParams {
  budgetsId: string
  name?: string
  data?: string
  valor?: number
  status?: string
  dataVencimento?: string
  categoriaId?: string | null
}

export async function editBudgets({
  budgetsId,
  status,
  data,
  name,
  valor,
  dataVencimento,
  categoriaId,
}: EditBudgetsParams) {
  await api.put(`/despesa/${budgetsId}`, {
    status: status || 'pago',
    data,
    name,
    valor,
    dataVencimento,
    categoriaId,
  })
}
