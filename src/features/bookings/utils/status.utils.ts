import {
  Ban,
  CheckCircle2,
  Clock,
  RefreshCcw,
  ScanLine,
  XCircle,
} from 'lucide-react'
import { BookingStatus } from '@/types/enum'

export const getBookingStatusStyles = (status: string) => {
  switch (status) {
    case BookingStatus.CHECKED_IN:
      return {
        border: 'border-l-blue-500',
        badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: ScanLine,
        label: 'Checked In',
        glow: 'group-hover:shadow-[0_0_20px_-10px_rgba(59,130,246,0.3)]',
      }

    case BookingStatus.CONFIRMED:
      return {
        border: 'border-l-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: CheckCircle2,
        label: 'Confirmed',
        glow: 'group-hover:shadow-[0_0_20px_-10px_rgba(16,185,129,0.3)]',
      }

    case BookingStatus.PENDING:
      return {
        border: 'border-l-amber-500',
        badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: Clock,
        label: 'Payment Pending',
        glow: 'group-hover:shadow-[0_0_20px_-10px_rgba(245,158,11,0.3)]',
      }

    case BookingStatus.REFUNDED:
      return {
        border: 'border-l-purple-500',
        badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        icon: RefreshCcw,
        label: 'Refunded',
        glow: 'group-hover:shadow-none',
      }

    case BookingStatus.EXPIRED:
      return {
        border: 'border-l-slate-500',
        badge: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        icon: XCircle,
        label: 'Expired',
        glow: 'group-hover:shadow-none',
      }

    case BookingStatus.CANCELLED:
    default:
      return {
        border: 'border-l-red-500',
        badge: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: Ban,
        label: 'Cancelled',
        glow: 'group-hover:shadow-none',
      }
  }
}
