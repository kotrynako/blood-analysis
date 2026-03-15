export interface ProfileFormData {
  gender: 'male' | 'female' | ''
  birth_year: string
}

export interface ProfileFormProps {
  defaultValues?: {
    gender: 'male' | 'female' | null
    birth_year: number | null
  }
  onSuccess?: () => void
}
