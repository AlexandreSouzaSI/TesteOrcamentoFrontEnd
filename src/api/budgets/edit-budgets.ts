import { api } from '@/lib/axios'

export interface EditBudgetsParams {
  budgetsId: string
  name?: string
  data?: string
  valor?: number
  quantidade?: number
  valorUnitario?: number
  status?: string
  dataVencimento?: string
  categoriaId?: string | null
  produtoId?: string | null
  custoId?: string | null
}

export async function editBudgets({
  budgetsId,
  status,
  data,
  name,
  valor,
  quantidade,
  valorUnitario,
  dataVencimento,
  categoriaId,
  produtoId,
  custoId
}: EditBudgetsParams) {

  await api.put(`/despesa/${budgetsId}`, {
    status: status || 'pago',
    data,
    name,
    valor,
    quantidade,
    valorUnitario,
    dataVencimento,
    categoriaId,
    produtoId,
    custoId
  })
}
