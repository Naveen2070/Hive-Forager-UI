import { useState } from 'react'
import { format } from 'date-fns'
import { ArrowRight, MapPin, Receipt } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { ReceiptDialog } from './ReceiptDialog'
import type { BookingDTO } from '@/types/booking.type'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookingStatus } from '@/types/enum'

export const HistoryTicketRow = ({ booking }: { booking: BookingDTO }) => {
  const [showReceipt, setShowReceipt] = useState(false)
  const isCancelled = booking.status === BookingStatus.CANCELLED
  const isExpired = booking.status === BookingStatus.EXPIRED

  return (
    <>
      <div className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-xl transition-all hover:bg-slate-900 hover:border-slate-700">
        {/* Date Box */}
        <div className="shrink-0 flex flex-row md:flex-col items-center justify-center w-full md:w-16 h-12 md:h-16 bg-slate-950 rounded-lg border border-slate-800 text-slate-400 gap-2 md:gap-0">
          <span className="text-xs uppercase font-bold text-slate-500">
            {format(new Date(booking.eventDate), 'MMM')}
          </span>
          <span className="text-lg md:text-xl font-bold text-slate-200">
            {format(new Date(booking.eventDate), 'd')}
          </span>
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-slate-200 text-lg group-hover:text-blue-400 transition-colors line-clamp-1">
                {booking.eventTitle}
              </h4>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="h-3 w-3" /> {booking.eventLocation}
              </div>
            </div>
            {/* Status Badge */}
            {isCancelled ? (
              <Badge
                variant="outline"
                className="border-red-900/50 text-red-500 bg-red-900/10"
              >
                Cancelled
              </Badge>
            ) : isExpired ? (
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-500"
              >
                Completed
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="border-slate-700 text-slate-400"
              >
                {booking.status}
              </Badge>
            )}
          </div>

          <Separator className="bg-slate-800/50" />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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

            {/* Actions */}
            <div className="flex justify-end gap-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-white"
                onClick={() => setShowReceipt(true)}
                title="View Receipt"
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
                  className="h-8 w-8 text-slate-500 hover:text-blue-400"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ReceiptDialog
        booking={booking}
        isOpen={showReceipt}
        onOpenChange={setShowReceipt}
      />
    </>
  )
}
