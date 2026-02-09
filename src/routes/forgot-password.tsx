import { Link, createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'

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
import { userApi } from '@/api/user'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
})

function ForgotPasswordPage() {
  const form = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: userApi.forgotPassword,
    onSuccess: () => {
      toast.success('Reset link sent!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-slate-400 text-sm">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Success State */}
        {mutation.isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-4">
            <div className="h-12 w-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-medium">Check your inbox</h3>
              <p className="text-slate-400 text-sm">
                We sent a reset link to{' '}
                <span className="text-white">{form.getValues('email')}</span>
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full border-slate-700 hover:bg-slate-800 text-slate-300"
              asChild
            >
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          /* Form State */
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <Input
                            placeholder="user@example.com"
                            {...field}
                            className="pl-9 bg-slate-950 border-slate-800 focus:ring-blue-500/50"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
