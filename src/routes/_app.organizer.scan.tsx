import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'
import { CalendarDays, Film } from 'lucide-react'
import { motion } from 'framer-motion'

import type { ScanResultData } from '@/types/booking.type.ts'
import { useCheckIn } from '@/features/organizer/hooks/useCheckIn'
import { useCheckInTicket } from '@/features/tickets/hooks/useTickets'

import { ScannerOverlay } from '@/features/organizer/components/ScannerOverlay'
import { ScanResultOverlay } from '@/features/organizer/components/ScanResultOverlay'
import { ScannerControls } from '@/features/organizer/components/ScannerControls'
import { ScanStatus } from '@/types/enum.ts'

export const Route = createFileRoute('/_app/organizer/scan')({
  component: ScannerPage,
})

export function ScannerPage() {
  // Track whether we are scanning Events or Movies
  const [scanMode, setScanMode] = useState<'EVENTS' | 'MOVIES'>('EVENTS')

  const [isPaused, setIsPaused] = useState(false)
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.IDLE)
  const [resultData, setResultData] = useState<ScanResultData | undefined>(
    undefined,
  )

  // API Hooks
  const { mutate: checkInEvent, reset: resetEventMutation } = useCheckIn()
  const { mutate: checkInMovie, reset: resetMovieMutation } = useCheckInTicket()

  // Reset scanner if usher switches tabs
  useEffect(() => {
    handleReset()
  }, [scanMode])

  const handleScan = (detectedCodes: Array<any>) => {
    if (detectedCodes.length === 0 || isPaused) return
    const rawValue = detectedCodes[0].rawValue
    if (!rawValue) return

    setIsPaused(true)
    setScanStatus(ScanStatus.PENDING)

    // Shared response handler to keep things DRY
    const handleSuccess = (data: any) => {
      switch (data.status) {
        case 'CHECKED_IN':
          setScanStatus(ScanStatus.SUCCESS)
          setResultData({
            attendeeName: data.attendeeName || 'Guest',
            ticketTier: data.ticketTierName || 'Standard Entry',
          })
          break
        case 'ALREADY_CHECKED_IN':
          setScanStatus(ScanStatus.ALREADY_SCANNED)
          setResultData({
            attendeeName: data.attendeeName,
            message: data.message || 'Ticket already scanned',
          })
          break
        default:
          setScanStatus(ScanStatus.ERROR)
          setResultData({
            message: data.message || 'Check-in Denied',
            attendeeName: data.attendeeName,
          })
      }
    }

    const handleError = (error: any) => {
      setScanStatus(ScanStatus.ERROR)
      setResultData({
        message: error.response?.data?.message || 'Network Error',
      })
    }

    // Route to the correct API!
    if (scanMode === 'EVENTS') {
      checkInEvent(rawValue, { onSuccess: handleSuccess, onError: handleError })
    } else {
      checkInMovie(rawValue, { onSuccess: handleSuccess, onError: handleError })
    }
  }

  const handleReset = () => {
    setScanStatus(ScanStatus.IDLE)
    setResultData(undefined)
    resetEventMutation()
    resetMovieMutation()
    setTimeout(() => setIsPaused(false), 300)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      {/* Header & Toggle Section */}
      <div className="text-center space-y-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-white">Ticket Scanner</h1>
          <p className="text-slate-400 text-sm">
            Select mode and point camera at QR code
          </p>
        </div>

        {/* Sleek Mode Toggle */}
        <div className="bg-slate-900 p-1 rounded-full flex relative w-full shadow-inner border border-slate-800 mx-auto max-w-70">
          <motion.div
            className="absolute top-1 bottom-1 rounded-full shadow-lg z-0"
            initial={false}
            animate={{
              x: scanMode === 'EVENTS' ? 0 : '100%',
              width: '50%',
              backgroundColor: scanMode === 'EVENTS' ? '#2563eb' : '#eab308',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setScanMode('EVENTS')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors text-center rounded-full ${scanMode === 'EVENTS' ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <CalendarDays className="h-4 w-4" /> Events
          </button>
          <button
            onClick={() => setScanMode('MOVIES')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors text-center rounded-full ${scanMode === 'MOVIES' ? 'text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Film className="h-4 w-4" /> Movies
          </button>
        </div>
      </div>

      {/* Scanner Window */}
      <div
        className={`relative w-full aspect-square bg-black rounded-3xl overflow-hidden border-2 shadow-2xl transition-colors duration-300 ${scanMode === 'EVENTS' ? 'border-blue-900/50 shadow-blue-900/20' : 'border-yellow-900/50 shadow-yellow-900/20'}`}
      >
        <Scanner
          onScan={handleScan}
          paused={isPaused}
          components={{ finder: false }}
          styles={{ container: { width: '100%', height: '100%' } }}
        />

        {/* Pass the mode color to the overlay */}
        <ScannerOverlay
          isScanning={!isPaused && scanStatus === ScanStatus.IDLE}
          colorMode={scanMode}
        />

        <ScanResultOverlay
          status={scanStatus}
          data={resultData}
          onReset={handleReset}
        />
      </div>

      <ScannerControls onReset={handleReset} isReady={!isPaused} />
    </div>
  )
}
