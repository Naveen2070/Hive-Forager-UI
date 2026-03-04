import { useState } from 'react'

export interface PaymentDetails {
  cardNumber: string
  expiryDate: string
  cvc: string
  name: string
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false)

  // The universal function signature.
  // Stripe or Razorpay will eventually go inside here!
  const processPayment = async (
    details: PaymentDetails,
    _amount: number,
  ): Promise<PaymentResult> => {
    setIsProcessing(true)

    // 1. Simulate a real network request to a bank (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setIsProcessing(false)

    // 2. The Hollywood Hack Logic
    const sanitizedCard = details.cardNumber.replace(/\s+/g, '')

    // Simulate "Card Declined"
    if (sanitizedCard === '4000000000000002') {
      return { success: false, error: 'Your card was declined by the issuer.' }
    }

    // Simulate "Insufficient Funds"
    if (sanitizedCard === '4000000000000119') {
      return { success: false, error: 'Insufficient funds.' }
    }

    // Simulate "Validation Error" (Missing data)
    if (!sanitizedCard || !details.expiryDate || !details.cvc) {
      return { success: false, error: 'Please fill in all card details.' }
    }

    // 3. Default Success (Simulates 4242 4242 4242 4242 or any valid input)
    return {
      success: true,
      transactionId: `mock_txn_${Math.random().toString(36).substring(2, 15)}`,
    }
  }

  return { processPayment, isProcessing }
}
