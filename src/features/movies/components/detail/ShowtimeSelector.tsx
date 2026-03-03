import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Edit, Info, MapPin, Ticket, Trash2 } from 'lucide-react'
import { useAuditoriums } from '@/features/auditoriums/hooks/useAuditoriums'
import { useCinemas } from '@/features/cinemas/hooks/useCinemas'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'
import { useShowtimesByMovie } from '@/features/showtimes/hooks/useShowTimes'

interface ShowtimeSelectorProps {
  movieId: string
  isOrganizer?: boolean
  onEdit?: (showtime: any) => void
  onDelete?: (id: string) => void
}

export const ShowtimeSelector = ({
  movieId,
  isOrganizer,
  onEdit,
  onDelete,
}: ShowtimeSelectorProps) => {
  const {
    data: showtimes,
    isLoading: loadingTimes,
    isError,
    refetch,
  } = useShowtimesByMovie(movieId)
  const { data: auditoriums, isLoading: loadingAuds } = useAuditoriums()
  const { data: cinemas, isLoading: loadingCinemas } = useCinemas()

  const isLoading = loadingTimes || loadingAuds || loadingCinemas

  const groupedShowtimes = useMemo(() => {
    if (!showtimes || !auditoriums || !cinemas) return []

    const grouped: Record<string, any> = {}

    showtimes.forEach((show) => {
      const aud = auditoriums.find((a) => a.id === show.auditoriumId)
      if (!aud) return

      const cinema = cinemas.find((c) => c.id === aud.cinemaId)
      if (!cinema) return

      // Initialize Cinema group if it doesn't exist
      if (!grouped[cinema.id]) {
        grouped[cinema.id] = {
          cinemaName: cinema.name,
          location: cinema.location,
          auditoriums: {},
        }
      }

      // Initialize Auditorium group within the Cinema
      if (!grouped[cinema.id].auditoriums[aud.id]) {
        grouped[cinema.id].auditoriums[aud.id] = {
          auditoriumName: aud.name,
          times: [],
        }
      }

      const timeString = new Date(show.startTimeUtc).toLocaleTimeString(
        'en-US',
        {
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'UTC',
          timeZoneName: 'short',
        },
      )

      grouped[cinema.id].auditoriums[aud.id].times.push({
        ...show,
        cinemaId: cinema.id,
        formattedTime: timeString,
      })
    })

    // Sort times sequentially within each auditorium
    Object.values(grouped).forEach((cinema: any) => {
      Object.values(cinema.auditoriums).forEach((aud: any) => {
        aud.times.sort(
          (a: any, b: any) =>
            new Date(a.startTimeUtc).getTime() -
            new Date(b.startTimeUtc).getTime(),
        )
      })
    })

    return Object.values(grouped)
  }, [showtimes, auditoriums, cinemas])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl bg-slate-900" />
        <Skeleton className="h-32 w-full rounded-2xl bg-slate-900" />
      </div>
    )
  }

  if (isError) {
    return (
      <DataFallback
        title="Ticketing Unavailable"
        message="Our worker bees couldn't fetch the showtimes right now."
        onRetry={refetch}
      />
    )
  }

  if (groupedShowtimes.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl">
        <Ticket className="mx-auto h-12 w-12 text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-slate-300">
          No Showtimes Available
        </h3>
        <p className="text-slate-500 mt-2">
          There are currently no upcoming showtimes for this movie.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groupedShowtimes.map((cinemaGroup: any, index: number) => (
        <div
          key={index}
          className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6"
        >
          {/* Cinema Header */}
          <div className="mb-6 border-b border-slate-800/50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-yellow-500" />
                {cinemaGroup.cinemaName}
              </h3>
              <span className="flex items-center text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-md ml-7 sm:ml-0 w-fit">
                <Info className="h-3 w-3 mr-1.5 text-blue-400" />
                Venue Local Time
              </span>
            </div>
            <p className="text-sm text-slate-400 ml-7 mt-2 sm:mt-1">
              {cinemaGroup.location}
            </p>
          </div>

          {/* Auditoriums & Times */}
          <div className="space-y-6">
            {Object.values(cinemaGroup.auditoriums).map(
              (audGroup: any, aIndex: number) => (
                <div key={aIndex} className="ml-2 md:ml-7">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                    {audGroup.auditoriumName}
                  </h4>

                  <div className="flex flex-wrap gap-4 mt-2">
                    {audGroup.times.map((timeObj: any) => (
                      <div key={timeObj.id} className="relative group">
                        {/* The Clickable Button for Attendees */}
                        <Link
                          to="/checkout/$showtimeId"
                          params={{ showtimeId: timeObj.id }}
                          className="flex flex-col items-center justify-center bg-slate-950 border border-slate-700 rounded-xl px-6 py-3 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all cursor-pointer shadow-sm hover:shadow-yellow-500/20"
                        >
                          <span className="text-sm font-medium text-slate-200 group-hover:text-yellow-400">
                            {timeObj.formattedTime}
                          </span>
                          <span className="text-[10px] text-slate-500 group-hover:text-yellow-500/70">
                            ${timeObj.basePrice.toFixed(2)}
                          </span>
                        </Link>

                        {/* Organizer Action Overlay (Floating Edit/Delete) */}
                        {isOrganizer && (
                          <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                onEdit?.(timeObj)
                              }}
                              className="bg-slate-800 p-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-blue-400 hover:bg-slate-700 shadow-lg transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                onDelete?.(timeObj.id)
                              }}
                              className="bg-slate-800 p-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-slate-700 shadow-lg transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
