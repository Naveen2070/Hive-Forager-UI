import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  QrCode,
  Settings,
  Ticket,
} from 'lucide-react'
import { useState } from 'react'
import type { LinkProps } from '@tanstack/react-router'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

type AppRoute = LinkProps['to']

interface NavItem {
  label: string
  href: AppRoute
  icon: ElementType
  show: boolean
}

export const Sidebar = () => {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const isOrganizer = user?.role === UserRole.ORGANIZER

  const links: Array<NavItem> = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: isOrganizer,
    },
    {
      label: 'Events',
      href: '/events',
      icon: CalendarDays,
      show: true,
    },
    {
      label: 'My Tickets',
      href: '/bookings',
      icon: Ticket,
      show: !isOrganizer,
    },
    {
      label: 'Create Event',
      href: '/events/create',
      icon: PlusCircle,
      show: isOrganizer,
    },
    {
      label: 'Scan Tickets',
      href: '/organizer/scan',
      icon: QrCode,
      show: isOrganizer,
    },
  ]

  const handleLogout = async () => {
    logout()
    await navigate({ to: '/login' })
  }

  // Helper for navigation to ensure mobile menu closes
  const handleNavigation = async(path: string) => {
    if (open) setOpen(false)
    await navigate({ to: path })
  }

  const NavList = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className={cn(
          'flex items-center px-6 border-b border-slate-800',
          mobile ? 'h-14' : 'h-16',
        )}
      >
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span>EventHub</span>
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Menu
        </div>
        {links
          .filter((link) => link.show)
          .map((link) => {
            const Icon = link.icon
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`)

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => mobile && setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200',
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="font-semibold text-slate-300">
              {user?.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-slate-500 truncate capitalize">
              {user?.role.toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-900"
            onClick={() => handleNavigation('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30"
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 bg-slate-950 border-r border-slate-800 z-50">
        <NavList />
      </aside>

      {/* MOBILE HEADER (Visible on Mobile) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 font-bold text-lg text-white">
          <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Ticket className="h-4 w-4 text-white" />
          </div>
          <span>EventHub</span>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-72 bg-slate-950 border-slate-800 text-slate-100"
          >
            <NavList mobile />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
