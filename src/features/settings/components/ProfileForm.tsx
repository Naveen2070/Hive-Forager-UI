import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import type { UserDTO } from '@/types/auth.type.ts'
import type { ProfileFormValues } from '@/features/settings/settings.schema.ts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { settingsSchema } from '@/features/settings/settings.schema.ts'

interface ProfileFormProps {
  defaultValues?: Partial<UserDTO>
  onSubmit: (data: ProfileFormValues) => void
  isPending: boolean
}

export const ProfileForm = ({
  defaultValues,
  onSubmit,
  isPending,
}: ProfileFormProps) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || '',
      email: defaultValues?.email
    },
  })

  return (
    <Card className="bg-slate-950 border-slate-800">
      <CardHeader>
        <CardTitle>Public Profile</CardTitle>
        <CardDescription>
          This is how others will see you on the site.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-slate-900/30 rounded-xl border border-slate-800/50">
          <Avatar className="h-20 w-20 border-2 border-slate-700">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${defaultValues?.fullName || 'User'}&background=0D8ABC&color=fff`}
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center md:text-left flex-1">
            <h4 className="text-sm font-medium text-slate-200">
              Profile Picture
            </h4>
            <p className="text-xs text-slate-500 max-w-50">
              Supports JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-slate-800 text-slate-300 hover:bg-slate-900 w-full md:w-auto"
            disabled
          >
            Upload New
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Grid Layout for Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-slate-900 border-slate-800 focus:ring-blue-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-slate-200">
                  Email Address
                </label>
                <Input
                  value={defaultValues?.email || ''}
                  disabled
                  className="bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500">Managed by admin.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-500 min-w-30"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}