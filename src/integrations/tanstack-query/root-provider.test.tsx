import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { getContext, Provider } from './root-provider'
import { QueryClient } from '@tanstack/react-query'

describe('TanStack Query Integration', () => {
  it('getContext returns a new QueryClient', () => {
    const context = getContext()
    expect(context.queryClient).toBeInstanceOf(QueryClient)
  })

  it('Provider renders children correctly', () => {
    const queryClient = new QueryClient()
    render(
      <Provider queryClient={queryClient}>
        <div data-testid="child">Test Child</div>
      </Provider>,
    )

    expect(screen.getByTestId('child')).toHaveTextContent('Test Child')
  })
})
