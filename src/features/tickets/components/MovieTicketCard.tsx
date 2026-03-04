import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Film, MapPin, QrCode, Receipt } from 'lucide-react'
import type { MyTicketResponse } from '@/types/ticket-checkout.type'
import { TicketStatus } from '@/types/enum'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import { MovieTicketQRDialog } from './MovieTicketQRDialog'
import { MovieReceiptDialog } from './MovieReceiptDialog'

// Import the new Shared Engine
import {
  Ticket,
  TicketActions,
  TicketContent,
  TicketDateBlock,
  TicketStamp,
} from '@/components/shared/TicketLayout'

interface MovieTicketCardProps {
  ticket: MyTicketResponse & {
    movieId?: string
    cinemaId?: string
    showtimeId?: string
  }
}

export const MovieTicketCard = ({ ticket }: MovieTicketCardProps) => {
  const [showQR, setShowQR] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  const showtime = new Date(ticket.startTimeUtc)
  const endTime = new Date(showtime.getTime() + 3 * 60 * 60 * 1000)
  const isPast = new Date() > endTime
  const isPending = ticket.status === TicketStatus.PENDING
  const getRowLetter = (rowIndex: number) => String.fromCharCode(65 + rowIndex)

  let stampText = 'COMPLETED'
  let stampColor = 'border-emerald-500 text-emerald-500'

  if (ticket.status === TicketStatus.CANCELLED) {
    stampText = 'CANCELLED'
    stampColor = 'border-red-500 text-red-500'
  }

  return (
    <>
      <Ticket isPast={isPast} accent="yellow">
        {isPast && <TicketStamp text={stampText} colorClass={stampColor} />}

        <TicketDateBlock>
          <p className="text-yellow-500 font-bold text-sm uppercase tracking-wider mb-1">
            {showtime.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {ticket.showtimeId && !isPast ? (
            <Link
              to="/checkout/$showtimeId"
              params={{ showtimeId: ticket.showtimeId }}
              className="hover:text-yellow-400 transition-colors"
            >
              <p className="text-2xl font-extrabold text-white hover:text-yellow-400 transition-colors">
                {showtime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZone: 'UTC',
                })}
              </p>
            </Link>
          ) : (
            <p className="text-2xl font-extrabold text-white">
              {showtime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
            </p>
          )}
        </TicketDateBlock>

        {isPast ? (
          /* PAST VIEW (Flattened Grid) */
          <TicketContent>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-200 text-lg group-hover:text-yellow-400 transition-colors line-clamp-1">
                  {ticket.movieTitle}
                </h4>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="h-3 w-3" /> {ticket.cinemaName} •{' '}
                  {ticket.auditoriumName}
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-500 uppercase"
              >
                Completed
              </Badge>
            </div>

            <Separator className="bg-slate-800/50 my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm items-center">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold">
                  Seats
                </span>
                <p className="text-slate-300 font-medium truncate">
                  {ticket.reservedSeats
                    .map((s) => `${getRowLetter(s.row)}${s.col + 1}`)
                    .join(', ')}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold">
                  Qty
                </span>
                <p className="text-slate-300 font-medium">
                  {ticket.reservedSeats.length}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold">
                  Total
                </span>
                <p className="text-white font-bold">
                  ${ticket.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-end gap-2 items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-white backdrop-blur-sm bg-slate-900/50"
                  onClick={() => setShowReceipt(true)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
                {ticket.movieId && (
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: ticket.movieId }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-500 hover:text-yellow-400 backdrop-blur-sm bg-slate-900/50"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </TicketContent>
        ) : (
          /* UPCOMING VIEW (Expanded Data & Actions) */
          <>
            <TicketContent>
              <div className="flex justify-between items-start mb-2">
                {ticket.movieId ? (
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: ticket.movieId }}
                    className="hover:underline decoration-yellow-500 underline-offset-4"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-slate-100 group-hover:text-yellow-400 transition-colors">
                      {ticket.movieTitle}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-xl md:text-2xl font-bold text-slate-100 line-clamp-1">
                    {ticket.movieTitle}
                  </h3>
                )}
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isPending ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="space-y-1 mt-1 text-sm text-slate-400">
                <p className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-2 shrink-0" />
                  {ticket.cinemaId ? (
                    <Link
                      to="/cinemas/$cinemaId"
                      params={{ cinemaId: ticket.cinemaId }}
                      className="hover:text-yellow-400 transition-colors hover:underline underline-offset-4"
                    >
                      {ticket.cinemaName}
                    </Link>
                  ) : (
                    <span>{ticket.cinemaName}</span>
                  )}
                </p>
                <p className="flex items-center">
                  <Film className="h-3.5 w-3.5 mr-2 shrink-0" />{' '}
                  {ticket.auditoriumName}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 uppercase mr-2">
                  Seats:
                </span>
                {ticket.reservedSeats.map((seat, i) => (
                  <span
                    key={i}
                    className="bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-1 rounded"
                  >
                    {getRowLetter(seat.row)}
                    {seat.col + 1}
                  </span>
                ))}
              </div>
            </TicketContent>

            <TicketActions>
              <div className="flex justify-between md:flex-col md:gap-1 text-right md:text-left">
                <div>
                  <span className="text-xs text-slate-500 uppercase font-semibold">
                    Total Paid
                  </span>
                  <div className="text-xl font-bold text-white">
                    ${ticket.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  REF: {ticket.bookingReference}
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-2">
                {isPending ? (
                  <Button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold">
                    Pay Now <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setShowQR(true)}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold shadow-lg shadow-yellow-900/10"
                    >
                      <QrCode className="h-4 w-4 mr-2" /> View Ticket
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowReceipt(true)}
                      className="w-full text-slate-400 hover:text-white hover:bg-slate-800 h-8 text-xs"
                    >
                      <Receipt className="h-3 w-3 mr-2" /> Receipt
                    </Button>
                  </>
                )}
              </div>
            </TicketActions>
          </>
        )}
      </Ticket>

      <MovieTicketQRDialog
        ticket={ticket}
        isOpen={showQR}
        onOpenChange={setShowQR}
      />
      <MovieReceiptDialog
        ticket={ticket}
        isOpen={showReceipt}
        onOpenChange={setShowReceipt}
      />
    </>
  )
}
