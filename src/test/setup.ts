import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver for Framer Motion / InView
class IntersectionObserverMock {
  root = null
  rootMargin = ''
  thresholds = []
  disconnect = vi.fn()
  observe = vi.fn()
  takeRecords = vi.fn()
  unobserve = vi.fn()
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// Mock ResizeObserver for Radix UI (Select, Checkbox, etc)
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)
