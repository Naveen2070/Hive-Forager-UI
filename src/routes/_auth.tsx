import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/motion.ts'
import { Hexagon } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-950 text-slate-100">
      {/* LEFT BRAND PANEL */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-white/5">
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-950 to-black" />

        {/* Blue Glow Effect */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 flex items-center gap-3 text-xl font-semibold tracking-tight"
        >
          {/* Logo Icon */}
          <img
            src="/hive-forager-ui-logo.png"
            alt="Hive Forager Logo"
            className="h-10 w-10  rounded-md object-fill"
          />
          <span className="bg-linear-to-br from-white to-slate-400 bg-clip-text text-transparent">
            Hive Forager
          </span>
        </motion.div>

        <motion.blockquote
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative z-10 max-w-md space-y-4"
        >
          <p className="text-xl font-medium leading-relaxed text-slate-200">
            “Whether it's a massive tech conference or a blockbuster midnight
            movie premiere, Hive Forager handles the ticketing rush flawlessly.”
          </p>
          <footer className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10" />
            <div className="text-sm">
              <div className="font-semibold text-white">Elena Rodriguez</div>
              <div className="text-slate-400">
                Operations Director, Global Entertainment
              </div>
            </div>
          </footer>
        </motion.blockquote>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex items-center justify-center px-6 relative">
        {/* Subtle background mesh or glow for right side */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-sm space-y-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center space-y-2 mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 mb-2">
              <Hexagon className="h-7 w-7 fill-blue-500 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Hive Forager
            </h1>
          </div>

          <Outlet />

          <p className="text-center text-xs text-slate-500">
            By continuing, you agree to our{' '}
            <Link
              to="/"
              className="underline hover:text-blue-400 transition-colors"
            >
              Terms
            </Link>{' '}
            &{' '}
            <Link
              to="/"
              className="underline hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
