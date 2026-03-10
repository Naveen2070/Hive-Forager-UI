import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DashboardSkeleton } from './DashboardSkeleton'

describe('DashboardSkeleton Component', () => {
  it('renders multiple skeleton placeholders', () => {
    const { container } = render(<DashboardSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(5)
  })
})
