export interface JwtPayload {
  sub: string
  exp: number
  iat: number
  roles: Array<string>
  id: string
  username: string
  email: string
}

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Invalid Token:', error)
    return null
  }
}
