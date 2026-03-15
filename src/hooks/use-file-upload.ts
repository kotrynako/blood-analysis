import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'

const BUCKET_NAME = 'blood-test-files'

interface UseFileUploadReturn {
  upload: (file: File) => Promise<string>
  isUploading: boolean
  error: string | null
}

export function useFileUpload(): UseFileUploadReturn {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File): Promise<string> => {
      if (!user) throw new Error('Vartotojas neprisijungęs')

      setIsUploading(true)
      setError(null)

      try {
        const ext = file.name.split('.').pop() ?? 'bin'
        const fileName = `${user.id}/${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName)

        return urlData.publicUrl
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Nepavyko įkelti failo'
        setError(message)
        throw err
      } finally {
        setIsUploading(false)
      }
    },
    [user],
  )

  return { upload, isUploading, error }
}
