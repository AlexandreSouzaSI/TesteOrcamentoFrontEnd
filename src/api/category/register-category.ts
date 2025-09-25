import { api } from '@/lib/axios'

export interface RegisterCategoryBody {
  name: string
  produto?: string
}

export async function registerCategory({ name, produto }: RegisterCategoryBody) {
  await api.post('/category', {
    name,
    produto
  })
}
