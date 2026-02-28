import { Search, SlidersHorizontal, X } from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import type { EventFilters } from '@/types/event.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePickerWithRange } from '@/components/shared/date-range-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface EventFiltersBarProps {
  filters: EventFilters
  onUpdate: (key: keyof EventFilters, value: any) => void
  onClear: () => void
}

export const EventFiltersBar = ({
  filters,
  onUpdate,
  onClear,
}: EventFiltersBarProps) => {
  // Check if any filter is active
  const hasActiveFilters =
    filters.title || filters.location || filters.minPrice || filters.startDate

  // Helper to handle Date Range changes from the component
  const handleDateChange = (range?: DateRange) => {
    // 1. Handle Start Date (Set to 00:00:00)
    if (range?.from) {
      const fromDate = new Date(range.from)
      fromDate.setHours(0, 0, 0, 0) // Start of day

      // Format: "2026-02-02T00:00:00"
      onUpdate('startDate', format(fromDate, "yyyy-MM-dd'T'HH:mm:ss"))
    } else {
      onUpdate('startDate', undefined)
    }

    // 2. Handle End Date (Set to 23:59:59)
    if (range?.to) {
      const toDate = new Date(range.to)
      toDate.setHours(23, 59, 59, 999) // End of day

      // Format: "2026-02-05T23:59:59"
      onUpdate('endDate', format(toDate, "yyyy-MM-dd'T'HH:mm:ss"))
    } else {
      onUpdate('endDate', undefined)
    }
  }


  const dateRange: DateRange | undefined = filters.startDate
    ? {
        from: new Date(filters.startDate),
        to: filters.endDate ? new Date(filters.endDate) : undefined,
      }
    : undefined

  return (
    <div className="flex flex-col xl:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
      {/* 1. Keyword Search (Title/Desc) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search events..." // Changed from "Search by title"
          className="pl-9 bg-slate-950 border-slate-800 focus-visible:ring-blue-500/50 text-slate-200"
          value={filters.title || ''}
          onChange={(e) => onUpdate('title', e.target.value)}
        />
      </div>

      {/* 2. Location */}
      <div className="w-full md:w-48 xl:w-56">
        <Input
          placeholder="Location..."
          className="bg-slate-950 border-slate-800 focus-visible:ring-blue-500/50 text-slate-200"
          value={filters.location || ''}
          onChange={(e) => onUpdate('location', e.target.value)}
        />
      </div>

      {/* 3. Date Range Picker */}
      <div className="w-full md:w-auto">
        <DatePickerWithRange date={dateRange} setDate={handleDateChange} />
      </div>

      {/* 4. Advanced Filters (Price) */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-slate-950 border-slate-800 text-slate-200">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Price Range</h4>
              <p className="text-sm text-slate-500">Set your budget limits.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minPrice">Min Price</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    className="bg-slate-900 border-slate-800"
                    value={filters.minPrice || ''}
                    onChange={(e) => onUpdate('minPrice', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxPrice">Max Price</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="1000"
                    className="bg-slate-900 border-slate-800"
                    value={filters.maxPrice || ''}
                    onChange={(e) => onUpdate('maxPrice', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClear}
          className="text-slate-400 hover:text-white px-3"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
