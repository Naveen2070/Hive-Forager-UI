import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationBarProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isPlaceholderData?: boolean
}

export const PaginationBar = ({
  page,
  totalPages,
  onPageChange,
  isPlaceholderData,
}: PaginationBarProps) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 py-6 border-t border-slate-800 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(0, page - 1))}
        disabled={page === 0 || isPlaceholderData}
        className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>

      <span className="text-sm text-slate-400 font-medium">
        Page {page + 1} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (!isPlaceholderData && page < totalPages - 1) {
            onPageChange(page + 1)
          }
        }}
        disabled={page >= totalPages - 1 || isPlaceholderData}
        className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}
