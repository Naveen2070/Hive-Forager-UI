import { describe, expect, it } from 'vitest'
import { createCinemaSchema } from './cinema.schema'

describe('createCinemaSchema', () => {
  it('validates a correct cinema object', () => {
    const validCinema = {
      name: 'Grand Cinema',
      location: '123 Main St, City',
      contactEmail: 'contact@grand.com',
    }
    const result = createCinemaSchema.safeParse(validCinema)
    expect(result.success).toBe(true)
  })

  it('fails if name is too short', () => {
    const invalidCinema = {
      name: 'Ab',
      location: '123 Main St, City',
      contactEmail: 'contact@grand.com',
    }
    const result = createCinemaSchema.safeParse(invalidCinema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Name must be at least 3 characters',
      )
    }
  })

  it('fails if location is too short', () => {
    const invalidCinema = {
      name: 'Grand Cinema',
      location: '123',
      contactEmail: 'contact@grand.com',
    }
    const result = createCinemaSchema.safeParse(invalidCinema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Location must be at least 5 characters',
      )
    }
  })

  it('fails if email is invalid', () => {
    const invalidCinema = {
      name: 'Grand Cinema',
      location: '123 Main St, City',
      contactEmail: 'not-an-email',
    }
    const result = createCinemaSchema.safeParse(invalidCinema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })
})
