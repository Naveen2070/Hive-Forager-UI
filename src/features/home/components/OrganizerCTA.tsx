import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export const OrganizerCTA = () => {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-linear-to-br from-blue-900/50 to-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-6 relative overflow-hidden"
      >
        {/* Animated Gradient Orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to host your own event?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of organizers who use EventHub to manage tickets,
            track sales, and grow their community.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/20 group"
            >
              Get Started for Free
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
