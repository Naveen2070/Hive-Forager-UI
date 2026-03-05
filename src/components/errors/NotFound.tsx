import { Link } from '@tanstack/react-router'
import { CalendarDays, Film, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

import errorBee from '@/assets/404-bee.png'

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        {/* The Custom 404 Image with a smooth entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center w-full"
        >
          <img
            src={errorBee}
            alt="404 Error - Show Canceled"
            className="w-full max-w-87.5 drop-shadow-2xl"
          />
        </motion.div>

        {/* 👉 Re-added Text Messaging */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-100">
            Honey, you're lost.
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            It looks like this show got canceled. The page you are looking for
            doesn't exist, has been moved, or you took a wrong turn in the hive.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-lg shadow-yellow-900/30">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </Link>
          <Link to="/events">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:text-yellow-100"
            >
              <CalendarDays className="mr-2 h-4 w-4" /> Events
            </Button>
          </Link>
           <Link to="/movies">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:text-yellow-100"
          >
            <Film className="mr-2 h-4 w-4" /> Movies
          </Button>
           </Link>
        </div>
      </div>
    </div>
  )
}
