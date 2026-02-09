import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from '@tanstack/react-router'
import {  motion } from 'framer-motion'
import { Sidebar } from '@/components/layouts/Sidebar'
import { useAuthStore } from '@/store/auth.store'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState()
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
})

function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />

      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen transition-all duration-300 ease-in-out">
        <div className="container py-8 px-6 lg:px-10 max-w-7xl mx-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
