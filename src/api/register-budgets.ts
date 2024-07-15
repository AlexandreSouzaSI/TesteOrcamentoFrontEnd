import { api } from "@/lib/axios"

export interface RegisterBudgetsBody {
    name: string
    valor: number
    status?: string | null
}

export async function registerBudgets({
    name,
    valor,
    status,
}: RegisterBudgetsBody) {
    
    await api.post('/despesa', {
        name,
        valor,
        status,
    })
}
