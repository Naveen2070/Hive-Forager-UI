import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import type {
  AuditoriumResponse,
  CreateAuditoriumRequest,
} from '@/types/auditorium.type'
import { AuditoriumGridEditor } from './AuditoriumGridEditor'
import {
  auditoriumFormSchema,
  type AuditoriumFormValues,
} from '../auditorium.schema'

interface AuditoriumModalProps {
  isOpen: boolean
  cinemaId: string
  onClose: () => void
  onSubmit: (data: CreateAuditoriumRequest) => void
  initialData?: AuditoriumResponse | null
  isPending?: boolean
}

const DEFAULT_LAYOUT = {
  disabledSeats: [],
  wheelchairSpots: [],
  tiers: [],
}

export const AuditoriumModal = ({
  isOpen,
  cinemaId,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: AuditoriumModalProps) => {
  const form = useForm<AuditoriumFormValues>({
    resolver: zodResolver(auditoriumFormSchema as any),
    defaultValues: {
      name: '',
      maxRows: 10,
      maxColumns: 15,
      layout: DEFAULT_LAYOUT,
    },
  })

  // Populate form if we are editing or resetting
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          maxRows: initialData.maxRows,
          maxColumns: initialData.maxColumns,
          layout: initialData.layout || DEFAULT_LAYOUT,
        })
      } else {
        form.reset({
          name: '',
          maxRows: 10,
          maxColumns: 15,
          layout: DEFAULT_LAYOUT,
        })
      }
    }
  }, [isOpen, initialData, form])

  const handleFormSubmit = (values: AuditoriumFormValues) => {
    // Merge the cinemaId from props with the validated form values
    onSubmit({
      cinemaId,
      ...values,
    })
  }

  // Helper to cap dimensions between 1 and 50 instantly on type
  const handleDimensionChange = (
    val: string,
    onChange: (v: number) => void,
  ) => {
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      onChange(Math.max(1, Math.min(50, num)))
    }
  }

  const currentRows = form.watch('maxRows')
  const currentCols = form.watch('maxColumns')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-slate-200 w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Auditorium' : 'Create New Auditorium'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the grid dimensions and paint your custom seating layout below.'
              : 'Define the grid dimensions and paint your custom seating layout below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Screen Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                        placeholder="e.g. IMAX Screen 1"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxRows"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Total Rows
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          handleDimensionChange(e.target.value, field.onChange)
                        }
                        className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxColumns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-400 uppercase">
                      Seats per Row
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          handleDimensionChange(e.target.value, field.onChange)
                        }
                        className="bg-slate-900 border-slate-800 focus-visible:ring-yellow-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* The Grid Editor wrapped in a FormField */}
            <FormField
              control={form.control}
              name="layout"
              render={({ field }) => (
                <FormItem className="pt-4 border-t border-slate-800">
                  <FormLabel className="text-sm font-semibold text-slate-200 block mb-4">
                    Layout Designer
                  </FormLabel>
                  <FormControl>
                    <AuditoriumGridEditor
                      maxRows={currentRows}
                      maxColumns={currentCols}
                      layout={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold"
              >
                {isPending
                  ? 'Saving...'
                  : initialData
                    ? 'Update Layout'
                    : 'Create Auditorium'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
