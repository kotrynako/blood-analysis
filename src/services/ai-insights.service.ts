import type { MarkerResult } from '@/types/blood-test.types'
import { MARKER_MAP } from '@/data/marker-definitions'

export interface AiInsightsInput {
  results: MarkerResult[]
  gender: 'male' | 'female' | null
  birthYear: number | null
  previousResults?: MarkerResult[] | null
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MAX_RETRIES = 3
const BASE_DELAY_MS = 3000

function getApiKey(): string | null {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  return key || null
}

function getStatusLabel(status: string): string {
  if (status === 'low') return 'žemiau normos'
  if (status === 'high') return 'virš normos'
  return 'norma'
}

function formatMarkerLine(r: MarkerResult): string {
  const def = MARKER_MAP[r.key]
  const name = def?.name ?? r.key
  return `- ${name}: ${r.value} ${r.unit} (${getStatusLabel(r.status)}, norma: ${r.referenceMin}–${r.referenceMax})`
}

function buildComparisonBlock(
  current: MarkerResult[],
  previous: MarkerResult[],
): string {
  const prevMap = new Map(previous.map((r) => [r.key, r]))
  const lines: string[] = []

  for (const cur of current) {
    const prev = prevMap.get(cur.key)
    if (!prev) continue
    const diff = cur.value - prev.value
    if (Math.abs(diff) < 0.01) continue
    const name = MARKER_MAP[cur.key]?.name ?? cur.key
    const arrow = diff > 0 ? '↑' : '↓'
    lines.push(`- ${name}: ${prev.value} → ${cur.value} ${cur.unit} (${arrow} ${diff > 0 ? '+' : ''}${diff.toFixed(1)})`)
  }

  return lines.length > 0
    ? `\nAnkstesnio tyrimo palyginimas:\n${lines.join('\n')}`
    : ''
}

export function buildInsightsPrompt(input: AiInsightsInput): string {
  const { results, gender, birthYear, previousResults } = input

  const genderText = gender === 'male' ? 'vyras' : gender === 'female' ? 'moteris' : 'nenurodyta'
  const ageText = birthYear ? `${new Date().getFullYear() - birthYear} m.` : 'nenurodyta'

  const markerLines = results.map(formatMarkerLine).join('\n')

  const comparisonBlock = previousResults?.length
    ? buildComparisonBlock(results, previousResults)
    : ''

  const abnormal = results.filter((r) => r.status !== 'normal')
  const abnormalSummary = abnormal.length > 0
    ? `Nukrypę rodikliai: ${abnormal.map((r) => MARKER_MAP[r.key]?.name ?? r.key).join(', ')}.`
    : 'Visi rodikliai normos ribose.'

  return `Esi kraujo tyrimų analizės asistentas. Pateik personalizuotą tyrimo apibendrinimą lietuvių kalba.

Vartotojo profilis:
- Lytis: ${genderText}
- Amžius: ${ageText}

Tyrimo rodikliai:
${markerLines}

${abnormalSummary}
${comparisonBlock}

Pateik atsakymą tokia struktūra (naudok tiksliai šias antraštes):

## Bendras įvertinimas
1–2 sakiniai apie bendrą tyrimo vaizdą.

## Svarbios pastabos
Svarbiausi nukrypimai ir galimi rodiklių tarpusavio ryšiai (pvz., jei žemas hemoglobinas ir eritrocitai — galima anemija). Jei visi rodikliai normoje — paminėk, kad rezultatai geri.

${previousResults?.length ? '## Palyginimas su ankstesniu tyrimu\nKas pagerėjo, kas pablogėjo, tendencijos.\n' : ''}## Rekomendacijos
2–4 konkrečios rekomendacijos pagal rodiklių kombinaciją. Būtinai nurodyti, kokios gydytojų konsultacijos būtų rekomenduojamos (pvz., šeimos gydytojas, hematologas ir pan.).

SVARBU:
- Rašyk paprastai, suprantamai — ne medicininis žargonas.
- Neviršyk 300 žodžių.
- Nerašyk "Disclaimer" antraštės — disclaimer bus rodomas atskirai UI.
- Negrąžink nieko kito be paties apibendrinimo teksto.`
}

export const aiInsightsService = {
  isAvailable(): boolean {
    return getApiKey() !== null
  },

  async generate(input: AiInsightsInput): Promise<string> {
    const apiKey = getApiKey()
    if (!apiKey) {
      throw new Error('VITE_OPENAI_API_KEY nenustatytas. AI įžvalgos neprieinamos.')
    }

    const prompt = buildInsightsPrompt(input)

    const requestBody = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: 'Pateik šio kraujo tyrimo apibendrinimą.' },
      ],
      max_tokens: 1500,
      temperature: 0.3,
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
      await new Promise((r) => setTimeout(r, delay))
    }

    if (!response || !response.ok) {
      const status = response?.status ?? 0
      if (status === 401) {
        throw new Error('Neteisingas OpenAI API raktas. Patikrinkite VITE_OPENAI_API_KEY.')
      }
      if (status === 429) {
        throw new Error('OpenAI API limitas viršytas. Bandykite vėliau.')
      }
      throw new Error(`AI klaida: ${status} ${response?.statusText ?? 'Unknown'}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ''

    if (!content.trim()) {
      throw new Error('AI grąžino tuščią atsakymą. Bandykite dar kartą.')
    }

    return content.trim()
  },
}
