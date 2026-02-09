import { format } from 'date-fns'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Receipt,
  RefreshCcw,
  XCircle,
} from 'lucide-react'
import type { BookingDTO } from '@/types/booking.type'
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

interface ReceiptDialogProps {
  booking: BookingDTO
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const ReceiptDialog = ({
  booking,
  isOpen,
  onOpenChange,
}: ReceiptDialogProps) => {
  const unitPrice = booking.totalPrice / booking.ticketsCount

  // Helper to determine status styling and text
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'CHECKED_IN':
        return {
          icon: CheckCircle2,
          label: 'Payment Successful',
          className: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
        }
      case 'PENDING_PAYMENT':
        return {
          icon: Clock,
          label: 'Payment Pending',
          className: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        }
      case 'CANCELLED':
        return {
          icon: XCircle,
          label: 'Booking Cancelled',
          className: 'bg-red-500/10 border-red-500/20 text-red-500',
        }
      case 'REFUNDED':
        return {
          icon: RefreshCcw,
          label: 'Payment Refunded',
          className: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
        }
      case 'EXPIRED':
        return {
          icon: AlertCircle,
          label: 'Ticket Expired',
          className: 'bg-slate-800 border-slate-700 text-slate-400',
        }
      default:
        return {
          icon: AlertCircle,
          label: status,
          className: 'bg-slate-800 border-slate-700 text-slate-400',
        }
    }
  }

  const statusConfig = getStatusConfig(booking.status)
  const StatusIcon = statusConfig.icon

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
              <Receipt className="h-4 w-4" />
            </div>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            Reference #{booking.bookingReference}
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
                {booking.bookedAt
                  ? format(new Date(booking.bookedAt), 'PPP p')
                  : format(new Date(), 'PPP p')}
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-1">
            <h4 className="font-semibold text-white">{booking.eventTitle}</h4>
            <p className="text-sm text-slate-400">
              {format(new Date(booking.eventDate), 'PPP')} at{' '}
              {format(new Date(booking.eventDate), 'p')}
            </p>
            <p className="text-sm text-slate-400">{booking.eventLocation}</p>
          </div>

          <Separator className="bg-slate-800 border-dashed" />

          {/* Line Items */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              {/* Dynamic Ticket Tier Name */}
              <span>
                {booking.ticketTierName || 'Ticket'} (x{booking.ticketsCount})
              </span>
              <span>${booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Unit Price</span>
              <span>${unitPrice.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="bg-slate-800" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-white">Total Paid</span>
            <span className="text-xl font-bold text-white">
              ${booking.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none border-slate-800 hover:bg-slate-900 text-slate-300"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white">
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
