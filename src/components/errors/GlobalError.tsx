import { motion } from 'framer-motion'
import { Home, RefreshCcw } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

import error500Bee from '@/assets/500-bee.png'

interface GlobalErrorProps {
  error: Error
  reset: () => void
}

export const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  const router = useRouter()

  return (
    // Changed min-h-[80vh] to min-h-screen for perfect vertical centering
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 w-full relative overflow-hidden">
      {/* Subtle yellow glow to match the projector light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-6 text-center">
        {/* The Custom 500 Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="flex justify-center w-full"
        >
          <img
            src={error500Bee}
            alt="500 Error - Projector Broken"
            className="w-full max-w-100 drop-shadow-2xl"
          />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            The projector broke.
          </h1>
          <p className="text-slate-400">
            Our worker bees encountered a fatal system glitch while trying to
            load this scene.
          </p>
        </div>

        {/* Developer Error Terminal Box */}
        <div className="text-left bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto relative shadow-inner">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 rounded-l-xl" />
          {/* Fixed wrap-break-word to break-words */}
          <p className="text-xs font-mono text-red-400 wrap-break-word whitespace-pre-wrap">
            {error.message || 'Unknown Fatal Server Error'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => {
              reset()
              router.invalidate()
            }}
            className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 backdrop-blur-sm"
            >
              <Home className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
