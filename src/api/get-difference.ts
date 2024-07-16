import { api } from "@/lib/axios"
import { getUserIdFromToken } from "@/lib/getUserIdFromToken";

export interface DifferenceProps {
    totalSum: {
        value: {
            difference: number
        }
    }
}

export async function getDifference() {
    const token = localStorage.getItem('token');
    
    const userId = getUserIdFromToken(token);

    if (!userId) {
        throw new Error('User ID not found in token');
    }

    const response = await api.get<DifferenceProps>(`/difference/${userId}`)

    return response.data.totalSum.value.difference
}