import { api } from "@/lib/axios"

export interface DeleteDespesaParams {
    budgetsId: string
}

export async function deleteBudgets({ budgetsId }: DeleteDespesaParams) {
    await api.delete(`/despesa/${budgetsId}`)
}