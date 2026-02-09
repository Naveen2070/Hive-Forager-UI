import { useState } from 'react'
import { Loader2, Power } from 'lucide-react'
import { useUpdateEventStatus } from '@/features/events/hooks/useUpdateEventStatus.ts'
import { EventStatus } from '@/types/enum'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface EventStatusCardProps {
  eventId: number
  currentStatus: string
}

export const EventStatusCard = ({
  eventId,
  currentStatus,
}: EventStatusCardProps) => {
  const { mutate: updateStatus, isPending } = useUpdateEventStatus(eventId)
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus)

  const hasChanged = selectedStatus !== currentStatus

  const getStatusColor = (status: string) => {
    switch (status) {
      case EventStatus.PUBLISHED:
        return 'text-emerald-400'
      case EventStatus.DRAFT:
        return 'text-amber-400'
      case EventStatus.CANCELLED:
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  return (
    <Card className="bg-slate-950 border-slate-800 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-medium text-slate-100 flex items-center gap-2">
              <Power className="h-4 w-4 text-slate-400" />
              Event Status
            </CardTitle>
            <CardDescription className="text-slate-400">
              Control the visibility of your event.
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`${getStatusColor(currentStatus)} border-slate-700`}
          >
            Current: {currentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {/* Status Dropdown */}
        <div className="w-full md:w-64">
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            disabled={isPending}
          >
            <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value={EventStatus.PUBLISHED}>Published</SelectItem>
              <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={EventStatus.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Save Button (Only shows when changed) */}
        {hasChanged && (
          <Button
            onClick={() => updateStatus(selectedStatus)}
            disabled={isPending}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white animate-in fade-in slide-in-from-left-2"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Save Status'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
