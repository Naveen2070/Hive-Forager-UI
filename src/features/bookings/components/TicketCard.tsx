import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  ArrowRight,
  Check,
  Clock,
  Copy,
  MapPin,
  QrCode,
  Receipt,
} from 'lucide-react'
import { toast } from 'sonner'

import { TicketQRDialog } from './TicketQRDialog'
import { ReceiptDialog } from './ReceiptDialog'
import type { BookingDTO } from '@/types/booking.type'
import { getBookingStatusStyles } from '@/features/bookings/utils/status.utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookingStatus } from '@/types/enum'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Ticket,
  TicketActions,
  TicketContent,
  TicketDateBlock,
  TicketStamp,
} from '@/components/shared/TicketLayout'

export const TicketCard = ({ booking }: { booking: BookingDTO }) => {
  const [showQR, setShowQR] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [copied, setCopied] = useState(false)

  const { isOngoing, isPast } = useMemo(() => {
    const now = new Date()
    const startDate = new Date(booking.eventDate)
    const endDate = new Date(booking.eventEndDate)
    return {
      isOngoing: now >= startDate && now <= endDate,
      isPast:
        now > endDate ||
        [BookingStatus.CANCELLED, BookingStatus.EXPIRED].includes(
          booking.status as BookingStatus,
        ),
    }
  }, [booking.eventDate, booking.eventEndDate, booking.status])

  const styles = getBookingStatusStyles(booking.status)

  // Stamp Logic
  let stampText = 'COMPLETED'
  let stampColor = 'border-emerald-500 text-emerald-500'

  if (booking.status === BookingStatus.CANCELLED) {
    stampText = 'CANCELLED'
    stampColor = 'border-red-500 text-red-500'
  } else if (booking.status === BookingStatus.CHECKED_IN) {
    stampText = 'USED'
    stampColor = 'border-blue-500 text-blue-500'
  } else if (booking.status === BookingStatus.EXPIRED) {
    stampText = 'EXPIRED'
    stampColor = 'border-slate-500 text-slate-500'
  }

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(booking.bookingReference)
    setCopied(true)
    toast.success('Booking reference copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Ticket isPast={isPast} accent="blue">
        {isPast && <TicketStamp text={stampText} colorClass={stampColor} />}

        <TicketDateBlock>
          <p className="text-blue-500 font-bold text-sm uppercase tracking-wider mb-1">
            {format(new Date(booking.eventDate), 'MMM d')}
          </p>
          <Link
            to="/events/$eventId"
            params={{ eventId: booking.eventId.toString() }}
          >
            <p className="text-2xl font-extrabold text-white hover:text-blue-400 transition-colors">
              {format(new Date(booking.eventDate), 'h:mm a')}
            </p>
          </Link>
        </TicketDateBlock>

        {isPast ? (
          /* PAST VIEW (Flattened Grid) */
          <TicketContent>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-200 text-lg group-hover:text-blue-400 transition-colors line-clamp-1">
                  {booking.eventTitle}
                </h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3 w-3" /> {booking.eventLocation}
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-500 uppercase"
              >
                {stampText === 'CANCELLED' ? 'Cancelled' : 'Completed'}
              </Badge>
            </div>

            <Separator className="bg-slate-800/50 my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm items-center">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold">
                  Type
                </span>
                <p className="text-slate-300 font-medium truncate">
                  {booking.ticketTierName || 'Standard'}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold">
                  Qty
                </span>
                <p className="text-slate-300 font-medium">
                  {booking.ticketsCount}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold">
                  Total
                </span>
                <p className="text-white font-bold">
                  ${booking.totalPrice.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-end gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-white backdrop-blur-sm bg-slate-900/50"
                  onClick={() => setShowReceipt(true)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
                <Link
                  to="/events/$eventId"
                  params={{ eventId: booking.eventId.toString() }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-blue-400 backdrop-blur-sm bg-slate-900/50"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </TicketContent>
        ) : (
          /* UPCOMING VIEW (Expanded Data & Actions) */
          <>
            <TicketContent>
              <div className="flex justify-between items-start mb-2">
                <Link
                  to="/events/$eventId"
                  params={{ eventId: booking.eventId.toString() }}
                  className="hover:underline decoration-blue-500 underline-offset-4"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {booking.eventTitle}
                  </h3>
                </Link>
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.badge}`}
                >
                  <styles.icon className="h-3 w-3" />
                  <span>{styles.label}</span>
                </div>
              </div>

              <div className="space-y-1 mt-1 text-sm text-slate-400">
                <p className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2 shrink-0" />{' '}
                  {booking.eventLocation}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 uppercase mr-2">
                    Admit:
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-1 rounded">
                    {booking.ticketsCount} ×{' '}
                    {booking.ticketTierName || 'Standard'}
                  </span>
                </div>
                {isOngoing && (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold animate-pulse">
                    <Clock className="h-3.5 w-3.5" /> HAPPENING NOW
                  </div>
                )}
              </div>
            </TicketContent>

            <TicketActions>
              <div className="flex justify-between md:flex-col md:gap-1 text-right md:text-left">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">
                    Total Paid
                  </span>
                  <div className="text-xl font-bold text-white">
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopyId}
                        className="group/id flex items-center justify-end md:justify-start gap-1 font-mono text-[10px] text-slate-500 mt-1 hover:text-slate-300 transition-colors cursor-copy"
                      >
                        REF: {booking.bookingReference}
                        {copied ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-0 group-hover/id:opacity-100 transition-opacity" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                      Click to copy
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {booking.status === BookingStatus.CONFIRMED ||
                booking.status === BookingStatus.CHECKED_IN ? (
                  <>
                    <Button
                      onClick={() => setShowQR(true)}
                      className={`w-full font-bold shadow-lg transition-all ${isOngoing ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                    >
                      <QrCode className="h-4 w-4 mr-2" />{' '}
                      {isOngoing ? 'Scan Now' : 'View Ticket'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowReceipt(true)}
                      className="w-full text-slate-400 hover:text-white hover:bg-slate-800 h-8 text-xs"
                    >
                      <Receipt className="h-3 w-3 mr-2" /> Receipt
                    </Button>
                  </>
                ) : booking.status === BookingStatus.PENDING ? (
                  <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold">
                    Pay Now <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full border-slate-800 text-slate-500"
                  >
                    Unavailable
                  </Button>
                )}
              </div>
            </TicketActions>
          </>
        )}
      </Ticket>

      <TicketQRDialog
        booking={booking}
        isOpen={showQR}
        onOpenChange={setShowQR}
      />
      <ReceiptDialog
        booking={booking}
        isOpen={showReceipt}
        onOpenChange={setShowReceipt}
      />
    </>
  )
}
