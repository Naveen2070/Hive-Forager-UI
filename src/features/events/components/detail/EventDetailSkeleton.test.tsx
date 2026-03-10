import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventDetailSkeleton } from './EventDetailSkeleton'

describe('EventDetailSkeleton Component', () => {
  it('renders skeleton placeholders with pulse animation', () => {
    const { container } = render(<EventDetailSkeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
    const blocks = container.querySelectorAll('.bg-slate-800, .bg-slate-900')
    expect(blocks.length).toBeGreaterThan(3)
  })
})
