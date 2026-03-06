
import { describe, it, expect } from 'vitest'
import { auditoriumFormSchema } from './auditorium.schema'

describe('auditoriumFormSchema', () => {
  it('should validate a correct auditorium object', () => {
    const validAuditorium = {
      name: 'IMAX 1',
      maxRows: 10,
      maxColumns: 12,
      layout: {
        disabledSeats: [{ row: 1, col: 1 }],
        wheelchairSpots: [{ row: 0, col: 0 }],
        tiers: [
          {
            tierName: 'VIP',
            priceSurcharge: 5.5,
            seats: [{ row: 5, col: 5 }],
          },
        ],
      },
    }
    const result = auditoriumFormSchema.safeParse(validAuditorium)
    expect(result.success).toBe(true)
  })

  it('should invalidate when name is empty', () => {
    const invalidAuditorium = {
      name: '',
      maxRows: 10,
      maxColumns: 12,
      layout: { disabledSeats: [], wheelchairSpots: [], tiers: [] },
    }
    const result = auditoriumFormSchema.safeParse(invalidAuditorium)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Screen name is required')
    }
  })

  it('should invalidate when maxRows is less than 1', () => {
    const invalidAuditorium = {
      name: 'Screen 1',
      maxRows: 0,
      maxColumns: 12,
      layout: { disabledSeats: [], wheelchairSpots: [], tiers: [] },
    }
    const result = auditoriumFormSchema.safeParse(invalidAuditorium)
    expect(result.success).toBe(false)
  })

  it('should invalidate when maxRows exceeds 50', () => {
    const invalidAuditorium = {
      name: 'Screen 1',
      maxRows: 51,
      maxColumns: 12,
      layout: { disabledSeats: [], wheelchairSpots: [], tiers: [] },
    }
    const result = auditoriumFormSchema.safeParse(invalidAuditorium)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Max 50 rows allowed')
    }
  })

  it('should invalidate when maxColumns exceeds 50', () => {
    const invalidAuditorium = {
      name: 'Screen 1',
      maxRows: 10,
      maxColumns: 51,
      layout: { disabledSeats: [], wheelchairSpots: [], tiers: [] },
    }
    const result = auditoriumFormSchema.safeParse(invalidAuditorium)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Max 50 columns allowed')
    }
  })
})
