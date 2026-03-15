import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

const RENDER_SCALE = 2

export async function pdfToImageBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const page = await pdf.getPage(1)

  const viewport = page.getViewport({ scale: RENDER_SCALE })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Nepavyko sukurti canvas konteksto')

  await page.render({ canvasContext: ctx, viewport, canvas }).promise

  const dataUrl = canvas.toDataURL('image/png')
  return dataUrl.split(',')[1]
}

export function isPdf(file: File): boolean {
  return file.type === 'application/pdf'
}
