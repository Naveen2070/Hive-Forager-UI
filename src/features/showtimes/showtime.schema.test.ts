import { describe, expect, it } from 'vitest'
import { showtimeFormSchema } from './showtime.schema'

describe('showtimeFormSchema', () => {
  it('validates a correct showtime form', () => {
    const validForm = {
      cinemaId: '1',
      auditoriumId: '101',
      startTimeUtc: '2025-01-01T10:00:00Z',
      basePrice: 15,
    }
    const result = showtimeFormSchema.safeParse(validForm)
    expect(result.success).toBe(true)
  })

  it('fails if cinemaId is missing', () => {
    const invalidForm = {
      cinemaId: '',
      auditoriumId: '101',
      startTimeUtc: '2025-01-01T10:00:00Z',
      basePrice: 15,
    }
    const result = showtimeFormSchema.safeParse(invalidForm)
    expect(result.success).toBe(false)
  })

  it('fails if basePrice is less than 1', () => {
    const invalidForm = {
      cinemaId: '1',
      auditoriumId: '101',
      startTimeUtc: '2025-01-01T10:00:00Z',
      basePrice: 0.5,
    }
    const result = showtimeFormSchema.safeParse(invalidForm)
    expect(result.success).toBe(false)
  })
})
