import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ticketsApi } from '@/api/tickets'
import { ticketKeys } from '../tickets.keys'
import { showtimeKeys } from '@/features/showtimes/showtimes.keys'
import type { ReserveTicketRequest } from '@/types/ticket-checkout.type'

export const useMyTickets = () => {
  return useQuery({
    queryKey: ticketKeys.mine(),
    queryFn: ticketsApi.getMyTickets,
  })
}

export const useReserveTickets = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReserveTicketRequest) => ticketsApi.reserveTickets(data),
    onSuccess: async (_, variables) => {
      // Invalidate the seat map so other users immediately see these seats as reserved/sold
      await queryClient.invalidateQueries({
        queryKey: showtimeKeys.seatMap(variables.showtimeId),
      })
      // Invalidate the user's wallet
      await queryClient.invalidateQueries({ queryKey: ticketKeys.mine() })
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        toast.error(
          'Oh no! Those seats were just taken. Please select different seats.',
        )
      } else {
        toast.error(
          error.response?.data?.message || 'Failed to reserve tickets.',
        )
      }
    },
  })
}
