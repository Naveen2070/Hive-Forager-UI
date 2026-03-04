import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Receipt,
  XCircle,
} from 'lucide-react'
import type { MyTicketResponse } from '@/types/ticket-checkout.type'
import { TicketStatus } from '@/types/enum'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface MovieReceiptDialogProps {
  ticket: MyTicketResponse
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const MovieReceiptDialog = ({
  ticket,
  isOpen,
  onOpenChange,
}: MovieReceiptDialogProps) => {
  const unitPrice = ticket.totalAmount / ticket.reservedSeats.length
  const showtime = new Date(ticket.startTimeUtc)

  const getStatusConfig = (status: TicketStatus | string) => {
    switch (status) {
      case TicketStatus.PAID:
        return {
          icon: CheckCircle2,
          label: 'Payment Successful',
          className: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        }
      case TicketStatus.PENDING:
        return {
          icon: Clock,
          label: 'Payment Pending',
          className: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        }
      case TicketStatus.CANCELLED:
        return {
          icon: XCircle,
          label: 'Ticket Cancelled',
          className: 'bg-red-500/10 border-red-500/20 text-red-500',
        }
      default:
        return {
          icon: AlertCircle,
          label: status,
          className: 'bg-slate-800 border-slate-700 text-slate-400',
        }
    }
  }

  const statusConfig = getStatusConfig(ticket.status)
  const StatusIcon = statusConfig.icon

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-500">
              <Receipt className="h-4 w-4" />
            </div>
            <DialogTitle>Movie Receipt</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Reference #{ticket.bookingReference}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dynamic Status Banner */}
          <div
            className={`border rounded-lg p-3 flex items-center gap-3 ${statusConfig.className}`}
          >
            <StatusIcon className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">{statusConfig.label}</p>
              <p className="text-xs opacity-70">
                Processed on{' '}
                {new Date(ticket.createdAtUtc).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-1">
            <h4 className="font-semibold text-white">{ticket.movieTitle}</h4>
            <p className="text-sm text-slate-400">
              {showtime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}{' '}
              at{' '}
              {showtime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
            </p>
            <p className="text-sm text-slate-400">
              {ticket.cinemaName} • {ticket.auditoriumName}
            </p>
          </div>

          <Separator className="bg-slate-800 border-dashed" />

          {/* Line Items */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Seats (x{ticket.reservedSeats.length})</span>
              <span>${ticket.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Avg Unit Price</span>
              <span>${unitPrice.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-white">Total Paid</span>
            <span className="text-xl font-bold text-white">
              ${ticket.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-slate-800 hover:bg-slate-900 text-slate-300"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
