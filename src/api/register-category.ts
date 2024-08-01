import { api } from '@/lib/axios'

export interface RegisterCategoryBody {
  name: string
}

export async function registerCategory({ name }: RegisterCategoryBody) {
  await api.post('/category', {
    name,
  })
}
