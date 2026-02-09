import { format } from 'date-fns'
import { Calendar, Edit2, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { TicketTierDTO } from '@/types/event.type'

interface TicketTierCardProps {
  tier: TicketTierDTO
  onEdit: (tier: TicketTierDTO) => void
  onDelete: (id: number) => void
}

export const TicketTierCard = ({
  tier,
  onEdit,
  onDelete,
}: TicketTierCardProps) => {
  const percentSold =
    ((tier.totalAllocation - tier.availableAllocation) / tier.totalAllocation) *
    100

  return (
    <Card className="bg-slate-900 border-slate-800 relative group transition-colors hover:border-slate-700">
      <CardContent className="p-5 space-y-4">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-slate-200 text-lg">
              {tier.name}
            </div>
            <Badge
              variant="secondary"
              className="mt-1 bg-slate-800 text-slate-300 border-slate-700"
            >
              {tier.price === 0 ? 'Free' : `$${tier.price.toFixed(2)}`}
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white"
              onClick={() => onEdit(tier)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-950 border-slate-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-slate-100">
                    Delete Ticket Tier?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    This will permanently remove the{' '}
                    <span className="text-white font-medium">
                      "{tier.name}"
                    </span>{' '}
                    tier. This action fails if tickets have already been sold.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-800 hover:bg-slate-800 text-slate-300">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(tier.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Sold: {tier.totalAllocation - tier.availableAllocation}</span>
            <span>Total: {tier.totalAllocation}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${percentSold}%` }}
            />
          </div>
        </div>

        {/* Date Footer */}
        <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span>
            Valid until {format(new Date(tier.validUntil), 'MMM d, yyyy')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
