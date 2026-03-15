import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useFileUpload } from '@/hooks/use-file-upload'
import { useCreateBloodTest } from '@/hooks/use-blood-tests'
import { ocrService, type OcrMarkerResult } from '@/services/ocr.service'
import { FileUpload } from './file-upload'

type Step = 'upload' | 'processing' | 'review' | 'error'

export function FileUploadTab() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { upload, isUploading } = useFileUpload()
  const createBloodTest = useCreateBloodTest()

  const [step, setStep] = useState<Step>('upload')
  const [extractedMarkers, setExtractedMarkers] = useState<OcrMarkerResult[]>([])
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const processingRef = useRef(false)

  const handleFileSelect = useCallback(async (file: File) => {
    if (!user || processingRef.current) return
    processingRef.current = true
    setErrorMsg(null)

    try {
      setStep('processing')
      const url = await upload(file)
      setFileUrl(url)

      const ocrResult = await ocrService.extractMarkers(file)
      setExtractedMarkers(ocrResult.markers)

      if (ocrResult.markers.length === 0) {
        setErrorMsg('Nepavyko atpažinti rodiklių iš failo. Bandykite įvesti rankiniu būdu.')
        setStep('error')
        return
      }

      setStep('review')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Nežinoma klaida'
      console.error('File upload/OCR error:', err)
      setErrorMsg(`Klaida: ${message}`)
      setStep('error')
    } finally {
      processingRef.current = false
    }
  }, [user, upload])

  const handleSave = async () => {
    if (!user || extractedMarkers.length === 0) return
    setErrorMsg(null)

    try {
      await createBloodTest.mutateAsync({
        test: {
          user_id: user.id,
          test_date: new Date().toISOString().split('T')[0],
          file_url: fileUrl,
        },
        results: extractedMarkers.map((m) => ({
          marker_key: m.marker_key,
          value: m.value,
          unit: m.unit,
        })),
      })
      navigate('/dashboard')
    } catch {
      setErrorMsg('Nepavyko išsaugoti tyrimo. Bandykite dar kartą.')
    }
  }

  const handleRetry = () => {
    setStep('upload')
    setExtractedMarkers([])
    setFileUrl(null)
    setErrorMsg(null)
  }

  if (step === 'upload') {
    return <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />
  }

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral border-t-primary" />
        <p className="text-sm text-neutral-dark">Apdorojamas failas...</p>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="space-y-4 py-8 text-center">
        <p className="text-sm text-status-high">{errorMsg}</p>
        <button type="button" onClick={handleRetry} className="text-sm font-medium text-primary hover:underline">
          Bandyti iš naujo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-dark">
        Atpažinti rodikliai ({extractedMarkers.length})
      </h3>
      <div className="divide-y divide-neutral rounded-lg border border-neutral">
        {extractedMarkers.map((m) => (
          <div key={m.marker_key} className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-dark">{m.marker_key}</span>
            <span className="text-sm font-medium text-dark">
              {m.value} {m.unit}
            </span>
          </div>
        ))}
      </div>
      {errorMsg && <p className="text-sm text-status-high">{errorMsg}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={handleRetry} className="flex-1 rounded-lg border border-neutral px-4 py-2 text-sm font-medium text-dark hover:bg-neutral-light">
          Atšaukti
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={createBloodTest.isPending}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {createBloodTest.isPending ? 'Saugoma...' : 'Išsaugoti'}
        </button>
      </div>
    </div>
  )
}
