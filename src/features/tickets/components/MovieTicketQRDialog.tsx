import { Download, Film, Share2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import type { MyTicketResponse } from '@/types/ticket-checkout.type'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MovieTicketQRDialogProps {
  ticket: MyTicketResponse
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const MovieTicketQRDialog = ({
  ticket,
  isOpen,
  onOpenChange,
}: MovieTicketQRDialogProps) => {
  const showtime = new Date(ticket.startTimeUtc)
  const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100 p-0 overflow-hidden gap-0 shadow-2xl">
        {/* Header Section */}
        <div className="bg-slate-900 p-6 text-center border-b border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              {ticket.movieTitle}
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1">
              {showtime.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}{' '}
              •{' '}
              {showtime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* QR Code Section */}
        <div className="p-8 flex flex-col items-center justify-center bg-white text-slate-900 space-y-6">
          <div className="relative group cursor-pointer">
            <div className="p-2 border-4 border-slate-900 rounded-xl">
              <QRCode
                value={ticket.bookingReference}
                size={180}
                level="H"
                className="h-auto w-full max-w-full"
              />
            </div>
            {/* Center Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1.5 rounded-full shadow-sm">
                <Film className="h-5 w-5 text-slate-900" />
              </div>
            </div>
          </div>

          <div className="text-center w-full space-y-4">
            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
              Scan at cinema entrance
            </p>

            <div className="bg-slate-100 rounded-lg p-3">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                {ticket.cinemaName} • {ticket.auditoriumName}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {ticket.reservedSeats.map((seat, i) => (
                  <span
                    key={i}
                    className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded"
                  >
                    {getRowLetter(seat.row)}
                    {seat.col + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div className="bg-slate-950 p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Booking Ref</span>
            <span className="font-mono text-slate-200 tracking-wider">
              {ticket.bookingReference}
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
            <Button className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
