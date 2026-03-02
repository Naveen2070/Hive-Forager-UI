import { Skeleton } from '@/components/ui/skeleton'
import type { CinemaResponse } from '@/types/cinema.type'
import { CinemaCard } from './CinemaCard'

interface CinemaGridProps {
  cinemas: CinemaResponse[]
  isLoading: boolean
  isOwner: boolean
  emptyMessage: string
  onEdit?: (cinema: CinemaResponse) => void
  onDelete?: (id: string) => void
}

export const CinemaGrid = ({
  cinemas,
  isLoading,
  isOwner,
  emptyMessage,
  onEdit,
  onDelete,
}: CinemaGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-55 rounded-2xl bg-slate-900" />
        ))}
      </div>
    )
  }

  if (cinemas.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl">
        <p className="text-slate-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cinemas.map((cinema) => (
        <CinemaCard
          key={cinema.id}
          cinema={cinema}
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
