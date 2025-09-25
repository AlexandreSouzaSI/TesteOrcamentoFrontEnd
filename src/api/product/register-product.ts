import { api } from '@/lib/axios'
import { ca } from 'date-fns/locale'

export interface RegisterProductBody {
  name: string,
  quantidadeEstoque?: number,
  quantidadeMinima?: number,
  categoriaId?: string,
}

export async function registerProduct({ name, quantidadeEstoque, quantidadeMinima, categoriaId }: RegisterProductBody) {
  await api.post('/produtos', {
    name,
    quantidadeEstoque,
    quantidadeMinima,
    categoriaId
  })
}
