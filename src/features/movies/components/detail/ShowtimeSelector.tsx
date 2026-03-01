import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin, Ticket } from 'lucide-react'
import { useAuditoriums } from '@/features/auditoriums/hooks/useAuditoriums'
import { useCinemas } from '@/features/cinemas/hooks/useCinemas'
import { DataFallback } from '@/components/shared/DataFallback'
import { Skeleton } from '@/components/ui/skeleton'
import { useShowtimesByMovie } from '@/features/showtimes/hooks/useShowTimes.ts'

interface ShowtimeSelectorProps {
  movieId: string
}

export const ShowtimeSelector = ({ movieId }: ShowtimeSelectorProps) => {
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

      // Format time (e.g., 7:30 PM)
      const timeString = new Date(show.startTimeUtc).toLocaleTimeString(
        'en-US',
        {
          hour: 'numeric',
          minute: '2-digit',
        },
      )

      grouped[cinema.id].auditoriums[aud.id].times.push({
        id: show.id,
        time: timeString,
        basePrice: show.basePrice,
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
            <h3 className="text-xl font-bold text-slate-100 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-yellow-500" />
              {cinemaGroup.cinemaName}
            </h3>
            <p className="text-sm text-slate-400 ml-7 mt-1">
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

                  <div className="flex flex-wrap gap-3">
                    {audGroup.times.map((timeObj: any) => (
                      <Link
                        key={timeObj.id}
                        to="/checkout/$showtimeId"
                        params={{ showtimeId: timeObj.id }}
                        className="group flex flex-col items-center justify-center bg-slate-950 border border-slate-700 rounded-xl px-5 py-2.5 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all cursor-pointer shadow-sm hover:shadow-yellow-500/20"
                      >
                        <span className="text-sm font-medium text-slate-200 group-hover:text-yellow-400">
                          {timeObj.time}
                        </span>
                        <span className="text-[10px] text-slate-500 group-hover:text-yellow-500/70">
                          ${timeObj.basePrice.toFixed(2)}
                        </span>
                      </Link>
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
