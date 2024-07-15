import { api } from "@/lib/axios"

export interface GetDespesaDetailsParams {
    budgetsId: string
}

export interface GetDespesaDetailsResponse {
    despesa: {
        id: string;
        name: string;
        data: Date | null;
        valor: number;
        status: 'vencido' | 'pago' | 'normal' | 'pendente';
        dataVencimento: Date | null;
        createdAt: Date;
        updatedAt: Date | null | undefined;
        userId: string;
    }
}

export async function getBudgetsDetails({ budgetsId }: GetDespesaDetailsParams) {
    const response = await api.get<GetDespesaDetailsResponse>(`/despesas/${budgetsId}`)


    return response.data.despesa
}