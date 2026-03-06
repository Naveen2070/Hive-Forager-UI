import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('utils cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  it('should handle conditional class names', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
  })

  it('should resolve tailwind class conflicts using tailwind-merge', () => {
    // text-red-500 should override text-blue-500
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500')
    // p-4 should override p-2
    expect(cn('p-2 p-4')).toBe('p-4')
  })

  it('should handle arrays and objects', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
    expect(cn({ class1: true, class2: false })).toBe('class1')
  })
})
