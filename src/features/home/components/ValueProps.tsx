import { Globe, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Zap,
    className: 'bg-blue-500/10 text-blue-400',
    title: 'Instant Booking',
    desc: 'Secure your spot in seconds with our lightning-fast checkout process.',
  },
  {
    icon: ShieldCheck,
    className: 'bg-emerald-500/10 text-emerald-400',
    title: 'Secure Payments',
    desc: 'We use industry-standard encryption to ensure your data is always safe.',
  },
  {
    icon: Globe,
    className: 'bg-purple-500/10 text-purple-400',
    title: 'Global Reach',
    desc: 'Find events happening in your local community or halfway across the world.',
  },
]

export const ValueProps = () => {
  return (
    <section className="py-24 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="space-y-4 group"
          >
            <div
              // Use the mapped className here
              className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 ${feature.className}`}
            >
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
