import { Link } from '@tanstack/react-router'
import { Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'

export const LandingNavbar = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <header className="border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span>EventHub</span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link to="/events">
              <Button>Go to Dashboard</Button>
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
