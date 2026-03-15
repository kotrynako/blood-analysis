import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { profileService, type ProfileUpdate } from '@/services/profile.service'

const PROFILE_KEY = ['profile'] as const

export function useProfile() {
  const { user } = useAuth()

  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => profileService.get(user!.id),
    enabled: !!user,
  })
}

export function useUpdateProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: ProfileUpdate) =>
      profileService.update(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEY })
    },
  })
}
