import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

import serverBees1 from '@/assets/server-bees-1.png'
import serverBees2 from '@/assets/server-bees-2.png'
import serverBees3 from '@/assets/server-bees-3.png'
import serverBees4 from '@/assets/server-bees-4.png'
import serverBees5 from '@/assets/server-bees-5.png'

// Define the random variants with their matching puns
const FALLBACK_VARIANTS = [
  {
    src: serverBees1,
    pun: 'The hive server might be covered in a little too much honey.',
  },
  {
    src: serverBees2,
    pun: 'Looks like a drone tripped over the main nectar cable.',
  },
  {
    src: serverBees3,
    pun: 'Our cloud infrastructure is experiencing a sticky meltdown.',
  },
  {
    src: serverBees4,
    pun: 'The diagnostic tools are reporting a severe honey jam.',
  },
  {
    src: serverBees5,
    pun: 'The analytics board got a little too sweet to read.',
  },
]

interface DataFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const DataFallback = ({
  title = 'We hit a snag.',
  message = "Our worker bees couldn't fetch the data.",
  onRetry,
}: DataFallbackProps) => {
  // Randomly select one variant ONLY when the component mounts
  const variant = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_VARIANTS.length)
    return FALLBACK_VARIANTS[randomIndex]
  }, [])

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/30 p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-6">
      {/* The Dynamic Server Crash Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
      >
        <img
          src={variant.src}
          alt="Server Error - Bees fixing the hive"
          className="w-full max-w-87.5 drop-shadow-2xl"
        />
      </motion.div>

      {/* Messaging & Dynamic Pun */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-2xl font-semibold text-slate-100">{title}</h3>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          {message}{' '}
          <span className="text-yellow-100/70 italic block mt-1">
            {variant.pun}
          </span>
        </p>
      </div>

      {/* Optional Retry Button */}
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-4 border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-200 shadow-lg shadow-slate-900/20"
        >
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      )}
    </div>
  )
}
