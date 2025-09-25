import { api } from '@/lib/axios'

export interface DeleteCustosParams {
  custoId: string
}

export async function deleteCost({ custoId }: DeleteCustosParams) {
  await api.delete(`/custos/${custoId}`)
}
