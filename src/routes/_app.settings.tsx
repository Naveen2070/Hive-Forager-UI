import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Lock, User } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  fetchProfile,
  useSettings,
} from '@/features/settings/hooks/useSettings'
import { ProfileForm } from '@/features/settings/components/ProfileForm'
import { SecurityForm } from '@/features/settings/components/SecurityForm'
import { Skeleton } from '@/components/ui/skeleton'
import { DataFallback } from '@/components/shared/DataFallback'
import { useAuthStore } from '@/store/auth.store'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
  loader: async ({ context: { queryClient } }) => {
    // Get the user ID from the store to match the hook's queryKey
    const userId = useAuthStore.getState().user?.id

    if (!userId) return

    try {
      await queryClient.ensureQueryData({
        queryKey: ['profile', userId], // 👉 Perfectly matches the hook
        queryFn: fetchProfile, // 👉 Uses the shared fetcher
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  },
})

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const {
    profile,
    isLoading,
    isError,
    refetch,
    updateProfile,
    changePassword,
  } = useSettings()

  if (isLoading) {
    return <SettingsSkeleton />
  }

  if (isError || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-slate-400">
            Manage your profile and security preferences.
          </p>
        </div>
        <DataFallback
          title="Profile Unavailable"
          message="We couldn't retrieve your account settings at this time."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400">
          Manage your profile and security preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Animated Content Area */}
      <div className="mt-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileForm
                defaultValues={profile}
                onSubmit={(data) => updateProfile.mutate(data)}
                isPending={updateProfile.isPending}
              />
            </motion.div>
          ) : (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SecurityForm
                onSubmit={(data) =>
                  changePassword.mutate({
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                  })
                }
                isPending={changePassword.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <Skeleton className="h-8 w-48 bg-slate-900" />
      <Skeleton className="h-10 w-full max-w-sm bg-slate-900" />
      <Skeleton className="h-100 w-full bg-slate-900 rounded-xl" />
    </div>
  )
}
