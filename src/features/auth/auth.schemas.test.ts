import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './auth.schemas'
import { UserRole } from '@/types/enum'

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate a correct login object', () => {
      const validData = { email: 'test@example.com', password: 'password123' }
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should fail if email is empty', () => {
      const invalidData = { email: '', password: 'password123' }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Email or Username is required',
        )
      }
    })

    it('should fail if password is too short', () => {
      const invalidData = { email: 'test@example.com', password: '123' }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Password must be at least 6 characters',
        )
      }
    })
  })

  describe('registerSchema', () => {
    const validData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      domainAccess: ['events'],
      role: UserRole.USER,
    }

    it('should validate a correct registration object', () => {
      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should fail if passwords do not match', () => {
      const invalidData = { ...validData, confirmPassword: 'differentPassword' }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match')
      }
    })

    it('should fail if email is invalid', () => {
      const invalidData = { ...validData, email: 'not-an-email' }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address')
      }
    })

    it('should fail if fullName is too short', () => {
      const invalidData = { ...validData, fullName: 'Jo' }
      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Username must be at least 3 chars',
        )
      }
    })
  })
})
