import { describe, expect, it } from 'vitest'
import {
  Ban,
  CheckCircle2,
  Clock,
  RefreshCcw,
  ScanLine,
  XCircle,
} from 'lucide-react'
import { BookingStatus } from '@/types/enum'
import { getBookingStatusStyles } from './status.utils'

describe('getBookingStatusStyles', () => {
  it('returns correct styles for CHECKED_IN status', () => {
    const styles = getBookingStatusStyles(BookingStatus.CHECKED_IN)
    expect(styles.label).toBe('Checked In')
    expect(styles.border).toBe('border-l-blue-500')
    expect(styles.icon).toBe(ScanLine)
  })

  it('returns correct styles for CONFIRMED status', () => {
    const styles = getBookingStatusStyles(BookingStatus.CONFIRMED)
    expect(styles.label).toBe('Confirmed')
    expect(styles.border).toBe('border-l-emerald-500')
    expect(styles.icon).toBe(CheckCircle2)
  })

  it('returns correct styles for PENDING status', () => {
    const styles = getBookingStatusStyles(BookingStatus.PENDING)
    expect(styles.label).toBe('Payment Pending')
    expect(styles.border).toBe('border-l-amber-500')
    expect(styles.icon).toBe(Clock)
  })

  it('returns correct styles for REFUNDED status', () => {
    const styles = getBookingStatusStyles(BookingStatus.REFUNDED)
    expect(styles.label).toBe('Refunded')
    expect(styles.border).toBe('border-l-purple-500')
    expect(styles.icon).toBe(RefreshCcw)
  })

  it('returns correct styles for EXPIRED status', () => {
    const styles = getBookingStatusStyles(BookingStatus.EXPIRED)
    expect(styles.label).toBe('Expired')
    expect(styles.border).toBe('border-l-slate-500')
    expect(styles.icon).toBe(XCircle)
  })

  it('returns correct styles for CANCELLED status', () => {
    const styles = getBookingStatusStyles(BookingStatus.CANCELLED)
    expect(styles.label).toBe('Cancelled')
    expect(styles.border).toBe('border-l-red-500')
    expect(styles.icon).toBe(Ban)
  })

  it('returns default styles for unknown status', () => {
    const styles = getBookingStatusStyles('UNKNOWN_STATUS')
    expect(styles.label).toBe('Cancelled')
    expect(styles.border).toBe('border-l-red-500')
    expect(styles.icon).toBe(Ban)
  })
})
