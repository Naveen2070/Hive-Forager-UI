import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertCircle, Check, Clock, Loader2, Minus, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { useCreateBooking } from '../hooks/useCreateBooking'
import type { EventDTO, TicketTierDTO } from '@/types/event.type'
import { useAuthStore } from '@/store/auth.store'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BookingCardProps {
  event: EventDTO
}

export const BookingCard = ({ event }: BookingCardProps) => {
  const { user } = useAuthStore()
  const isOwner = user?.id === event.organizerId

  // State
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const maxTicketsPerOrder = 5

  const { mutate: bookTicket, isPending } = useCreateBooking(event.id)

  // 1. Auto-select the first available tier on load
  useEffect(() => {
    if (event.ticketTiers.length > 0 && selectedTierId === null) {
      const firstAvailable = event.ticketTiers.find(
        (t) => t.availableAllocation > 0,
      )
      if (firstAvailable) {
        setSelectedTierId(firstAvailable.id)
      }
    }
  }, [event.ticketTiers, selectedTierId])

  // 2. Derive Data
  const { selectedTier, totalPrice, isPast, isOngoing, isEventSoldOut } =
    useMemo(() => {
      const now = new Date()
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)

      // Find the actual tier object
      const tier = event.ticketTiers.find((t) => t.id === selectedTierId)

      // Calculate Price
      const price = tier ? tier.price * quantity : 0

      // Check Global Sellout (All tiers empty)
      const globalSoldOut = event.ticketTiers.every(
        (t) => t.availableAllocation === 0,
      )

      return {
        selectedTier: tier,
        totalPrice: price,
        isPast: endDate < now,
        isOngoing: startDate <= now && endDate >= now,
        isEventSoldOut: globalSoldOut,
        formattedTime: `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`,
      }
    }, [
      quantity,
      selectedTierId,
      event.startDate,
      event.endDate,
      event.ticketTiers,
    ])

  // 3. Handlers
  const handleBook = () => {
    if (!selectedTierId) return
    bookTicket({
      eventId: event.id,
      ticketTierId: selectedTierId,
      ticketsCount: quantity,
    })
  }

  const updateQuantity = (delta: number) => {
    if (!selectedTier) return
    setQuantity((prev) => {
      const next = prev + delta
      if (next < 1) return 1
      if (next > maxTicketsPerOrder) return maxTicketsPerOrder
      // Check Tier Availability
      if (next > selectedTier.availableAllocation)
        return selectedTier.availableAllocation
      return next
    })
  }

  const handleSelectTier = (tier: TicketTierDTO) => {
    if (tier.availableAllocation === 0) return
    setSelectedTierId(tier.id)
    setQuantity(1) // Reset quantity when switching tiers to be safe
  }

  return (
    <Card className="bg-slate-950 border-slate-800 shadow-xl shadow-black/40 overflow-hidden flex flex-col h-full sticky top-24">
      {/* Header: Price Display */}
      <CardHeader className="pb-4 border-b border-slate-800 bg-slate-900/30">
        <CardTitle className="flex justify-between items-center">
          <span className="text-slate-400 font-medium text-sm">
            Total Price
          </span>
          <div className="text-right">
            <span className="text-2xl font-bold text-white block">
              {totalPrice === 0 ? 'FREE' : `$${totalPrice.toFixed(2)}`}
            </span>
            {selectedTier && (
              <span className="text-xs text-slate-500 font-normal">
                {quantity} x {selectedTier.name}
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6 flex-1 flex flex-col">
        {/* 1. Ticket Tiers List */}
        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">
              Select Ticket
            </span>
            {selectedTier && (
              <Badge
                variant="outline"
                className="text-xs border-slate-700 text-slate-400"
              >
                {selectedTier.availableAllocation} left
              </Badge>
            )}
          </div>

          <ScrollArea className="h-45 pr-2">
            <div className="space-y-2">
              {event.ticketTiers.map((tier) => {
                const isSelected = selectedTierId === tier.id
                const isSoldOut = tier.availableAllocation === 0

                return (
                  <div
                    key={tier.id}
                    onClick={() => handleSelectTier(tier)}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center group',
                      isSelected
                        ? 'bg-blue-600/10 border-blue-600 ring-1 ring-blue-600'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-600',
                      isSoldOut &&
                        'opacity-50 cursor-not-allowed bg-slate-900/50',
                    )}
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {tier.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isSoldOut
                          ? 'Sold Out'
                          : `${tier.availableAllocation} remaining`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          'text-sm font-bold',
                          isSelected ? 'text-blue-400' : 'text-slate-300',
                        )}
                      >
                        {tier.price === 0 ? 'Free' : `$${tier.price}`}
                      </div>
                      {isSelected && (
                        <Check className="h-3 w-3 text-blue-500 ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <Separator className="bg-slate-800" />

        {/* 2. Quantity Selector */}
        {!isEventSoldOut && !isPast && !isOwner && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Quantity</span>
            <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1 border border-slate-800">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={() => updateQuantity(-1)}
                disabled={quantity <= 1 || !selectedTier}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-mono text-lg font-bold text-white w-6 text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-white"
                onClick={() => updateQuantity(1)}
                disabled={
                  !selectedTier ||
                  quantity >= maxTicketsPerOrder ||
                  quantity >= selectedTier.availableAllocation
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* 3. Status Messages */}
        {isEventSoldOut ? (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Event sold out.</span>
          </div>
        ) : (
          isOngoing && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2 text-emerald-400 text-sm animate-pulse">
              <Clock className="h-4 w-4" />
              <span>Happening now!</span>
            </div>
          )
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {isOwner ? (
          <Link
            to="/events/$eventId/edit"
            params={{ eventId: event.id.toString() }}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Manage Event
            </Button>
          </Link>
        ) : (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 py-6 text-lg font-semibold"
            disabled={isEventSoldOut || isPast || isPending || !selectedTier}
            onClick={handleBook}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
              </>
            ) : isEventSoldOut ? (
              'Sold Out'
            ) : isPast ? (
              'Event Ended'
            ) : !selectedTier ? (
              'Select a Ticket'
            ) : (
              `Book Ticket`
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
