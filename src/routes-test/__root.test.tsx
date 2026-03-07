import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Route } from '../routes/__root'
import { createWrapper } from '@/test/utils'

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
  createRootRouteWithContext: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => null,
}))

vi.mock('../../integrations/tanstack-query/devtools', () => ({
  default: null,
}))

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}))

vi.mock('@/components/errors/NotFound', () => ({
  NotFound: () => <div data-testid="not-found" />,
}))

vi.mock('@/components/errors/GlobalError', () => ({
  GlobalError: ({ error }: any) => (
    <div data-testid="global-error">{error.message}</div>
  ),
}))

describe('Root Route Layout', () => {
  it('renders main layout with Outlet and Toaster', async () => {
    const RootComponent = (Route as any).options.component
    await act(async () => {
      render(<RootComponent />, { wrapper: createWrapper() })
    })

    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('provides a custom NotFound component', () => {
    const NotFoundComponent = (Route as any).options.notFoundComponent
    render(<NotFoundComponent />)
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })

  it('provides a GlobalError component', () => {
    const ErrorComponent = (Route as any).options.errorComponent
    render(
      <ErrorComponent
        error={new Error('Critical System Failure')}
        reset={() => {}}
      />,
    )
    expect(screen.getByTestId('global-error')).toHaveTextContent(
      'Critical System Failure',
    )
  })
})
