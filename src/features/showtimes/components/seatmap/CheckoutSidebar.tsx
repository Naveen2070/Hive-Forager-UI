import { useState } from 'react'
import { ChevronLeft, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SeatCoordinateDTO, SeatTierDTO } from '@/types/seating.types.ts'
import {
  type PaymentDetails,
  usePayment,
} from '@/features/checkout/hooks/usePayment.ts'
import { PaymentForm } from '@/features/checkout/components/PaymentForm.tsx'

interface CheckoutSidebarProps {
  movieTitle: string
  cinemaName: string
  auditoriumName: string
  basePrice: number
  tiers: SeatTierDTO[]
  selectedSeats: SeatCoordinateDTO[]
  onCheckout: () => void
  isPending: boolean
}

export const CheckoutSidebar = ({
  movieTitle,
  cinemaName,
  auditoriumName,
  basePrice,
  tiers,
  selectedSeats,
  onCheckout,
  isPending,
}: CheckoutSidebarProps) => {
  const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex)

  // Payment State
  const [showPayment, setShowPayment] = useState(false)
  const { processPayment, isProcessing } = usePayment()
  const [paymentError, setPaymentError] = useState<string>()

  // Calculate the detailed pricing
  const calculateTotals = () => {
    let subtotal = 0
    let surchargeTotal = 0

    selectedSeats.forEach((seat) => {
      subtotal += basePrice
      const tier = tiers?.find((t) =>
        t.seats.some((s: any) => s.row === seat.row && s.col === seat.col),
      )
      if (tier) {
        surchargeTotal += tier.priceSurcharge
      }
    })

    return { subtotal, surchargeTotal, grandTotal: subtotal + surchargeTotal }
  }

  const { subtotal, surchargeTotal, grandTotal } = calculateTotals()

  const handlePaymentSubmit = async (details: PaymentDetails) => {
    setPaymentError(undefined)

    // 1. Process the mock payment (or real Stripe/Razorpay later)
    const result = await processPayment(details, grandTotal)

    if (!result.success) {
      // 2. Failed! Show error
      setPaymentError(result.error)
      return
    }

    // 3. Success! Generate the actual ticket in the .NET backend
    onCheckout()
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sticky top-24 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* STEP 1: ORDER SUMMARY */}
      {!showPayment ? (
        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
          <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6 border-b border-slate-800 pb-6">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">
                Movie
              </p>
              <p className="text-base text-slate-200">{movieTitle}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">
                Cinema
              </p>
              <p className="text-base text-slate-200">
                {cinemaName} - {auditoriumName}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-3">
              Selected Seats ({selectedSeats.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.length === 0 && (
                <span className="text-sm text-slate-500 italic">
                  No seats selected
                </span>
              )}
              {selectedSeats.map((seat) => (
                <div
                  key={`${seat.row}-${seat.col}`}
                  className="bg-slate-800 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-md"
                >
                  {getRowLetter(seat.row)}
                  {seat.col + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3 pt-4 border-t border-slate-800 mb-6 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>
                Tickets ({selectedSeats.length} × ${basePrice.toFixed(2)})
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {surchargeTotal > 0 && (
              <div className="flex justify-between text-fuchsia-400">
                <span>VIP Surcharges</span>
                <span>+${surchargeTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-end justify-between pt-4 border-t border-slate-800 border-dashed">
              <span className="text-slate-200 font-medium">Total</span>
              <span className="text-3xl font-extrabold text-white">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => setShowPayment(true)}
            disabled={selectedSeats.length === 0}
            className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-lg rounded-xl transition-all"
          >
            <Ticket className="mr-2 h-6 w-6" /> Proceed to Payment
          </Button>
        </div>
      ) : (
        /* STEP 2: PAYMENT FORM */
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
              onClick={() => setShowPayment(false)}
              disabled={isProcessing || isPending}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold text-white">Payment</h2>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-slate-800 flex justify-between items-center">
            <span className="text-sm text-slate-400">Amount Due</span>
            <span className="text-2xl font-black text-white">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Render the Plug-and-Play Adapter Form */}
          <PaymentForm
            amount={grandTotal}
            // Block UI while fake payment runs OR while real backend ticket creates
            isProcessing={isProcessing || isPending}
            onSubmit={handlePaymentSubmit}
            error={paymentError}
          />
        </div>
      )}
    </div>
  )
}
