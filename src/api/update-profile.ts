import { api } from "@/lib/axios";
import { getUserIdFromToken } from "@/lib/getUserIdFromToken";

interface UpdateProfileBody {
    name: string;
    password: string;
}

export async function updateProfile({ name, password }: UpdateProfileBody) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Token not found in localStorage');
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
        throw new Error('User ID not found in token');
    }

    const response = await api.put(`/accounts/${userId}`, { name, password }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });


    return response.data.user;
}
