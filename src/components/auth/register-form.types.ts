export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterFormProps {
  onSuccess?: () => void
}
