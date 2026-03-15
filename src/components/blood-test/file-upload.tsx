import { useCallback, useRef, useState } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import {
  DEFAULT_ACCEPTED_TYPES,
  DEFAULT_MAX_SIZE_MB,
  type FileUploadProps,
} from './file-upload.types'

export function FileUpload({
  onFileSelect,
  isUploading = false,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return 'Netinkamas failo formatas. Priimami: PDF, JPG, PNG.'
      }
      if (file.size > maxSizeBytes) {
        return `Failas per didelis. Maksimalus dydis: ${maxSizeMB} MB.`
      }
      return null
    },
    [acceptedTypes, maxSizeBytes, maxSizeMB],
  )

  const handleFile = useCallback(
    (file: File) => {
      if (isUploading) return
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        setSelectedFile(null)
        return
      }
      setError(null)
      setSelectedFile(file)
      onFileSelect(file)
    },
    [validateFile, onFileSelect, isUploading],
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      if (e.target) e.target.value = ''
    },
    [handleFile],
  )

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isUploading}
        className={`flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-neutral hover:border-primary/50'
        } ${isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <svg
          className="mb-3 h-10 w-10 text-neutral-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="mb-1 text-sm font-medium text-dark">
          {isUploading ? 'Įkeliama...' : 'Vilkite failą čia arba paspauskite'}
        </p>
        <p className="text-xs text-neutral-dark">
          PDF, JPG arba PNG (maks. {maxSizeMB} MB)
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        aria-label="Pasirinkti failą"
      />

      {selectedFile && !error && (
        <p className="text-sm text-dark">
          Pasirinktas: <span className="font-medium">{selectedFile.name}</span>{' '}
          <span className="text-neutral-dark">
            ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
          </span>
        </p>
      )}

      {error && <p className="text-sm text-status-high">{error}</p>}
    </div>
  )
}
