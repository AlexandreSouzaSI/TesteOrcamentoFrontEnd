import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  sub: string
}

export function getUserIdFromToken(token: string | null): string | null {
  if (!token) {
    console.error('Token is null')
    return null
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token)
    return decoded.sub
  } catch (error) {
    console.error('Invalid token', error)
    return null
  }
}
