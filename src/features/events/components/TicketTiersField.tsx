import {
  CalendarClock,
  DollarSign,
  Plus,
  Ticket,
  Trash2,
  Users,
} from 'lucide-react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export const TicketTiersField = () => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ticketTiers',
  })

  const inputStyles =
    'bg-slate-900 border-slate-800 focus-visible:ring-blue-500/50 text-slate-100 placeholder:text-slate-500'

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-lg font-semibold text-slate-200">
            Ticket Types
          </Label>
          <p className="text-sm text-slate-400">
            Create categories like VIP, General Admission, etc.
          </p>
        </div>
        <Button
          type="button"
          onClick={() =>
            append({
              name: '',
              price: 0,
              totalAllocation: 100,
              enableCustomDates: false,
            })
          }
          variant="outline"
          size="sm"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Ticket Type
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <TierCard
            key={field.id}
            index={index}
            remove={remove}
            control={control}
            inputStyles={inputStyles}
            fieldsLength={fields.length}
          />
        ))}
      </div>
    </div>
  )
}

const TierCard = ({
  index,
  remove,
  control,
  inputStyles,
  fieldsLength,
}: any) => {
  const enableCustomDates = useWatch({
    control,
    name: `ticketTiers.${index}.enableCustomDates`,
  })

  return (
    <Card className="bg-slate-900/50 border-slate-800 relative group transition-all hover:border-slate-700">
      <CardContent className="p-4 grid gap-4 md:grid-cols-12 items-start">
        {/* Tier Name */}
        <div className="md:col-span-5">
          <FormField
            control={control}
            name={`ticketTiers.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400">
                  Ticket Name
                </FormLabel>
                <div className="relative">
                  <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                  <FormControl>
                    <Input
                      placeholder="e.g. Early Bird"
                      className={`${inputStyles} pl-9`}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Price */}
        <div className="md:col-span-3">
          <FormField
            control={control}
            name={`ticketTiers.${index}.price`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400">Price</FormLabel>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className={`${inputStyles} pl-9`}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Allocation */}
        <div className="md:col-span-3">
          <FormField
            control={control}
            name={`ticketTiers.${index}.totalAllocation`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-slate-400">
                  Quantity
                </FormLabel>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                  <FormControl>
                    <Input
                      type="number"
                      className={`${inputStyles} pl-9`}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Delete Button */}
        <div className="md:col-span-1 flex justify-end mt-7">
          {fieldsLength > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              className="text-slate-500 hover:text-red-400 hover:bg-red-950/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* --- CUSTOM DATES SECTION --- */}
        <div className="md:col-span-12 border-t border-slate-800/50 pt-3 mt-1">
          <FormField
            control={control}
            name={`ticketTiers.${index}.enableCustomDates`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-slate-600 data-[state=checked]:bg-blue-600"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-xs text-slate-300 font-normal cursor-pointer">
                    Set custom validity dates for this ticket type
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {enableCustomDates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <FormField
                control={control}
                name={`ticketTiers.${index}.validFrom`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-400">
                      Valid From
                    </FormLabel>
                    <div className="relative">
                      <CalendarClock className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className={`${inputStyles} pl-9`}
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`ticketTiers.${index}.validUntil`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-slate-400">
                      Valid Until
                    </FormLabel>
                    <div className="relative">
                      <CalendarClock className="absolute left-3 top-2.5 h-4 w-4 text-slate-600" />
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className={`${inputStyles} pl-9`}
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
