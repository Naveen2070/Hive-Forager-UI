import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    // Update value
    rerender({ value: 'updated' })
    
    // Value should not update immediately
    expect(result.current).toBe('initial')

    // Fast forward time slightly, but not full delay
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('initial')

    // Fast forward to complete the delay
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current).toBe('updated')
  })

  it('should clear timeout if value changes again within delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'update 1' })
    
    act(() => {
      vi.advanceTimersByTime(250)
    })
    
    // Rerender before first timeout finishes
    rerender({ value: 'update 2' })
    
    act(() => {
      vi.advanceTimersByTime(300)
    })
    
    // Total time is 550ms, but only 300ms since last update, so it shouldn't be 'update 1' or 'update 2' yet
    expect(result.current).toBe('initial')

    // Complete the second timeout
    act(() => {
      vi.advanceTimersByTime(200) // Total 500ms since 'update 2'
    })
    
    expect(result.current).toBe('update 2')
  })
})
