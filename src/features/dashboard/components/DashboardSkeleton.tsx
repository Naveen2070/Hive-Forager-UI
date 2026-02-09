import { Skeleton } from '@/components/ui/skeleton.tsx'

export function DashboardSkeleton() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 bg-slate-900" />
        <Skeleton className="h-10 w-32 bg-slate-900" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl bg-slate-900" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-4 h-100 rounded-xl bg-slate-900" />
        <Skeleton className="col-span-3 h-100 rounded-xl bg-slate-900" />
      </div>
    </div>
  )
}
