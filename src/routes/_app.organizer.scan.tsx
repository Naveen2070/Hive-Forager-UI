import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner'

import type { ScanResultData } from '@/types/booking.type.ts'
import { useCheckIn } from '@/features/organizer/hooks/useCheckIn'
import { ScannerOverlay } from '@/features/organizer/components/ScannerOverlay'
import { ScanResultOverlay } from '@/features/organizer/components/ScanResultOverlay'
import { ScannerControls } from '@/features/organizer/components/ScannerControls'
import { ScanStatus } from '@/types/enum.ts'

export const Route = createFileRoute('/_app/organizer/scan')({
  component: ScannerPage,
})

function ScannerPage() {
  const [isPaused, setIsPaused] = useState(false)
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.IDLE)
  const [resultData, setResultData] = useState<ScanResultData | undefined>(
    undefined,
  )

  const { mutate: checkIn, reset: resetMutation } = useCheckIn()

  const handleScan = (detectedCodes: Array<any>) => {
    if (detectedCodes.length === 0 || isPaused) return
    const rawValue = detectedCodes[0].rawValue
    if (!rawValue) return

    // 1. Pause immediately
    setIsPaused(true)
    setScanStatus(ScanStatus.PENDING)

    // 2. Trigger Mutation
    checkIn(rawValue, {
      onSuccess: (data) => {
        switch (data.status) {
          case 'CHECKED_IN':
            setScanStatus(ScanStatus.SUCCESS)
            setResultData({
              attendeeName: data.attendeeName || 'Guest',
              ticketTier: data.ticketTierName || 'Standard',
            })
            break

          case 'ALREADY_CHECKED_IN':
            setScanStatus(ScanStatus.ALREADY_SCANNED)
            setResultData({
              attendeeName: data.attendeeName,
              message: data.message || 'Ticket already scanned',
            })
            break

          case 'EXPIRED':
          case 'WRONG_DATE':
          case 'INVALID_STATUS':
          case 'NOT_AUTHORIZED':
          case 'NOT_FOUND':
            setScanStatus(ScanStatus.ERROR)
            setResultData({
              message: data.message || 'Check-in Denied',
              attendeeName: data.attendeeName,
            })
            break

          default:
            setScanStatus(ScanStatus.ERROR)
            setResultData({ message: data.message || 'Unknown Status' })
        }
      },
      onError: (error: any) => {
        setScanStatus(ScanStatus.ERROR)
        setResultData({
          message: error.response?.data?.message || 'Network Error',
        })
      },
    })
  }

  const handleReset = () => {
    setScanStatus(ScanStatus.IDLE)
    setResultData(undefined)
    resetMutation()
    // Small delay prevents accidental double-scan immediately
    setTimeout(() => setIsPaused(false), 300)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white">Ticket Scanner</h1>
        <p className="text-slate-400">Point camera at attendee's QR code</p>
      </div>

      <div className="relative w-full aspect-square bg-black rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl">
        <Scanner
          onScan={handleScan}
          paused={isPaused}
          components={{ finder: false }}
          styles={{ container: { width: '100%', height: '100%' } }}
        />

        {/* Use Enum for IDLE check */}
        <ScannerOverlay
          isScanning={!isPaused && scanStatus === ScanStatus.IDLE}
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
