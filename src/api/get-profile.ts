import { api } from "@/lib/axios";
import { getUserIdFromToken } from "@/lib/getUserIdFromToken";

interface getProfileResponse {
    user: {
        name: string
        email: string
        password: string
    }
}

export async function getProfile() {
    const token = localStorage.getItem('token');
    
    const userId = getUserIdFromToken(token);

    if (!userId) {
        throw new Error('User ID not found in token');
    }

    const response = await api.get<getProfileResponse>(`/accounts/${userId}`);

    return response.data;
}
