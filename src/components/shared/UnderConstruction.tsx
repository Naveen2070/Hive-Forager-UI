import { Link, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

import constructionBee from '@/assets/under-construction.png'

export const UnderConstruction = () => {
  const router = useRouter()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden w-full">
      {/* Subtle amber/honey glow for the construction theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl space-y-8 text-center">
        {/* The Construction Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center w-full"
        >
          <img
            src={constructionBee}
            alt="Under Construction - Worker Bees"
            className="w-full max-w-125 drop-shadow-2xl"
          />
        </motion.div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-amber-100">
            Pardon our dust!
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            Our worker bees are buzzing away behind the scenes to bring you this
            new feature. Grab some popcorn and check back soon!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={() => router.history.back()}
            className="w-full sm:w-auto bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-900/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>

          <Link to="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-200 hover:text-amber-100 backdrop-blur-sm"
            >
              <Home className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
