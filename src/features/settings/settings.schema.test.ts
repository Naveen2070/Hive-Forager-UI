import { describe, expect, it } from 'vitest'
import { passwordSchema, settingsSchema } from './settings.schema'

describe('settings.schema', () => {
  describe('settingsSchema', () => {
    it('validates a correct profile', () => {
      const validProfile = { fullName: 'John Doe', email: 'john@example.com' }
      const result = settingsSchema.safeParse(validProfile)
      expect(result.success).toBe(true)
    })

    it('fails if fullName is too short', () => {
      const invalidProfile = { fullName: 'Jo', email: 'john@example.com' }
      const result = settingsSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })

    it('fails if email is invalid', () => {
      const invalidProfile = { fullName: 'John Doe', email: 'not-an-email' }
      const result = settingsSchema.safeParse(invalidProfile)
      expect(result.success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('validates a correct password change', () => {
      const validPass = {
        oldPassword: 'old-password',
        newPassword: 'new-password-123',
        confirmPassword: 'new-password-123',
      }
      const result = passwordSchema.safeParse(validPass)
      expect(result.success).toBe(true)
    })

    it('fails if passwords do not match', () => {
      const invalidPass = {
        oldPassword: 'old-password',
        newPassword: 'new-password-123',
        confirmPassword: 'different-password',
      }
      const result = passwordSchema.safeParse(invalidPass)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match")
      }
    })

    it('fails if new password is too short', () => {
      const shortPass = {
        oldPassword: 'old-password',
        newPassword: 'short',
        confirmPassword: 'short',
      }
      const result = passwordSchema.safeParse(shortPass)
      expect(result.success).toBe(false)
    })
  })
})
