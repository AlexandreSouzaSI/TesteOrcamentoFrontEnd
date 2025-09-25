import { api } from '@/lib/axios'

export interface GetDespesaDetailsParams {
  budgetsId: string
}

export interface GetDespesaDetailsResponse {
  despesa: {
    id: string
    name: string
    data: string
    valor: number
    status: 'vencido' | 'pago' | 'normal' | 'pendente'
    dataVencimento: string
    createdAt: Date
    updatedAt: Date | null | undefined
    userId: string
    categoriaId?: string | null
    quantidade?: number | null
    valorUnitario?: number | null
    produtoId?: string
  }
}

export async function getBudgetsDetails({
  budgetsId,
}: GetDespesaDetailsParams) {
  const response = await api.get<GetDespesaDetailsResponse>(
    `/despesas/${budgetsId}`,
  )

  return response.data.despesa
}
