import { api } from '@/lib/axios'

export interface EditBudgetsParams {
  budgetsId: string
  name?: string
  data?: string
  valor?: number
  status?: string
  dataVencimento?: string
}

export async function editBudgets({ budgetsId, status, data, name, valor, dataVencimento }: EditBudgetsParams) {

    console.log(budgetsId, status, data, name, valor, dataVencimento)
  await api.put(`/despesa/${budgetsId}`, {
    status: status ? status : 'pago',
    data,
    name,
    valor,
    dataVencimento
  })
}