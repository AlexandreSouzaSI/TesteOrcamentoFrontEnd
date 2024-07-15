import { api } from '@/lib/axios'

export interface EditBudgetsParams {
  budgetsId: string
  name?: string
  data?: Date | null
  valor?: number
  status?: string
  dataVencimento?: Date | null
}

export async function editBudgets({ budgetsId, status, data, name, valor, dataVencimento }: EditBudgetsParams) {

    console.log(budgetsId, status, data, name, valor, dataVencimento)
  await api.put(`/despesa/${budgetsId}`, {
    status: 'pago',
    data,
    name,
    valor,
    dataVencimento
  })
}