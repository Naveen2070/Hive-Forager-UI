import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface TicketProps {
  children: ReactNode
  isPast?: boolean
  accent?: 'blue' | 'yellow'
}

export const Ticket = ({ children, isPast, accent = 'blue' }: TicketProps) => {
  const hoverAccent =
    accent === 'blue'
      ? 'hover:border-blue-500/50 hover:shadow-blue-900/20'
      : 'hover:border-yellow-500/50 hover:shadow-yellow-900/20'

  return (
    <div
      className={cn(
        'bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row relative group transition-all duration-300',
        isPast
          ? 'bg-slate-900/40 opacity-90 hover:border-slate-700'
          : `hover:-translate-y-1 hover:shadow-2xl ${hoverAccent}`,
      )}
    >
      {children}
    </div>
  )
}

export const TicketStamp = ({
  text,
  colorClass,
}: {
  text: string
  colorClass: string
}) => (
  <div className="absolute right-16 md:right-30 top-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-60 md:opacity-80 select-none flex items-center justify-center transform -rotate-15">
    {/* Outer Ring */}
    <div
      className={cn(
        'w-20 h-20 md:w-23 md:h-23 rounded-full border-2 md:border-[3px] flex items-center justify-center relative',
        colorClass,
      )}
    >
      {/* Inner Ring */}
      <div
        className={cn(
          'absolute inset-1 md:inset-1.5 rounded-full border md:border-2',
          colorClass,
        )}
      />

      {/* Text Mask (Uses bg-slate-900 to 'cut' the circle lines behind the text) */}
      <div
        className={cn(
          'absolute px-1.5 md:px-2 font-black text-[9px] md:text-sm tracking-[0.15em] uppercase text-center bg-slate-900 rounded-sm',
          colorClass,
        )}
      >
        {text}
      </div>
    </div>
  </div>
)

export const TicketDateBlock = ({ children }: { children: ReactNode }) => (
  <div className="bg-slate-950 md:w-48 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center border-b md:border-b-0 md:border-r border-slate-800 border-dashed relative shrink-0 z-20">
    <div className="text-center w-full">{children}</div>
    {/* Decorative Ticket Notches */}
    <div className="hidden md:block absolute -right-3 -top-3 h-6 w-6 bg-slate-950 rounded-full border-b border-l border-slate-800" />
    <div className="hidden md:block absolute -right-3 -bottom-3 h-6 w-6 bg-slate-950 rounded-full border-t border-l border-slate-800" />
  </div>
)

export const TicketContent = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={cn(
      'p-4 md:p-6 flex-1 flex flex-col justify-center w-full z-20',
      className,
    )}
  >
    {children}
  </div>
)

export const TicketActions = ({ children }: { children: ReactNode }) => (
  <>
    <div className="hidden md:block w-px bg-slate-800 my-4 z-20" />
    <Separator className="md:hidden bg-slate-800 z-20" />
    <div className="w-full md:w-56 p-4 md:p-6 bg-slate-900/40 flex flex-col justify-between gap-4 shrink-0 z-20">
      {children}
    </div>
  </>
)
