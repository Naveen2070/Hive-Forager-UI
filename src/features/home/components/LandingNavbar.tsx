import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types/enum.ts'

export const LandingNavbar = () => {
  const { isAuthenticated, user } = useAuthStore()
  const isOrganizer = user?.role === UserRole.ORGANIZER

  return (
    <header className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <img
            src="/hive-forager-ui-logo.png"
            alt="Hive Forager Logo"
            className="h-10 w-10  rounded-md object-fill"
          />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-slate-100 to-slate-400">
            Hive Forager
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/events" className="hover:text-white transition-colors">
            Events
          </Link>
          <Link to="/movies" className="hover:text-white transition-colors">
            Movies
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to={isOrganizer ? '/dashboard' : '/bookings'}>
              <Button className="bg-blue-600 hover:bg-blue-500">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-500">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
