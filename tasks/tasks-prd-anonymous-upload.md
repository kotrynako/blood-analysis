# Tasks: Anoniminis Kraujo Tyrimų Įkėlimas (Anonymous Upload & Landing Page)

Based on: `tasks/prd-anonymous-upload.md`

## Relevant Files

### Nauji failai (kuriami)

- `src/pages/landing-page/index.tsx` - Pagrindinis landing page komponentas, surenkantis visas sekcijas.
- `src/pages/landing-page/index.test.tsx` - Landing page testai.
- `src/pages/landing-page/landing-page.types.ts` - Landing page tipai (anonymous analysis state, demo data types).
- `src/pages/landing-page/components/hero-section.tsx` - Hero sekcija (pavadinimas, aprašymas, auth nuorodos + upload zona dešinėje).
- `src/pages/landing-page/components/hero-section.test.tsx` - Hero sekcijos testai.
- `src/pages/landing-page/components/static-demo-results.tsx` - Statinė demo rezultatų lentelė su fiktyviais rodikliais.
- `src/pages/landing-page/components/static-demo-results.test.tsx` - Static demo testai.
- `src/pages/landing-page/components/anonymous-results.tsx` - Realių anoniminių OCR rezultatų rodymas su būsenos indikatoriais.
- `src/pages/landing-page/components/anonymous-results.test.tsx` - Anonymous results testai.
- `src/pages/landing-page/components/anonymous-ai-insights.tsx` - AI apibendrinimo rodymas anonimams + disclaimer.
- `src/pages/landing-page/components/anonymous-ai-insights.test.tsx` - Anonymous AI insights testai.
- `src/pages/landing-page/components/auth-cta.tsx` - CTA blokas raginantis registruotis/prisijungti po analizės.
- `src/pages/landing-page/components/auth-cta.test.tsx` - Auth CTA testai.
- `src/pages/landing-page/components/quick-actions.tsx` - Greitų nuorodų sekcija (manodaktaras.lt).
- `src/pages/landing-page/components/quick-actions.test.tsx` - Quick actions testai.
- `src/pages/landing-page/components/landing-footer.tsx` - Supaprastintas footer (be nav tabs).
- `src/pages/landing-page/components/landing-footer.test.tsx` - Footer testai.
- `src/hooks/use-anonymous-analysis.ts` - Hook anoniminiam OCR + AI srautui (in-memory, be Supabase Storage).
- `src/hooks/use-anonymous-analysis.test.ts` - Anonymous analysis hook testai.
- `src/hooks/use-pending-results.ts` - Hook pending rezultatų valdymui per sessionStorage.
- `src/hooks/use-pending-results.test.ts` - Pending results hook testai.

### Modifikuojami esami failai

- `src/app.tsx` - Routing pakeitimai: hibridinis `/` maršrutas (landing vs redirect).
- `src/app.test.tsx` - Atnaujinti routing testai.
- `src/components/auth/public-route.tsx` - Gali reikėti modifikuoti, kad landing page būtų pasiekiamas neprisijungus.
- `src/hooks/use-auth.ts` - Pridėti pending results auto-save logiką po autentifikacijos.
- `src/hooks/use-auth.test.ts` - Atnaujinti auth hook testai.
- `index.html` - Baziniai meta tags (title, description, og:image).

### Referenciniai failai (naudojami, bet nemodifikuojami)

- `src/components/blood-test/file-upload.tsx` - Esamas upload komponentas (reuse).
- `src/components/blood-test/file-upload.types.ts` - Upload tipai.
- `src/services/ocr.service.ts` - OCR servisas (naudojamas tiesiogiai).
- `src/services/ai-insights.service.ts` - AI insights servisas (naudojamas tiesiogiai).
- `src/services/blood-test.service.ts` - Blood test CRUD (naudojamas auto-save metu).
- `src/hooks/use-blood-tests.ts` - useCreateBloodTest hook (naudojamas auto-save).
- `src/data/marker-definitions.ts` - Marker definitions (naudojami demo ir rezultatų rodymui).
- `src/utils/blood-test.utils.ts` - toMarkerResult ir kitos utility funkcijos.
- `Design/image.png` - Dizaino referencas.

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `index.tsx` and `index.test.tsx`).
- Use `npx vitest [optional/path/to/test/file]` to run tests.
- Use `npx vitest --coverage` to check test coverage (must be at least 95%).
- All UI text must be in Lithuanian (LT).
- Failų ilgis: max 300 eilučių (pagal projekto taisykles).
- Komponentai: kebab-case failai, PascalCase komponentų pavadinimai kode.

## Tasks

- [x] 1.0 Routing ir App struktūros pakeitimai
  - [x] 1.1 Sukurti `src/pages/landing-page/index.tsx` su pradiniu placeholder komponentu (LandingPage) [BLOCKS: 2.1, 2.2, 2.3, 2.4, 2.5, 3.6]
  - [x] 1.2 Modifikuoti `src/app.tsx` — pridėti hibridinį `/` maršrutą: neprisijungęs → LandingPage, prisijungęs → redirect į `/dashboard`. Pašalinti seną `Navigate to /dashboard` logiką iš protected route children [BLOCKS: 1.3]
  - [x] 1.3 Modifikuoti `src/components/auth/public-route.tsx` jei reikia — užtikrinti, kad `/` landing page veikia be autentifikacijos, o `/login` ir `/register` vis dar redirectina prisijungusius vartotojus [DEPENDS: 1.2]
  - [x] 1.4 Parašyti testus routing pakeitimams (`src/app.test.tsx`) — tikrinti: anon vartotojas mato landing page ties `/`, auth vartotojas nukreipiamas į `/dashboard` [DEPENDS: 1.2, 1.3]

- [x] 2.0 Landing Page UI (Hero + Upload + Static Demo + Quick Actions + Footer)
  - [x] 2.1 Sukurti `src/pages/landing-page/landing-page.types.ts` — tipai: AnonymousAnalysisState, DemoResultItem, ir kt. [DEPENDS: 1.1]
  - [x] 2.2 Sukurti `src/pages/landing-page/components/hero-section.tsx` — pagal `Design/image.png`: kairėje badge „Saugus duomenų saugojimas", antraštė „Jūsų sveikatos duomenys, apsaugoti", aprašymas, [Prisijungti] ir [Registruotis] mygtukai (Link į `/login` ir `/register`). Dešinėje: FileUpload komponentas (reuse esamo). [DEPENDS: 1.1]
  - [x] 2.3 Sukurti `src/pages/landing-page/components/static-demo-results.tsx` — statinė „Naujausi rezultatai" lentelė su 3 fiktyviais rodikliais (Hemoglobinas 14.2 g/dL Optimal 80%, Vitaminas D 22 ng/mL Low 30%, Gliukozė 95 mg/dL Optimal 65%) su spalvotais būsenos badge'ais ir progress bar tendencijomis. [DEPENDS: 2.1]
  - [x] 2.4 Sukurti `src/pages/landing-page/components/quick-actions.tsx` — dvi kortelės: „Apsilankymas pas gydytoją" (→ https://www.manodaktaras.lt/) ir „Virtuali konsultacija" (→ https://www.manodaktaras.lt/paieska/seimos-gydytojas?selectedRemote=1). Su ikonomis. [DEPENDS: 1.1]
  - [x] 2.5 Sukurti `src/pages/landing-page/components/landing-footer.tsx` — supaprastintas footer: kairėje logo + aprašymas, stulpeliai „Produktas" (Overview, Saugumas) ir „Pagalba" (Pagalbos centras, Susisiekti). Be Features/Solutions/Pricing/Resources tabs. Apačioje copyright + Privacy Policy + Terms of Service. [DEPENDS: 1.1]
  - [x] 2.6 Surinkti `src/pages/landing-page/index.tsx` — sujungti HeroSection, StaticDemoResults, QuickActions, LandingFooter į vientisą landing page. Paruošti state kintamąjį anonymous analizės rezultatams (bus naudojamas Task 3.6). [DEPENDS: 2.2, 2.3, 2.4, 2.5]
  - [x] 2.7 Parašyti testus visiems landing page komponentams: hero-section.test.tsx, static-demo-results.test.tsx, quick-actions.test.tsx, landing-footer.test.tsx, index.test.tsx [DEPENDS: 2.6]

- [x] 3.0 Anoniminis analizės srautas (OCR + AI įžvalgos + rezultatų rodymas)
  - [x] 3.1 Sukurti `src/hooks/use-anonymous-analysis.ts` — hook valdantis visą anoniminį srautą: failas → OCR (ocrService.extractMarkers, in-memory) → AI insights (aiInsightsService.generate su gender: null, birthYear: null, previousResults: null). Grąžina: markers, aiSummary, isProcessing, error, step (idle/processing/results/error), retry funkciją. [BLOCKS: 3.2, 3.3, 3.4]
  - [x] 3.2 Sukurti `src/pages/landing-page/components/anonymous-results.tsx` — realių OCR rezultatų rodymas: rodiklio pavadinimas, reikšmė, vienetas, būsenos indikatorius (norma ✅ / žemiau ⬇️ / virš ⬆️). Naudoti toMarkerResult() su gender: null. [DEPENDS: 3.1]
  - [x] 3.3 Sukurti `src/pages/landing-page/components/anonymous-ai-insights.tsx` — AI apibendrinimo rodymas: markdown renderinimas, disclaimer po apibendrinimo. [DEPENDS: 3.1]
  - [x] 3.4 Sukurti `src/pages/landing-page/components/auth-cta.tsx` — CTA blokas po rezultatų: ikona, „Išsaugokite savo rezultatus!", 3 privalumai (išsaugojimas, personalizuotos įžvalgos, dinamikos sekimas), [Registruotis] ir [Prisijungti] mygtukai (Link į `/register` ir `/login`). [DEPENDS: 3.1]
  - [x] 3.5 Integruoti anoniminį srautą į landing page: HeroSection upload → useAnonymousAnalysis hook → po apdorojimo pakeisti StaticDemoResults → AnonymousResults + AnonymousAiInsights + AuthCta. Rodyti processing spinner apdorojimo metu. [DEPENDS: 2.6, 3.1, 3.2, 3.3, 3.4]
  - [x] 3.6 Parašyti testus: use-anonymous-analysis.test.ts, anonymous-results.test.tsx, anonymous-ai-insights.test.tsx, auth-cta.test.tsx. Mock'inti ocrService ir aiInsightsService. [DEPENDS: 3.5]

- [x] 4.0 Pending rezultatų išsaugojimas ir automatinis įrašymas po autentifikacijos
  - [x] 4.1 Sukurti `src/hooks/use-pending-results.ts` — hook sessionStorage valdymui: savePendingResults(markers: OcrMarkerResult[]), getPendingResults(), clearPendingResults(). Raktas: `pending_anonymous_results`. Saugomas JSON: { markers, savedAt }. [BLOCKS: 4.2, 4.3]
  - [x] 4.2 Integruoti pending results į auth CTA srautą: kai vartotojas paspaudžia „Registruotis" arba „Prisijungti" — prieš navigaciją į `/register` ar `/login` iškviesti savePendingResults() su esamais OCR rezultatais. [DEPENDS: 3.4, 4.1]
  - [x] 4.3 Pridėti auto-save logiką po autentifikacijos: modifikuoti `src/hooks/use-auth.ts` arba sukurti atskirą effect — po sėkmingo login/register patikrinti getPendingResults(). Jei yra — sukurti blood_test + results per useCreateBloodTest, clearPendingResults(), redirect į `/test/:id`. [DEPENDS: 4.1, BLOCKS: 4.4]
  - [x] 4.4 Pridėti error handling auto-save srautui: jei createBloodTest nepavyksta — rodyti toast/pranešimą, bet vis tiek nukreipti į `/dashboard`. [DEPENDS: 4.3]
  - [x] 4.5 Parašyti testus: use-pending-results.test.ts (sessionStorage mock), auto-save logikos testai (sėkmingas save, klaidos atvejis, tuščias sessionStorage). [DEPENDS: 4.4]

- [x] 5.0 SEO meta tags ir galutinis integracijos testavimas
  - [x] 5.1 Pridėti bazinius meta tags į `index.html`: title „Kraujo Tyrimų Analizė", meta description, og:title, og:description, og:image. [DEPENDS: 2.6]
  - [x] 5.2 Užtikrinti responsive dizainą visiems naujiems komponentams — patikrinti mobile (< 640px), tablet (640-1024px), desktop (> 1024px). [DEPENDS: 3.5]
  - [x] 5.3 Atlikti galutinį integracinį testavimą: pilnas srautas nuo landing page → upload → OCR → AI → CTA → login/register → auto-save → test detail page. [DEPENDS: 4.4]
  - [x] 5.4 Paleisti `npx vitest --coverage` ir užtikrinti ≥ 95% test coverage naujiems failams. [DEPENDS: 5.3]
