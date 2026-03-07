import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EventDescription } from './EventDescription'

describe('EventDescription', () => {
  it('renders correctly with description', () => {
    const description = 'This is a test description.'
    render(<EventDescription description={description} />)

    expect(screen.getByText('About this Event')).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })
})
