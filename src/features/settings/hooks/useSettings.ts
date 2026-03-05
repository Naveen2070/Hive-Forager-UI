import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '@/types/auth.type.ts'
import { useAuthStore } from '@/store/auth.store'
import { userApi } from '@/api/user'

export const fetchProfile = async () => {
  if (import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true') {
    const { MOCK_USER } = await import('@/api/mocks/auth.mock')
    return MOCK_USER
  }
  return userApi.getSelf()
}

export const useSettings = () => {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const userId = user?.id

  // 1. Fetch User Data
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: fetchProfile,
    enabled: !!userId,
  })

  // 2. Update Profile Mutation
  const updateProfile = useMutation({
    mutationFn: (data: UpdateProfilePayload) => {
      // (Optional: You could wrap mutations in mock checks if needed, but usually not necessary for static UI)
      return userApi.updateProfile(data)
    },
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully')
      queryClient.setQueryData(['profile', userId], updatedUser)
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
    isError,
    refetch,
    updateProfile,
    changePassword,
  }
}
