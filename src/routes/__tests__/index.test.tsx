import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Route } from '../index'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/home/components/LandingNavbar', () => ({
  LandingNavbar: () => <div data-testid="navbar" />,
}))
vi.mock('@/features/home/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero" />,
}))
vi.mock('@/features/home/components/FeaturedEvents', () => ({
  FeaturedEvents: () => <div data-testid="events" />,
}))
vi.mock('@/features/home/components/FeaturedMovies', () => ({
  FeaturedMovies: () => <div data-testid="movies" />,
}))
vi.mock('@/features/home/components/ValueProps', () => ({
  ValueProps: () => <div data-testid="props" />,
}))
vi.mock('@/features/home/components/OrganizerCTA', () => ({
  OrganizerCTA: () => <div data-testid="cta" />,
}))
vi.mock('@/features/home/components/LandingFooter', () => ({
  LandingFooter: () => <div data-testid="footer" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

describe('LandingPage Route', () => {
  it('renders all landing page components and scrolls to top', async () => {
    // Mock window.scrollTo
    const scrollMock = vi.fn()
    window.scrollTo = scrollMock

    const LandingPage = (Route as any).options.component
    await act(async () => {
      render(<LandingPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('events')).toBeInTheDocument()
    expect(screen.getByTestId('movies')).toBeInTheDocument()
    expect(screen.getByTestId('props')).toBeInTheDocument()
    expect(screen.getByTestId('cta')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()

    expect(scrollMock).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
  })
})
