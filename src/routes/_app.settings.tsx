import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Lock, User } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSettings } from '@/features/settings/hooks/useSettings'
import { ProfileForm } from '@/features/settings/components/ProfileForm'
import { SecurityForm } from '@/features/settings/components/SecurityForm'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { profile, isLoading, updateProfile, changePassword } = useSettings()

  if (isLoading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-slate-400">
          Manage your profile and security preferences.
        </p>
      </div>

      {/* We use the Tabs component for the Header/Navigation,
         but we handle the content rendering manually to enable animations.
      */}
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
