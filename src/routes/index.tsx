import { createFileRoute } from '@tanstack/react-router'
import { LandingNavbar } from '@/features/home/components/LandingNavbar'
import { HeroSection } from '@/features/home/components/HeroSection'
import { FeaturedEvents } from '@/features/home/components/FeaturedEvents'
import { ValueProps } from '@/features/home/components/ValueProps'
import { OrganizerCTA } from '@/features/home/components/OrganizerCTA'
import { LandingFooter } from '@/features/home/components/LandingFooter'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedEvents />
        <ValueProps />
        <OrganizerCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
