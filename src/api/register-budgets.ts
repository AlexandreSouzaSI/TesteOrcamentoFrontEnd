import { api } from "@/lib/axios"

export interface RegisterBudgetsBody {
    name: string
    valor: number
    status?: string | null
    dataVencimento?: Date | null
}

export async function registerBudgets({
    name,
    valor,
    status,
    dataVencimento,
}: RegisterBudgetsBody) {
    
    console.log(typeof(dataVencimento))
    
    await api.post('/despesa', {
        name,
        valor,
        status,
        dataVencimento: dataVencimento ? dataVencimento.toISOString() : null,
    })
}
