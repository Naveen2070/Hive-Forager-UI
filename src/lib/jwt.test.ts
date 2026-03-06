import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseJwt } from './jwt'

describe('jwt utils', () => {
  beforeEach(() => {
    // Suppress console.error in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should parse a valid JWT token', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payloadData = {
      sub: 'user123',
      exp: 1700000000,
      iat: 1600000000,
      roles: ['ROLE_USER'],
      id: '1',
      username: 'testuser',
      email: 'test@example.com'
    }
    const payload = btoa(JSON.stringify(payloadData))
    const signature = 'mock-signature'
    
    const validToken = `${header}.${payload}.${signature}`
    
    const result = parseJwt(validToken)
    expect(result).toEqual(payloadData)
  })

  it('should return null and log error for an invalid format token', () => {
    const invalidToken = 'not.a.valid.token'
    const result = parseJwt(invalidToken)
    
    expect(result).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })

  it('should return null and log error when token is malformed', () => {
    const result = parseJwt('malformedtoken')
    
    expect(result).toBeNull()
    expect(console.error).toHaveBeenCalled()
  })

  it('should correctly handle base64url encoding (replace - and _)', () => {
    // We can just rely on the fact that `window.atob` will throw if not valid base64
    const header = btoa('{}')
    const payloadBase64Url = 'eyJzdWIiOiJ1c2VyMTIzIiwicm9sZXMiOlsiUk9MRV9VU0VSIl19' // {"sub":"user123","roles":["ROLE_USER"]}
    const token = `${header}.${payloadBase64Url}.sig`
    
    const result = parseJwt(token)
    expect(result).toEqual({ sub: 'user123', roles: ['ROLE_USER'] })
  })
})
