import { Hexagon } from 'lucide-react'

export const LandingFooter = () => {
  return (
    <footer className="border-t border-slate-800 py-12 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-200">
          <Hexagon className="h-5 w-5 text-blue-500 fill-blue-500/20" />
          <span>Hive Forager</span>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Hive Forager Inc. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
