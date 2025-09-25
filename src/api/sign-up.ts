import { api } from '@/lib/axios'

export interface RegisterUserBody {
  name: string
  email: string
  password: string
}

export async function registerUser({
  name,
  email,
  password,
}: RegisterUserBody) {
  console.log('aqui: ', name, email, password)
  await api.post('/accounts', {
    name,
    email,
    password,
  })
}
