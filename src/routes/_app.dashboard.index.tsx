import { createFileRoute } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import { DashboardStatsGrid } from '@/features/dashboard/components/DashboardStatsGrid'
import { RevenueChart } from '@/features/dashboard/components/RevenueChart'
import { RecentSales } from '@/features/dashboard/components/RecentSales'
import { Button } from '@/components/ui/button'
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats.ts'
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton.tsx'

export const Route = createFileRoute('/_app/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error || !stats) {
    return <div className="text-red-500">Failed to load dashboard data.</div>
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h2>
        <div className="flex items-center">
          <Button
            variant="outline"
            className="border-slate-800 text-slate-300 hover:bg-slate-900"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Download Report</span>
          </Button>
        </div>
      </div>

      {/* 1. Top Stats Cards */}
      <DashboardStatsGrid stats={stats} />

      {/* 2. Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart takes up 4 columns */}
        <div className="col-span-4">
          <RevenueChart data={stats.revenueTrend} />
        </div>

        {/* Sales list takes up 3 columns */}
        <div className="col-span-3">
          <RecentSales sales={stats.recentSales} />
        </div>
      </div>
    </div>
  )
}