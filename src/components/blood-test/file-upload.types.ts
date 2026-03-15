export interface FileUploadProps {
  onFileSelect: (file: File) => void
  isUploading?: boolean
  acceptedTypes?: string[]
  maxSizeMB?: number
}

export const DEFAULT_ACCEPTED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
]

export const DEFAULT_ACCEPT_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
]

export const DEFAULT_MAX_SIZE_MB = 10
