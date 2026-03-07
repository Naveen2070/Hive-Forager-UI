import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Download, Film, LayoutDashboard } from 'lucide-react'
import { motion } from 'framer-motion'

import { DashboardStatsGrid } from '@/features/dashboard/components/DashboardStatsGrid'
import { RevenueChart } from '@/features/dashboard/components/RevenueChart'
import { RecentSales } from '@/features/dashboard/components/RecentSales'
import { Button } from '@/components/ui/button'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats.ts'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton.tsx'
import { DataFallback } from '@/components/shared/DataFallback.tsx'

export const Route = createFileRoute('/_app/dashboard/')({
  component: DashboardPage,
})

type DashboardMode = 'combined' | 'events' | 'movies'

export function DashboardPage() {
  const [mode, setMode] = useState<DashboardMode>('combined')
  const { data: stats, isLoading, error, refetch } = useDashboardStats(mode)

  const modes: { id: DashboardMode; label: string; icon: any }[] = [
    { id: 'combined', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'movies', label: 'Movies', icon: Film },
  ]

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !stats) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h2>
        <DataFallback
          title="Analytics Server Unreachable"
          message="We couldn't load your dashboard statistics right now."
          onRetry={refetch}
        />
      </div>
    )
  }

  // Calculate the index for the animated sliding background
  const activeIndex = modes.findIndex((m) => m.id === mode)

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 md:pt-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h2>

        <div className="flex flex-col-reverse sm:flex-row items-start sm:items-center gap-4">
          {/* The Sleek 3-Way Mode Toggle */}
          <div className="bg-slate-900 p-1 rounded-full flex relative shadow-inner border border-slate-800 w-full sm:w-auto">
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-slate-800 shadow-lg z-0"
              initial={false}
              animate={{
                x: `${activeIndex * 100}%`,
                width: `${100 / modes.length}%`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            {modes.map((m) => {
              const Icon = m.icon
              const isActive = mode === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`relative z-10 flex-1 sm:px-6 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 rounded-full ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive && m.id === 'events' ? 'text-blue-500' : isActive && m.id === 'movies' ? 'text-yellow-500' : ''}`}
                  />
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            className="border-slate-800 text-slate-300 hover:bg-slate-900 w-full sm:w-auto"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="inline">Export</span>
          </Button>
        </div>
      </div>

      {/* 1. Top Stats Cards */}
      <DashboardStatsGrid stats={stats} mode={mode} />

      {/* 2. Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart data={stats.revenueTrend} />
        </div>
        <div className="col-span-3">
          <RecentSales sales={stats.recentSales} />
        </div>
      </div>
    </div>
  )
}
