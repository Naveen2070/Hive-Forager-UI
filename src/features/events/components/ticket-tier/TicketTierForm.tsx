import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DollarSign, Loader2, Ticket, Users } from 'lucide-react'

import { Button } from '@/components/ui/button.tsx'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx'
import { Input } from '@/components/ui/input.tsx'

// Schema moved here
const tierFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0),
  totalAllocation: z.coerce.number().min(1),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
})

export type TierFormValues = z.infer<typeof tierFormSchema>

interface TicketTierFormProps {
  defaultValues: TierFormValues
  onSubmit: (data: TierFormValues) => void
  onCancel: () => void
  isPending: boolean
  submitLabel: string
}

export const TicketTierForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: TicketTierFormProps) => {
  const form = useForm<TierFormValues>({
    resolver: zodResolver(tierFormSchema as any),
    defaultValues,
  })

  // Reset form when defaultValues change (switching between Add/Edit)
  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  const inputStyles = 'bg-slate-900 border-slate-800 pl-9'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="VIP Pass"
                    className={inputStyles}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input type="number" className={inputStyles} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalAllocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input type="number" className={inputStyles} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid From</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="bg-slate-900 border-slate-800"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    className="bg-slate-900 border-slate-800"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
