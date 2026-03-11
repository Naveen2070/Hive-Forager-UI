import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { RegisterFormValues } from '@/features/auth/auth.schemas.ts'
import { registerSchema } from '@/features/auth/auth.schemas.ts'
import { useAuth } from '@/features/auth/hooks/useAuth.ts'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { UserRole } from '@/types/enum.ts'

export const RegisterForm = () => {
  const { register: registerUser, isRegistering } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      intent: UserRole.USER,
      selectedDomains: ['events', 'movies'],
    },
  })

  const onSubmit = (data: RegisterFormValues) => {
    // Construct the backend-expected domainRoles Record
    const domainRoles: Record<string, string> = {}
    data.selectedDomains.forEach((domain) => {
      domainRoles[domain] = data.intent
    })

    const requestPayload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      domainRoles,
    }

    registerUser(requestPayload as any)
  }

  const inputStyles =
    'bg-slate-900/50 border-slate-800 focus-visible:ring-blue-500/50 text-slate-100 placeholder:text-slate-500'

  const domains = [
    { id: 'events', label: 'Events (Concerts, Workshops)' },
    { id: 'movies', label: 'Movies (Cinema Ticketing)' },
  ]

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Create an account
        </h1>
        <p className="text-sm text-slate-400">
          Enter your details to join the Hive ecosystem
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className={inputStyles}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    className={inputStyles}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className={inputStyles}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Confirm</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className={inputStyles}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="p-4 rounded-lg bg-slate-900/30 border border-slate-800/50 space-y-4">
            {/* Intent / Role Selection */}
            <FormField
              control={form.control}
              name="intent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">I want to...</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={inputStyles}>
                        <SelectValue placeholder="Select intent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                      <SelectItem value={UserRole.USER}>
                        Discover & Book Tickets
                      </SelectItem>
                      <SelectItem value={UserRole.ORGANIZER}>
                        Manage Events & Cinemas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Domain Multi-Select */}
            <FormField
              control={form.control}
              name="selectedDomains"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel className="text-slate-200 text-sm">
                      Access Domains
                    </FormLabel>
                    <FormDescription className="text-slate-500 text-[10px]">
                      Select the parts of the Hive you want to access.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {domains.map((domain) => (
                      <FormField
                        key={domain.id}
                        control={form.control}
                        name="selectedDomains"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={domain.id}
                              className="flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md border border-slate-800 bg-slate-950/50 hover:bg-slate-900/50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(domain.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                        ...field.value,
                                        domain.id,
                                      ])
                                      : field.onChange(
                                        field.value.filter(
                                          (value) => value !== domain.id,
                                        ),
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-xs font-normal text-slate-300 cursor-pointer flex-1">
                                {domain.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-900/20"
            disabled={isRegistering}
          >
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Join the Hive'
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
