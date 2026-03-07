import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePayment } from './usePayment'

describe('usePayment', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('successfully processes payment for valid card', async () => {
    const { result } = renderHook(() => usePayment())
    const details = {
      cardNumber: '4242 4242 4242 4242',
      expiryDate: '12/25',
      cvc: '123',
      name: 'John Doe',
    }

    let paymentPromise: any
    act(() => {
      paymentPromise = result.current.processPayment(details, 100)
    })

    expect(result.current.isProcessing).toBe(true)

    // Fast-forward 2.5 seconds
    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    const response = await paymentPromise
    expect(response.success).toBe(true)
    expect(response.transactionId).toContain('mock_txn_')
    expect(result.current.isProcessing).toBe(false)
  })

  it('returns error for declined card', async () => {
    const { result } = renderHook(() => usePayment())
    const details = {
      cardNumber: '4000 0000 0000 0002',
      expiryDate: '12/25',
      cvc: '123',
      name: 'John Doe',
    }

    let paymentPromise: any
    act(() => {
      paymentPromise = result.current.processPayment(details, 100)
    })

    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    const response = await paymentPromise
    expect(response.success).toBe(false)
    expect(response.error).toBe('Your card was declined by the issuer.')
  })

  it('returns error for insufficient funds', async () => {
    const { result } = renderHook(() => usePayment())
    const details = {
      cardNumber: '4000 0000 0000 0119',
      expiryDate: '12/25',
      cvc: '123',
      name: 'John Doe',
    }

    let paymentPromise: any
    act(() => {
      paymentPromise = result.current.processPayment(details, 100)
    })

    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    const response = await paymentPromise
    expect(response.success).toBe(false)
    expect(response.error).toBe('Insufficient funds.')
  })

  it('returns error for missing details', async () => {
    const { result } = renderHook(() => usePayment())
    const details = {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      name: '',
    }

    let paymentPromise: any
    act(() => {
      paymentPromise = result.current.processPayment(details, 100)
    })

    await act(async () => {
      vi.advanceTimersByTime(2500)
    })

    const response = await paymentPromise
    expect(response.success).toBe(false)
    expect(response.error).toBe('Please fill in all card details.')
  })
})
