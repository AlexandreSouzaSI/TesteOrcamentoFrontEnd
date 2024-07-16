import { api } from '@/lib/axios'

export interface SignInBody {
  email: string
  password: string
}

export async function signIn(body: SignInBody) {
  try {
    const response = await api.post('/sessions', body)
    return response.data
  } catch (error) {
    console.error('Error during sign-in: ', error)
    throw error
  }
}
