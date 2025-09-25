import { api } from '@/lib/axios'

export interface EditCostsParams {
  custoId: string
  name?: string
  descricao?: string
  categoriaId?: string
}

export async function editCosts({ custoId, name, descricao, categoriaId }: EditCostsParams) {
  await api.put(`/custos/${custoId}`, {
    name,
    descricao,
    categoriaId
  })
}
