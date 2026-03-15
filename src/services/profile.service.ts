import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'

export type ProfileUpdate = {
  gender?: 'male' | 'female' | null
  birth_year?: number | null
}

export const profileService = {
  async get(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data as Profile
  },

  async update(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  },
}
