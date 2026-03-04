import {
  Clapperboard,
  LayoutGrid,
  QrCode,
  ShieldCheck,
  Ticket,
} from 'lucide-react'
import { motion } from 'framer-motion'

export const ValueProps = () => {
  return (
    <section className="py-24 px-6 bg-slate-950 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-100 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Your ultimate entertainment hub.
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to discover and book your next unforgettable
            experience, wrapped in a single, seamless digital platform.
          </p>
        </div>

        {/* The True Bento Grid
          Row 1: 2-col wide box + 1-col square box
          Row 2: 1-col square box + 2-col wide box
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box 1: Unified Experience (Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-linear-to-br from-blue-900/20 to-slate-900 p-8 md:p-10 rounded-[2rem] border border-slate-800 relative overflow-hidden group hover:border-blue-500/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-500 group-hover:bg-blue-500/20" />
            <div className="relative z-10 space-y-5 max-w-lg">
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg">
                  <Ticket className="h-7 w-7" />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shadow-lg">
                  <Clapperboard className="h-7 w-7" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white">
                Events & Movies in One Wallet
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Skip the app switching. Book tickets for massive music festivals
                and the latest IMAX premieres, all stored securely side-by-side.
              </p>
            </div>
          </motion.div>

          {/* Box 2: Interactive Seatmaps (Square) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 bg-linear-to-br from-purple-900/20 to-slate-900 p-8 md:p-10 rounded-[2rem] border border-slate-800 relative overflow-hidden group hover:border-purple-500/50 transition-colors"
          >
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mb-10 transition-all duration-500 group-hover:bg-purple-500/20" />
            <div className="relative z-10 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg">
                <LayoutGrid className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Real-Time Seatmaps
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Pick your exact seats with our interactive venue builder. No
                more guessing where you'll sit.
              </p>
            </div>
          </motion.div>

          {/* Box 3: Security (Square) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 bg-linear-to-br from-emerald-900/20 to-slate-900 p-8 md:p-10 rounded-[2rem] border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
          >
            <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -ml-10 -mt-10 transition-all duration-500 group-hover:bg-emerald-500/20" />
            <div className="relative z-10 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Bank-Grade Security
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Your data and payments are protected by end-to-end encryption
                and enterprise-level compliance.
              </p>
            </div>
          </motion.div>

          {/* Box 4: Offline QR Wallet (Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 bg-linear-to-br from-cyan-900/20 to-slate-900 p-8 md:p-10 rounded-[2rem] border border-slate-800 flex flex-col justify-center relative overflow-hidden group hover:border-cyan-500/50 transition-colors"
          >
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -mr-20 -mb-20 transition-all duration-500 group-hover:bg-cyan-500/20" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
                <QrCode className="h-8 w-8" />
              </div>
              <div className="space-y-3 max-w-lg">
                <h3 className="text-3xl font-bold text-white">
                  Instant Offline Access
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  No cell service at the venue? No problem. Your tickets are
                  cached locally as high-fidelity QR codes, ready for
                  lightning-fast scanning at the door.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
