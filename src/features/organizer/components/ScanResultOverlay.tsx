import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Ticket,
  XCircle,
} from 'lucide-react'
import type { ScanResultOverlayProps } from '@/types/booking.type.ts'
import { Badge } from '@/components/ui/badge'
import { ScanStatus } from '@/types/enum.ts'

export const ScanResultOverlay = ({
  status,
  data,
  onReset,
}: ScanResultOverlayProps) => {
  if (status === ScanStatus.IDLE) return null

  // Auto-reset handler overlay click
  const handleOverlayClick = () => {
    if (status !== ScanStatus.PENDING) onReset()
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 backdrop-blur-md animate-in fade-in duration-200 p-6 text-center cursor-pointer"
    >
      {/* 1. LOADING STATE */}
      {status === ScanStatus.PENDING && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
          <p className="text-slate-300 font-medium animate-pulse">
            Verifying Ticket...
          </p>
        </div>
      )}

      {/* 2. ERROR / DENIED STATE */}
      {status === ScanStatus.ERROR && (
        <div className="space-y-4 max-w-xs">
          <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/50 shadow-lg shadow-red-900/20">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-500 mb-1">
              Access Denied
            </h3>
            <p className="text-slate-300 text-lg">
              {data?.message || 'Invalid Ticket'}
            </p>
          </div>
          {data?.referenceId && (
            <Badge
              variant="outline"
              className="border-red-800 text-red-400 font-mono"
            >
              {data.referenceId}
            </Badge>
          )}
          <p className="text-xs text-slate-500 pt-8 animate-pulse">
            Tap anywhere to scan next
          </p>
        </div>
      )}

      {/* 3. ALREADY CHECKED IN (Warning) */}
      {status === ScanStatus.ALREADY_SCANNED && (
        <div className="space-y-4 max-w-xs">
          <div className="h-24 w-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500/50 shadow-lg shadow-amber-900/20">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-amber-500 mb-1">
              Already Checked In
            </h3>
            <p className="text-slate-300">
              This ticket was scanned previously.
            </p>
          </div>
          {data?.attendeeName && (
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-500 uppercase font-bold">
                Attendee
              </p>
              <p className="text-white font-medium">{data.attendeeName}</p>
            </div>
          )}
          <p className="text-xs text-slate-500 pt-8 animate-pulse">
            Tap anywhere to scan next
          </p>
        </div>
      )}

      {/* 4. SUCCESS STATE */}
      {status === ScanStatus.SUCCESS && (
        <div className="space-y-6 max-w-xs w-full">
          <div className="h-28 w-28 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce-short">
            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-black text-white tracking-tight">
              Welcome!
            </h3>
            <p className="text-emerald-400 font-medium text-lg">
              Access Granted
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3 text-left shadow-xl">
            <div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Attendee
              </span>
              <p className="text-white text-xl font-semibold truncate">
                {data?.attendeeName || 'Guest'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Ticket className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Ticket Type
                </span>
                <p className="text-blue-300 font-medium">
                  {data?.ticketTier || 'General Admission'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 pt-4 animate-pulse">
            Tap screen to scan next ticket
          </p>
        </div>
      )}
    </div>
  )
}
