import { Download, Share2, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import QRCode from 'react-qr-code'
import type { BookingDTO } from '@/types/booking.type.ts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface TicketQRDialogProps {
  booking: BookingDTO
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const TicketQRDialog = ({
  booking,
  isOpen,
  onOpenChange,
}: TicketQRDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100 p-0 overflow-hidden gap-0 shadow-2xl">
        {/* Header Section */}
        <div className="bg-slate-900 p-6 text-center border-b border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {booking.eventTitle}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {format(new Date(booking.eventDate), 'PPP')} •{' '}
              {format(new Date(booking.eventDate), 'p')}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* QR Code Section */}
        <div className="p-8 flex flex-col items-center justify-center bg-white text-slate-900 space-y-6">
          <div className="relative group cursor-pointer">
            {/* The Real QR Code */}
            <div className="p-2 border-4 border-slate-900 rounded-xl">
              <QRCode
                value={booking.bookingReference}
                size={180}
                level="H" // High error correction
                className="h-auto w-full max-w-full"
              />
            </div>

            {/* Optional: Icon overlay (mimics Apple Wallet style) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <Ticket className="h-5 w-5 text-slate-900" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Scan at entry
            </p>
            <div>
              <h3 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                ADMIT {booking.ticketsCount}
              </h3>
              {/* Tier Name Display */}
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {booking.ticketTierName || 'Standard'} TICKET
              </span>
            </div>

            {/* Status Badge inside QR view */}
            {booking.status === 'CHECKED_IN' && (
              <Badge className="bg-blue-100 text-blue-600 border-blue-200 mt-2">
                ALREADY CHECKED IN
              </Badge>
            )}
          </div>
        </div>

        {/* Footer Details */}
        <div className="bg-slate-950 p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Booking Ref</span>
            <span className="font-mono text-slate-200 tracking-wider">
              {booking.bookingReference}
            </span>
          </div>

          <Separator className="bg-slate-800" />

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              <Download className="mr-2 h-4 w-4" /> Save PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
