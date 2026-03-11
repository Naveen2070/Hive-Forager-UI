export interface JwtPayload {
  sub: string
  exp: number
  iat: number
  id: string
  email: string
  domains: Array<string>
  permissions: Record<string, Array<string>>
}

/**
 * Extracts the primary role for a given domain from the JWT payload.
 *
 * @param payload The decoded JWT payload.
 * @param domain The domain (e.g., 'events', 'movies').
 * @returns The primary role (e.g., 'ORGANIZER') or 'USER' as default.
 */
export const getPrimaryRole = (
  payload: JwtPayload | null,
  domain: string = 'events',
): string => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!payload || !payload.permissions || !payload.permissions[domain]) {
    return 'USER'
  }

  const roles = payload.permissions[domain]
  if (roles.length === 0) return 'USER'

  // Return the "highest" role or first role without ROLE_ prefix
  return roles[0].replace('ROLE_', '')
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
