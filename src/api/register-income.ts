import { api } from "@/lib/axios"

export interface RegisterIncomeBody {
    name: string
    valor: number
    status: string
}

export async function registerIncome({
    name,
    valor,
    status,
}: RegisterIncomeBody) {

    const response = await api.post('/renda', {
        name,
        valor,
        status,
    })

}