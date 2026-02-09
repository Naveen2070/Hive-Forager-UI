export const EventDetailSkeleton = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="h-4 w-24 bg-slate-800 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-3/4 bg-slate-800 rounded" />
          <div className="h-4 w-1/2 bg-slate-800 rounded" />
          <div className="h-64 w-full bg-slate-900 rounded-xl border border-slate-800" />
        </div>
        <div className="lg:col-span-1">
          <div className="h-64 w-full bg-slate-900 rounded-xl border border-slate-800" />
        </div>
      </div>
    </div>
  )
}
