import {
  Activity,
  Clock,
  DollarSign,
  Ticket,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import type { DashboardStatsDTO } from '@/types/dashboard.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const DashboardStatsGrid = ({ stats }: { stats: DashboardStatsDTO }) => {
  // Helper to render growth percentage
  const renderGrowth = (percent: number) => {
    const isPositive = percent >= 0
    return (
      <div
        className={`flex items-center text-xs ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}
      >
        {isPositive ? (
          <TrendingUp className="mr-1 h-3 w-3" />
        ) : (
          <TrendingDown className="mr-1 h-3 w-3" />
        )}
        <span>{Math.abs(percent).toFixed(1)}% from last month</span>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Revenue Card */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Total Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            $
            {stats.totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          {renderGrowth(stats.revenueGrowthLastMonthPercent)}
        </CardContent>
      </Card>

      {/* 2. Tickets Sold Card */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Tickets Sold
          </CardTitle>
          <Ticket className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats.totalTicketsSold}
          </div>
          <p className="text-xs text-slate-500">
            +{stats.ticketsSoldLastWeek} new this week
          </p>
        </CardContent>
      </Card>

      {/* 3. Pending Payments (New Actionable Metric) */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Pending Orders
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats.pendingPaymentTickets}
          </div>
          <p className="text-xs text-slate-500">Awaiting payment completion</p>
        </CardContent>
      </Card>

      {/* 4. Active Events */}
      <Card className="bg-slate-950 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">
            Active Events
          </CardTitle>
          <Activity className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {stats.activeEvents}
          </div>
          <p className="text-xs text-slate-500">
            out of {stats.totalEvents} total created
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
