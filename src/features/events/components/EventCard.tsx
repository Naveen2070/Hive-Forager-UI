import { CalendarDays, Edit, Loader2, MapPin, Trash2, User } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import type { EventDTO } from '@/types/event.type.ts'
import { useAuthStore } from '@/store/auth.store.ts'
import { EventStatus, UserRole } from '@/types/enum.ts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card.tsx'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useDeleteEvent } from '@/features/events/hooks/useDeleteEvent.ts'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'

interface EventCardProps {
  event: EventDTO
  isOwner?: boolean
}

export const EventCard = ({ event, isOwner }: EventCardProps) => {
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent()
  const { user } = useAuthStore()
  const isAdmin = user?.role === UserRole.ADMIN

  // Calculate Total Capacity across all tiers for the progress bar
  const totalCapacity = event.ticketTiers.reduce(
    (sum, tier) => sum + tier.totalAllocation,
    0,
  )
  const totalAvailable = event.ticketTiers.reduce(
    (sum, tier) => sum + tier.availableAllocation,
    0,
  )
  const percentAvailable =
    totalCapacity > 0 ? (totalAvailable / totalCapacity) * 100 : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case EventStatus.PUBLISHED:
        return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20'
      case EventStatus.DRAFT:
        return 'bg-amber-500/15 text-amber-500 border-amber-500/20'
      case EventStatus.CANCELLED:
        return 'bg-red-500/15 text-red-500 border-red-500/20'
      case EventStatus.COMPLETED:
        return 'bg-slate-500/15 text-slate-500 border-slate-500/20'
      default:
        return 'bg-slate-800 text-slate-400'
    }
  }

  const detailLinkProps = {
    to: '/events/$eventId',
    params: { eventId: event.id.toString() },
  }

  return (
    <Card className="flex flex-col h-full bg-slate-950 border-slate-800 overflow-hidden hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-md hover:shadow-blue-900/20">
      {/* Hero Section (Image Placeholder) */}
      <div className="h-32 w-full bg-slate-900 relative border-b border-slate-800 group-hover:bg-slate-800/50 transition-colors">
        {/* Status Badge (Top Right) */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`${getStatusColor(event.status)} backdrop-blur-md`}
          >
            {event.status}
          </Badge>
        </div>

        {/* Price Badge (Bottom Left) */}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="secondary"
            className="bg-slate-950/80 backdrop-blur text-slate-200 border-slate-700"
          >
            {event.priceRange || 'Free'}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <Link
          {...detailLinkProps}
          className="hover:underline decoration-blue-500 underline-offset-4"
        >
          <h3 className="text-lg font-semibold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
            {event.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
          <MapPin className="h-3.5 w-3.5 text-slate-500" />
          <span className="truncate">{event.location || 'Online Event'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 space-y-4">
        {/* Date & Organizer */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 border border-slate-800 text-blue-400">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-slate-200">
                {event.startDate
                  ? format(new Date(event.startDate), 'PPP')
                  : 'TBA'}
              </p>
              <p className="text-xs text-slate-500">
                {event.startDate
                  ? format(new Date(event.startDate), 'h:mm a')
                  : ''}
              </p>
            </div>
          </div>

          {!isOwner && (
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 border border-slate-800 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <span className="text-xs">
                By {event.organizerName || 'Unknown Organizer'}
              </span>
            </div>
          )}
        </div>

        {/* Seat Availability Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ticket Availability</span>
            <span
              className={
                percentAvailable < 20 ? 'text-red-400' : 'text-slate-400'
              }
            >
              {percentAvailable === 0
                ? 'Sold Out'
                : `${Math.round(percentAvailable)}% left`}
            </span>
          </div>
          {/* Simple Progress Bar */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${percentAvailable < 20 ? 'bg-red-500' : 'bg-blue-600'}`}
              style={{
                width: `${percentAvailable}%`,
              }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-2">
        {isOwner || isAdmin ? (
          <>
            <Link
              to="/events/$eventId/edit"
              params={{ eventId: event.id.toString() }}
              className="flex flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-slate-700 hover:bg-slate-800 text-slate-300"
              >
                <Edit className="h-3.5 w-3.5 mr-2" /> Manage
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:bg-red-950/30 hover:text-red-300"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-slate-950 border-slate-800 text-slate-200">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    This action cannot be undone. This will permanently delete
                    the event
                    <span className="font-semibold text-white">
                      {' '}
                      "{event.title}"{' '}
                    </span>
                    and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteEvent(event.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Link {...detailLinkProps} className="w-full">
            <Button
              size="sm"
              disabled={percentAvailable === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {percentAvailable === 0 ? 'Sold Out' : 'Book Ticket'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
