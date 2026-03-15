# Tasks: AI Įžvalgos apie Kraujo Tyrimus

Based on PRD: `tasks/prd-ai-insights.md`

## Relevant Files

- `supabase/migrations/002_ai_summary.sql` - Migration to add `ai_summary` column to `blood_tests`
- `src/types/database.types.ts` - Update `BloodTest` interface with `ai_summary` field
- `src/services/ai-insights.service.ts` - OpenAI API integration, prompt building, response parsing
- `src/services/ai-insights.service.test.ts` - Unit tests for AI insights service
- `src/hooks/use-ai-insights.ts` - React hook for fetching/generating AI insights
- `src/hooks/use-ai-insights.test.ts` - Unit tests for AI insights hook
- `src/components/blood-test/ai-insights-card.tsx` - UI component for displaying AI insights
- `src/components/blood-test/ai-insights-card.test.tsx` - Unit tests for AI insights card
- `src/pages/test-detail-page.tsx` - Integration of AI insights card into test detail view
- `src/services/blood-test.service.ts` - Add method to update `ai_summary` field

### Notes

- Unit tests should be placed alongside the code files they are testing.
- Use `npx vitest [optional/path/to/test/file]` to run tests.
- UI text must be in Lithuanian (LT).
- `VITE_OPENAI_API_KEY` is already used by OCR service — reuse same env var.

## Tasks

- [x] 1.0 Database Migration & Type Updates
  - [x] 1.1 Create SQL migration `supabase/migrations/002_ai_summary.sql` adding `ai_summary text` column to `blood_tests` [BLOCKS: 2.1, 3.1]
  - [x] 1.2 Update `BloodTest` interface in `src/types/database.types.ts` to include `ai_summary: string | null`
  - [x] 1.3 Add `updateAiSummary(testId: string, summary: string)` method to `blood-test.service.ts` [BLOCKS: 3.1]

- [x] 2.0 AI Insights Service (Prompt Building & OpenAI API)
  - [x] 2.1 Create `src/services/ai-insights.service.ts` with prompt builder function that accepts test results, reference ranges, gender, previous test results [DEPENDS: 1.1]
  - [x] 2.2 Implement OpenAI GPT-4o-mini API call with structured prompt (Lithuanian output, disclaimer, doctor recommendation with manodaktaras.lt CTA)
  - [x] 2.3 Implement response parsing and error handling (401, rate limit, timeout, empty response)
  - [x] 2.4 Add graceful degradation when `VITE_OPENAI_API_KEY` is missing

- [x] 3.0 AI Insights React Hook
  - [x] 3.1 Create `src/hooks/use-ai-insights.ts` with `useAiInsights(testId)` hook using TanStack Query [DEPENDS: 1.3, 2.1]
  - [x] 3.2 Implement caching logic: return cached `ai_summary` from DB if exists, otherwise generate via service
  - [x] 3.3 Implement `regenerate()` function to force re-generate and update DB cache
  - [x] 3.4 Expose loading, error, data, and regenerate states

- [x] 4.0 AI Insights Card UI Component
  - [x] 4.1 Create `src/components/blood-test/ai-insights-card.tsx` with loading state (skeleton + "Generuojamos AI įžvalgos...")
  - [x] 4.2 Implement success state with structured sections: summary, pastabos, palyginimas, rekomendacijos, disclaimer
  - [x] 4.3 Add CTA button "Rasti gydytoją" linking to `https://www.manodaktaras.lt/`
  - [x] 4.4 Implement error state with "Bandyti iš naujo" retry button
  - [x] 4.5 Add "Atnaujinti AI įžvalgas" regenerate button
  - [x] 4.6 Handle graceful degradation (don't render when no API key)

- [x] 5.0 Test Detail Page Integration
  - [x] 5.1 Import and render `AiInsightsCard` in `test-detail-page.tsx` between summary and marker grid [DEPENDS: 3.1, 4.1]
  - [x] 5.2 Pass required props: test ID, test results, profile data, previous test results
  - [x] 5.3 Verify responsive layout and visual consistency

- [x] 6.0 Unit Tests
  - [x] 6.1 Create `src/services/ai-insights.service.test.ts` — prompt building, API call mocking, error handling, missing API key [DEPENDS: 2.1]
  - [x] 6.2 Create `src/hooks/use-ai-insights.test.ts` — cache hit, cache miss + generate, regenerate, error states [DEPENDS: 3.1]
  - [x] 6.3 Create `src/components/blood-test/ai-insights-card.test.tsx` — loading, success, error, no-key states, CTA link, regenerate button [DEPENDS: 4.1]
  - [x] 6.4 Run full test suite and verify no regressions
