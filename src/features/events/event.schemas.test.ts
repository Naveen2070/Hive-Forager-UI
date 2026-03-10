import { describe, expect, it } from 'vitest'
import { createEventSchema, ticketTierSchema } from './event.schemas'

describe('event.schemas', () => {
  describe('ticketTierSchema', () => {
    it('validates a correct ticket tier', () => {
      const validTier = { name: 'VIP', price: 100, totalAllocation: 50 }
      const result = ticketTierSchema.safeParse(validTier)
      expect(result.success).toBe(true)
    })

    it('fails if price is negative', () => {
      const invalidTier = { name: 'VIP', price: -10, totalAllocation: 50 }
      const result = ticketTierSchema.safeParse(invalidTier)
      expect(result.success).toBe(false)
    })

    it('fails if allocation is less than 1', () => {
      const invalidTier = { name: 'VIP', price: 10, totalAllocation: 0 }
      const result = ticketTierSchema.safeParse(invalidTier)
      expect(result.success).toBe(false)
    })
  })

  describe('createEventSchema', () => {
    const validEvent = {
      title: 'Valid Event Title',
      description:
        'This is a description that is at least twenty characters long.',
      location: 'Grand Arena',
      startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      organizerEmail: 'org@test.com',
      createdBy: 'user-1',
      ticketTiers: [{ name: 'Standard', price: 10, totalAllocation: 100 }],
    }

    it('validates a correct event', () => {
      const result = createEventSchema.safeParse(validEvent)
      expect(result.success).toBe(true)
    })

    it('fails if start date is in the past', () => {
      const pastEvent = {
        ...validEvent,
        startDate: new Date(Date.now() - 86400000).toISOString(),
      }
      const result = createEventSchema.safeParse(pastEvent)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Start date must be in the future',
        )
      }
    })

    it('fails if end date is before start date', () => {
      const invalidDates = {
        ...validEvent,
        startDate: new Date(Date.now() + 172800000).toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
      }
      const result = createEventSchema.safeParse(invalidDates)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'End date must be after start date',
        )
      }
    })

    it('fails if no ticket tiers are provided', () => {
      const noTiers = { ...validEvent, ticketTiers: [] }
      const result = createEventSchema.safeParse(noTiers)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'You must create at least one ticket type',
        )
      }
    })
  })
})
