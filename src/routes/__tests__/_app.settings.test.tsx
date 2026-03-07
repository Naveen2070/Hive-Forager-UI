import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SettingsPage } from '../_app.settings'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { createWrapper } from '@/test/utils'

vi.mock('@/features/settings/hooks/useSettings', () => ({
  useSettings: vi.fn(),
}))

vi.mock('@/features/settings/components/ProfileForm', () => ({
  ProfileForm: () => <div data-testid="profile-form" />,
}))

vi.mock('@/features/settings/components/SecurityForm', () => ({
  SecurityForm: () => <div data-testid="security-form" />,
}))

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: any) => ({
    options,
  }),
  lazyRouteComponent: vi.fn(),
}))

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, onValueChange }: any) => (
    <div
      onClick={(e: any) => {
        if (e.target.dataset.value) onValueChange(e.target.dataset.value)
      }}
    >
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => (
    <button data-value={value}>{children}</button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}))

describe('SettingsPage Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Profile tab by default', async () => {
    ;(useSettings as any).mockReturnValue({
      profile: { fullName: 'John' },
      isLoading: false,
      isError: false,
      updateProfile: { isPending: false },
      changePassword: { isPending: false },
    })

    await act(async () => {
      render(<SettingsPage />, { wrapper: createWrapper() })
    })

    expect(screen.getByTestId('profile-form')).toBeInTheDocument()
    expect(screen.queryByTestId('security-form')).not.toBeInTheDocument()
  })

  it('switches to Security tab when clicked', async () => {
    ;(useSettings as any).mockReturnValue({
      profile: { fullName: 'John' },
      isLoading: false,
      isError: false,
      updateProfile: { isPending: false },
      changePassword: { isPending: false },
    })

    await act(async () => {
      render(<SettingsPage />, { wrapper: createWrapper() })
    })

    const securityTab = screen.getByRole('button', { name: /Security/i })
    await act(async () => {
      fireEvent.click(securityTab)
    })

    expect(await screen.findByTestId('security-form')).toBeInTheDocument()
  })
})
