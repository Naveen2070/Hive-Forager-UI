import { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PaymentDetails } from '../hooks/usePayment'

interface PaymentFormProps {
  amount: number
  isProcessing: boolean
  onSubmit: (details: PaymentDetails) => void
  error?: string
}

export const PaymentForm = ({
  amount,
  isProcessing,
  onSubmit,
  error,
}: PaymentFormProps) => {
  const [details, setDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
  })

  // Format card number with spaces (e.g., 4242 4242...)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(.{4})/g, '$1 ').trim()
    setDetails({ ...details, cardNumber: value.slice(0, 19) })
  }

  // Format expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }
    setDetails({ ...details, expiryDate: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 text-slate-300">
        <Lock className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-medium uppercase tracking-wider">
          Secure Checkout
        </span>
      </div>

      <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        {/* Card Number */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-medium">
            Card Information
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={details.cardNumber}
              onChange={handleCardNumberChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
            />
          </div>
        </div>

        {/* Expiry and CVC Row */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="MM / YY"
            value={details.expiryDate}
            onChange={handleExpiryChange}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
          <input
            type="password"
            placeholder="CVC"
            maxLength={4}
            value={details.cvc}
            onChange={(e) =>
              setDetails({ ...details, cvc: e.target.value.replace(/\D/g, '') })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
          />
        </div>

        {/* Name on Card */}
        <input
          type="text"
          placeholder="Name on card"
          value={details.name}
          onChange={(e) => setDetails({ ...details, name: e.target.value })}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-in fade-in">
          {error}
        </div>
      )}

      <Button
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 shadow-lg shadow-blue-900/20"
        disabled={isProcessing}
        onClick={() => onSubmit(details)}
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </div>
  )
}
