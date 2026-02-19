import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '@/types/auth.type.ts'
import { useAuthStore } from '@/store/auth.store'
import { userApi } from '@/api/user'

export const useSettings = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const userId = user?.id

  // 1. Fetch User Data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) throw new Error('No user ID')
      return userApi.getSelf()
    },
    enabled: !!userId,
  })

  // 2. Update Profile Mutation
  const updateProfile = useMutation({
    mutationFn: (data: UpdateProfilePayload) => {
      return userApi.updateProfile(data)
    },
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully')
      queryClient.setQueryData(['user', userId], updatedUser)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })

  // 3. Change Password Mutation
  const changePassword = useMutation({
    mutationFn: (data: ChangePasswordPayload) => {
      if (!userId) throw new Error('No user ID')
      return userApi.changePassword(data)
    },
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password')
    },
  })

  return {
    profile,
    isLoading,
    updateProfile,
    changePassword,
  }
}
