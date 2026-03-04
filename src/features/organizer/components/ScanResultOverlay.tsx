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

  const handleOverlayClick = () => {
    if (status !== ScanStatus.PENDING) onReset()
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-20 backdrop-blur-xl animate-in fade-in duration-200 p-4 text-center cursor-pointer overflow-hidden"
    >
      {/* 1. LOADING STATE */}
      {status === ScanStatus.PENDING && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 text-slate-400 animate-spin" />
          <p className="text-slate-300 font-medium animate-pulse tracking-wide text-sm">
            Verifying...
          </p>
        </div>
      )}

      {/* 2. ERROR / DENIED STATE */}
      {status === ScanStatus.ERROR && (
        <div className="space-y-4 max-w-xs w-full animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center h-full">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] shrink-0">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Denied
            </h3>
            <p className="text-red-400 font-medium text-sm">
              {data?.message || 'Invalid Ticket'}
            </p>
          </div>
          {data?.referenceId && (
            <Badge
              variant="outline"
              className="border-red-500/30 text-red-400 font-mono bg-red-500/10 py-1 px-3 text-xs"
            >
              {data.referenceId}
            </Badge>
          )}
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-auto pt-2">
            Tap anywhere to dismiss
          </p>
        </div>
      )}

      {/* 3. ALREADY CHECKED IN (Warning) */}
      {status === ScanStatus.ALREADY_SCANNED && (
        <div className="space-y-4 max-w-xs w-full animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center h-full">
          <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)] shrink-0">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white tracking-tight">
              Already Scanned
            </h3>
            <p className="text-amber-400 font-medium text-xs">
              This ticket was scanned previously.
            </p>
          </div>
          {data?.attendeeName && (
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 shadow-xl w-full">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
                Registered To
              </p>
              <p className="text-white font-medium">{data.attendeeName}</p>
            </div>
          )}
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-auto pt-2">
            Tap anywhere to dismiss
          </p>
        </div>
      )}

      {/* 4. SUCCESS STATE */}
      {status === ScanStatus.SUCCESS && (
        <div className="space-y-4 max-w-xs w-full animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center h-full">
          <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)] shrink-0">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>

          <div className="space-y-0.5">
            <h3 className="text-2xl font-black text-white tracking-tight">
              Welcome
            </h3>
            <p className="text-emerald-400 font-bold tracking-widest uppercase text-[10px]">
              Access Granted
            </p>
          </div>

          {/* Sleek Attendee Card */}
          <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 text-left shadow-xl w-full">
            <div className="mb-3">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">
                Attendee
              </span>
              <p className="text-white text-lg font-bold truncate leading-none">
                {data?.attendeeName || 'Guest'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Ticket className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">
                  Ticket Type
                </p>
                <p className="text-slate-300 font-medium text-xs truncate leading-none">
                  {data?.ticketTier || 'General Admission'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold animate-pulse mt-auto pt-2">
            Tap screen to continue
          </p>
        </div>
      )}
    </div>
  )
}
