import { api } from '@/lib/axios'

export interface RegisterCostsBody {
  name: string,
  descricao?: string,
  categoriaId?: string,
}

export async function registerCosts({ name, descricao, categoriaId }: RegisterCostsBody) {
  await api.post('/custos', {
    name,
    descricao,
    categoriaId
  })
}
