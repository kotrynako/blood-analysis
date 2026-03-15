import type { MarkerKey } from '@/types/blood-test.types'
import { MARKER_DEFINITIONS } from '@/data/marker-definitions'
import { isPdf, pdfToImageBase64 } from '@/utils/pdf-to-image'

export interface OcrMarkerResult {
  marker_key: MarkerKey
  value: number
  unit: string
}

export interface OcrResult {
  markers: OcrMarkerResult[]
  rawText?: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MAX_RETRIES = 5
const BASE_DELAY_MS = 5000

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  if (!key) {
    throw new Error(
      'Trūksta VITE_OPENAI_API_KEY aplinkos kintamojo. ' +
      'Nustatykite jį .env faile, kad galėtumėte naudoti OCR funkciją.',
    )
  }
  return key
}

function buildPrompt(): string {
  const markerList = MARKER_DEFINITIONS.map(
    (m) => `- ${m.key}: ${m.name} (${m.unit})`,
  ).join('\n')

  return `Esi kraujo tyrimo rezultatų analizės asistentas. 
Iš pateikto kraujo tyrimo vaizdo ištrauk rodiklių reikšmes.

Grąžink JSON masyvą su rastais rodikliais. Kiekvienas elementas turi turėti:
- "marker_key": vienas iš žemiau pateiktų raktų
- "value": skaitinė reikšmė
- "unit": matavimo vienetas

Galimi rodikliai:
${markerList}

Jei rodiklio nerandi vaizde, neįtrauk jo į rezultatą.
Grąžink TIK validų JSON masyvą, be jokio papildomo teksto.`
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const ocrService = {
  async extractMarkers(file: File): Promise<OcrResult> {
    const apiKey = getApiKey()

    let base64: string
    let mimeType: string

    if (isPdf(file)) {
      base64 = await pdfToImageBase64(file)
      mimeType = 'image/png'
    } else {
      base64 = await fileToBase64(file)
      mimeType = file.type || 'image/jpeg'
    }

    const requestBody = JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: buildPrompt(),
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0,
    })

    let response: Response | null = null
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: requestBody,
      })

      if (response.status !== 429 || attempt === MAX_RETRIES) break

      const delay = BASE_DELAY_MS * Math.pow(2, attempt)
      console.warn(`OpenAI 429 – bandymas ${attempt + 1}/${MAX_RETRIES}, laukiama ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 0
      if (status === 429) {
        throw new Error(
          'OpenAI API limitas viršytas. Patikrinkite ar turite kreditų: https://platform.openai.com/usage',
        )
      }
      if (status === 401) {
        throw new Error('Neteisingas OpenAI API raktas. Patikrinkite VITE_OPENAI_API_KEY .env faile.')
      }
      throw new Error(`OCR klaida: ${status} ${response?.statusText ?? 'Unknown'}`)
    }

    const data = await response.json()
    const rawText = data.choices?.[0]?.message?.content ?? ''

    const validKeys = new Set(MARKER_DEFINITIONS.map((m) => m.key))

    try {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        return { markers: [], rawText }
      }

      const parsed = JSON.parse(jsonMatch[0]) as Array<{
        marker_key: string
        value: number
        unit: string
      }>

      const markers: OcrMarkerResult[] = parsed
        .filter(
          (item) =>
            validKeys.has(item.marker_key as MarkerKey) &&
            typeof item.value === 'number' &&
            !isNaN(item.value),
        )
        .map((item) => ({
          marker_key: item.marker_key as MarkerKey,
          value: item.value,
          unit: item.unit ?? '',
        }))

      return { markers, rawText }
    } catch {
      return { markers: [], rawText }
    }
  },
}
