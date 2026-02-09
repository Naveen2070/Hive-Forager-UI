import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { LoginFormValues } from '@/features/auth/auth.schemas'
import { loginSchema } from '@/features/auth/auth.schemas'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const LoginForm = () => {
  const { login, isLoggingIn } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      identifier: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <div className="grid gap-6">
      {/* Header inside the form area for better mobile flow */}
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="text-sm text-slate-400">
          Enter your credentials to access your account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-200">
                  Email or Username
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@eventhive.com"
                    {...field}
                    className="bg-slate-900/50 border-slate-800 focus-visible:ring-blue-500/50 text-slate-100 placeholder:text-slate-500"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-slate-200">Password</FormLabel>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    className="bg-slate-900/50 border-slate-800 focus-visible:ring-blue-500/50 text-slate-100 placeholder:text-slate-500"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-all"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
        >
          Register here
        </Link>
      </div>
    </div>
  )
}
