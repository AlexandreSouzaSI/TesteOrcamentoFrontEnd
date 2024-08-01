import { api } from '@/lib/axios'

export interface GetCategoriaDetailsParams {
  categoriaId: string
}

export interface GetCategoriaDetailsResponse {
  categoria: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date | null | undefined
  }
}

export async function getCategoryDetails({
  categoriaId,
}: GetCategoriaDetailsParams) {
  const response = await api.get<GetCategoriaDetailsResponse>(
    `/category/${categoriaId}`,
  )

  return response.data.categoria
}
