import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'

export const HeroSection = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      {/* Animated Background Blob */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        {/* Staggered Text Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            The platform for <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
              unforgettable events.
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Discover concerts, conferences, and workshops in your city. Or create
          your own event and start selling tickets in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to="/events">
            <Button
              size="lg"
              className="h-12 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 hover:scale-105 transition-transform"
            >
              Browse Events
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-lg border-slate-700 hover:bg-slate-900 hover:text-white hover:scale-105 transition-transform"
              >
                Host an Event
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  )
}
