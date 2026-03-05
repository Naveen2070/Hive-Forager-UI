import { Link } from '@tanstack/react-router'
import { ArrowRight, Mic2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export const OrganizerCTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-8 md:p-16 overflow-hidden group hover:border-blue-500/40 transition-colors duration-500"
        >
          {/* Ambient Corner Glows (Matching the Bento Grid) */}
          <div className="absolute top-0 right-0 w-125 h-125 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-700 group-hover:bg-blue-600/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-125 h-125 bg-emerald-600/10 rounded-full blur-[100px] -ml-40 -mb-40 transition-all duration-700 group-hover:bg-emerald-600/20 pointer-events-none" />

          {/* Authentic Texture Mask */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=2000"
              alt="Concert Texture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-8 max-w-3xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest shadow-lg">
                <Mic2 className="h-4 w-4" />
                For Promoters & Cinemas
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Fill your venues and <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
                  pack your theaters.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Get access to powerful seating charts, real-time analytics, and
                our global audience. Whether you're organizing a music festival
                or managing a multiplex, Hive Forager scales with you.
              </p>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-16 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-300 group/btn rounded-2xl font-bold"
                >
                  Become a Partner
                  <motion.span
                    className="inline-block ml-3 bg-slate-950 text-white p-1 rounded-full group-hover/btn:bg-blue-600 transition-colors"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
