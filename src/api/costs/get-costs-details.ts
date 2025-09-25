import { api } from '@/lib/axios'

export interface GetCustosDetailsParams {
  custoId: string
}

export interface GetCustosDetailsResponse {
  custo: {
    id: string
    name: string
    descricao: string
    categoria: string
    createdAt: Date
    updatedAt: Date | null | undefined
  }
}

export async function getCustosDetails({
  custoId,
}: GetCustosDetailsParams) {
  const response = await api.get<GetCustosDetailsResponse>(
    `/custos/${custoId}`,
  )

  return response.data.custo
}
