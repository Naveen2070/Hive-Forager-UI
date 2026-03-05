import type {
  MyTicketResponse,
  PaymentWebhookPayload,
  ReserveTicketRequest,
  TicketCheckoutResponse,
} from '@/types/ticket-checkout.type'
import { api } from '@/api/axios.ts'

const isMock = import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true'

export const ticketsApi = {
  reserveTickets: async (
    payload: ReserveTicketRequest,
  ): Promise<TicketCheckoutResponse> => {
    if (isMock) {
      const { MOCK_CHECKOUT_RESPONSE } =
        await import('@/api/mocks/tickets.mock')
      return MOCK_CHECKOUT_RESPONSE
    }
    const { data } = await api.post<TicketCheckoutResponse>(
      '/tickets/reserve',
      payload,
    )
    return data
  },

  checkIn: async (reference: string) => {
    if (isMock) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simulate a successful scan for our mock Spider-Man ticket
      if (reference === 'HIVE-A9B8C7') {
        return {
          status: 'ALREADY_CHECKED_IN',
          message: 'This ticket has already been scanned.',
          attendeeName: 'Guest',
        }
      }

      // Default mock success
      return {
        status: 'CHECKED_IN',
        message: 'Ticket verified successfully.',
        attendeeName: 'Guest',
        ticketTierName: 'VIP Seats (Row F)',
      }
    }
    const { data } = await api.post('/tickets/check-in', {
      bookingReference: reference,
    })
    return data
  },

  getMyTickets: async (): Promise<MyTicketResponse[]> => {
    if (isMock) {
      const { MOCK_MY_TICKETS } = await import('@/api/mocks/tickets.mock')
      return MOCK_MY_TICKETS
    }
    const { data } = await api.get<MyTicketResponse[]>('/tickets/my-bookings')
    return data
  },
  confirmPaymentWebhook: async (
    payload: PaymentWebhookPayload,
  ): Promise<void> => {
    await api.post('/tickets/payment/success', payload)
  },
}
