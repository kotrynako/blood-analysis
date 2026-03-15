# Tasks: Kraujo Tyrimų Analizės Svetainė

Užduočių sąrašas sugeneruotas pagal [prd-blood-analysis.md](./prd-blood-analysis.md).

---

## Relevant Files

- `src/main.tsx` - React entry point
- `src/app.tsx` - Root component su routing
- `src/lib/supabase.ts` - Supabase klientas
- `src/lib/constants.ts` - Konstantos (rodikliai, normos, spalvos)
- `src/lib/constants.test.ts` - Unit tests for constants
- `src/types/database.types.ts` - Supabase auto-generated types
- `src/types/blood-test.types.ts` - Blood test related TypeScript interfaces
- `src/components/ui/` - Bendri UI komponentai (Button, Card, Input, etc.)
- `src/components/layout/` - Layout komponentai (Header, Sidebar, PageWrapper)
- `src/components/auth/auth-provider.tsx` - AuthProvider wrapper komponentas
- `src/components/auth/protected-route.tsx` - Apsaugotas maršrutas (redirect į login jei neprisijungęs)
- `src/components/auth/public-route.tsx` - Viešas maršrutas (redirect į dashboard jei prisijungęs)
- `src/components/auth/login-form.tsx` - Prisijungimo forma
- `src/components/auth/login-form.test.tsx` - Tests for login form
- `src/components/auth/register-form.tsx` - Registracijos forma
- `src/components/auth/register-form.test.tsx` - Tests for register form
- `src/components/auth/reset-password-form.tsx` - Slaptažodžio atstatymo forma
- `src/components/auth/reset-password-form.test.tsx` - Tests for reset password form
- `src/components/profile/profile-form.tsx` - Profilio redagavimo forma
- `src/components/profile/profile-form.test.tsx` - Tests for profile form
- `src/components/profile/profile-form.types.ts` - Profile form types
- `src/components/blood-test/test-entry-form.tsx` - Rankinio tyrimo įvedimo forma
- `src/components/blood-test/test-entry-form.test.tsx` - Tests for test entry form
- `src/components/blood-test/test-entry-form.types.ts` - Test entry form types
- `src/components/blood-test/file-upload.tsx` - PDF/nuotraukos įkėlimo komponentas
- `src/components/blood-test/file-upload.test.tsx` - Tests for file upload
- `src/components/blood-test/marker-card.tsx` - Vieno rodiklio kortelė su statusu
- `src/components/blood-test/marker-card.test.tsx` - Tests for marker card
- `src/components/blood-test/marker-card.types.ts` - Marker card types
- `src/components/blood-test/test-summary.tsx` - Tyrimo santrauka (norma/ne norma)
- `src/components/blood-test/test-summary.test.tsx` - Tests for test summary
- `src/components/blood-test/marker-explanation.tsx` - Rodiklio paaiškinimas ir rekomendacijos
- `src/components/blood-test/marker-explanation.test.tsx` - Tests for marker explanation
- `src/components/dashboard/test-history-list.tsx` - Tyrimų istorijos sąrašas
- `src/components/dashboard/test-history-list.test.tsx` - Tests for history list
- `src/components/dashboard/latest-test-summary.tsx` - Paskutinio tyrimo santrauka dashboard
- `src/components/dashboard/latest-test-summary.test.tsx` - Tests for latest test summary
- `src/components/charts/marker-trend-chart.tsx` - Rodiklio dinamikos grafikas (Recharts)
- `src/components/charts/marker-trend-chart.test.tsx` - Tests for marker trend chart
- `src/components/charts/marker-trend-chart.types.ts` - Chart types
- `src/pages/login-page.tsx` - Prisijungimo puslapis
- `src/pages/register-page.tsx` - Registracijos puslapis
- `src/pages/dashboard-page.tsx` - Pagrindinis puslapis
- `src/pages/new-test-page.tsx` - Naujo tyrimo įvedimo puslapis
- `src/pages/test-detail-page.tsx` - Tyrimo detalių puslapis
- `src/pages/marker-history-page.tsx` - Rodiklio istorijos grafikas
- `src/pages/profile-page.tsx` - Profilio nustatymų puslapis
- `src/hooks/use-auth.ts` - Auth hook (session, user, signUp, signIn, signOut, resetPassword) + AuthContext
- `src/hooks/use-auth.test.ts` - Tests for auth hook
- `src/hooks/use-profile.ts` - Profilio CRUD hook
- `src/hooks/use-profile.test.ts` - Tests for profile hook
- `src/hooks/use-blood-tests.ts` - Tyrimų CRUD hook (TanStack Query)
- `src/hooks/use-blood-tests.test.ts` - Tests for blood tests hook
- `src/hooks/use-file-upload.ts` - Failų įkėlimo hook
- `src/hooks/use-file-upload.test.ts` - Tests for file upload hook
- `src/services/blood-test.service.ts` - Supabase blood test queries/mutations
- `src/services/blood-test.service.test.ts` - Tests for blood test service
- `src/services/profile.service.ts` - Supabase profile queries/mutations
- `src/services/profile.service.test.ts` - Tests for profile service
- `src/services/ocr.service.ts` - OCR/AI parsing service
- `src/services/ocr.service.test.ts` - Tests for OCR service
- `src/utils/blood-test.utils.ts` - Normų palyginimas, statusų skaičiavimas
- `src/utils/blood-test.utils.test.ts` - Tests for blood test utils
- `src/data/marker-definitions.ts` - Rodiklių apibrėžimai (paaiškinimai LT, normos, vienetai)
- `src/data/marker-definitions.test.ts` - Tests for marker definitions
- `supabase/migrations/001_initial_schema.sql` - DB schema migration (profiles, blood_tests, blood_test_results, reference_ranges + auto-profile trigger)
- `tailwind.config.ts` - Tailwind konfigūracija su custom spalvomis
- `vite.config.ts` - Vite konfigūracija
- `vitest.config.ts` - Vitest konfigūracija

### Notes

- Unit tests should be placed alongside the code files they are testing (e.g., `marker-card.tsx` and `marker-card.test.tsx` in the same directory).
- Use `npx vitest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Vitest configuration.
- Use `npx vitest --coverage` to check test coverage (must be at least 95%).
- All UI text must be in **Lithuanian (LT)**. Code comments and variable names in **English**.

---

## Tasks

- [x] 1.0 Projekto inicializacija ir konfigūracija
  - [x] 1.1 Inicializuoti Vite + React + TypeScript projektą (`npm create vite@latest`) [BLOCKS: 1.2, 1.3, 1.4, 1.5, 1.6]
  - [x] 1.2 Sukonfigūruoti Tailwind CSS su custom spalvų palete (`#3DD0D8`, `#C4CDD1`, `#FFFFFF`, `#1A2025`, status spalvos) [DEPENDS: 1.1]
  - [x] 1.3 Įdiegti ir sukonfigūruoti Supabase klientą (`@supabase/supabase-js`), sukurti `src/lib/supabase.ts` [DEPENDS: 1.1]
  - [x] 1.4 Įdiegti pagrindines priklausomybes: `react-router-dom`, `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `recharts` [DEPENDS: 1.1]
  - [x] 1.5 Sukonfigūruoti Vitest testavimui (`vitest.config.ts`, `@testing-library/react`, `jsdom`) [DEPENDS: 1.1]
  - [x] 1.6 Sukurti bazinę projekto struktūrą: `src/components/`, `src/pages/`, `src/hooks/`, `src/services/`, `src/utils/`, `src/lib/`, `src/types/`, `src/data/` [DEPENDS: 1.1]
  - [x] 1.7 Sukonfigūruoti React Router su pagrindiniais maršrutais (`/login`, `/register`, `/dashboard`, `/test/new`, `/test/:id`, `/marker/:key/history`, `/profile`) [DEPENDS: 1.4, 1.6]
  - [x] 1.8 Sukurti TypeScript tipus/interfaces (`blood-test.types.ts`, `database.types.ts`) [DEPENDS: 1.6]

- [x] 2.0 Supabase duomenų bazė ir autentifikacija [DEPENDS: 1.3]
  - [x] 2.1 Sukurti SQL migraciją `001_initial_schema.sql` su lentelėmis: `profiles`, `blood_tests`, `blood_test_results`, `reference_ranges` [BLOCKS: 2.2, 2.3]
  - [x] 2.2 Sukonfigūruoti Row Level Security (RLS) politikas visoms lentelėms — vartotojas mato/keičia tik savo duomenis [DEPENDS: 2.1]
  - [x] 2.3 Užpildyti `reference_ranges` lentelę standartinėmis normų reikšmėmis (14 rodiklių, male/female) [DEPENDS: 2.1]
  - [x] 2.4 Sukurti `src/hooks/use-auth.ts` — registracija, prisijungimas, atsijungimas, slaptažodžio atstatymas, session stebėjimas [BLOCKS: 2.5, 2.6, 2.7]
  - [x] 2.5 Sukurti `src/components/auth/login-form.tsx` — prisijungimo forma su Zod validacija, lietuviški tekstai [DEPENDS: 2.4]
  - [x] 2.6 Sukurti `src/components/auth/register-form.tsx` — registracijos forma su Zod validacija, lietuviški tekstai [DEPENDS: 2.4]
  - [x] 2.7 Sukurti `src/components/auth/reset-password-form.tsx` — slaptažodžio atstatymo forma [DEPENDS: 2.4]
  - [x] 2.8 Sukurti `src/pages/login-page.tsx` ir `src/pages/register-page.tsx` puslapius [DEPENDS: 2.5, 2.6]
  - [x] 2.9 Implementuoti apsaugotą routing (redirect į login jei neprisijungęs) [DEPENDS: 2.4, 1.7]
  - [x] 2.10 Parašyti testus auth komponentams ir hook'ui [DEPENDS: 2.4, 2.5, 2.6, 2.7]

- [x] 3.0 Vartotojo profilis [DEPENDS: 2.0]
  - [x] 3.1 Sukurti `src/services/profile.service.ts` — profilio CRUD operacijos per Supabase [BLOCKS: 3.2]
  - [x] 3.2 Sukurti `src/hooks/use-profile.ts` — profilio duomenų gavimas ir atnaujinimas (TanStack Query) [DEPENDS: 3.1] [BLOCKS: 3.3]
  - [x] 3.3 Sukurti `src/components/profile/profile-form.tsx` — lytis (select), gimimo metai (input), išsaugojimo mygtukas [DEPENDS: 3.2]
  - [x] 3.4 Sukurti `src/pages/profile-page.tsx` — profilio puslapis su forma [DEPENDS: 3.3]
  - [x] 3.5 Automatiškai sukurti `profiles` įrašą po registracijos (Supabase trigger arba kliento pusėje) [DEPENDS: 2.4, 3.1]
  - [x] 3.6 Parašyti testus profilio komponentams, hook'ui ir servisui [DEPENDS: 3.1, 3.2, 3.3]

- [x] 4.0 Kraujo tyrimo įvedimas ir failų įkėlimas [DEPENDS: 2.0]
  - [x] 4.1 Sukurti `src/data/marker-definitions.ts` — 14 rodiklių apibrėžimai: raktas, pavadinimas LT, vienetas, normos ribos (male/female), trumpas paaiškinimas, aukšto/žemo reikšmės paaiškinimas, rekomendacijos [BLOCKS: 4.2, 5.1]
  - [x] 4.2 Sukurti `src/services/blood-test.service.ts` — tyrimų ir rezultatų CRUD operacijos per Supabase [BLOCKS: 4.3]
  - [x] 4.3 Sukurti `src/hooks/use-blood-tests.ts` — tyrimų sąrašo gavimas, vieno tyrimo gavimas, sukūrimas, ištrynimas (TanStack Query) [DEPENDS: 4.2] [BLOCKS: 4.4, 4.5]
  - [x] 4.4 Sukurti `src/components/blood-test/test-entry-form.tsx` — rankinio įvedimo forma: data picker, 14 rodiklių laukeliai su vienetais ir normos helper tekstu, React Hook Form + Zod [DEPENDS: 4.1, 4.3]
  - [x] 4.5 Sukurti `src/components/blood-test/file-upload.tsx` — drag & drop / failų pasirinkimo komponentas (PDF, JPG, PNG) [DEPENDS: 4.3]
  - [x] 4.6 Sukurti `src/hooks/use-file-upload.ts` — failo įkėlimas į Supabase Storage [BLOCKS: 4.7]
  - [x] 4.7 Sukurti `src/services/ocr.service.ts` — OCR/AI apdorojimo servisas (OpenAI Vision API arba Tesseract.js), grąžina rodiklių reikšmes [DEPENDS: 4.6]
  - [x] 4.8 Sukurti `src/pages/new-test-page.tsx` — puslapis su tabais: "Įvesti rankiniu būdu" / "Įkelti failą" [DEPENDS: 4.4, 4.5, 4.7]
  - [x] 4.9 Parašyti testus blood test komponentams, hook'ams ir servisams [DEPENDS: 4.1, 4.2, 4.3, 4.4, 4.5]

- [x] 5.0 Tyrimo analizė ir vizualizacija [DEPENDS: 4.0]
  - [x] 5.1 Sukurti `src/utils/blood-test.utils.ts` — rodiklio būsenos skaičiavimas (normal/low/high) pagal normas, lytį, amžių; santraukos skaičiavimas [DEPENDS: 4.1] [BLOCKS: 5.2, 5.3]
  - [x] 5.2 Sukurti `src/components/blood-test/marker-card.tsx` — kortelė su rodiklio pavadinimu, reikšme, vienetu, vizualine būsenos indikacija (žalia/oranžinė/raudona), normos ribomis [DEPENDS: 5.1]
  - [x] 5.3 Sukurti `src/components/blood-test/marker-explanation.tsx` — išplėstas paaiškinimas: ką matuoja, ką reiškia aukšta/žema reikšmė, rekomendacijos (lietuvių k.) [DEPENDS: 5.1, 4.1]
  - [x] 5.4 Sukurti `src/components/blood-test/test-summary.tsx` — tyrimo santrauka: kiek rodiklių normoje / žemiau / virš normos, progress bar arba vizualus indikatorius [DEPENDS: 5.1]
  - [x] 5.5 Sukurti `src/pages/test-detail-page.tsx` — tyrimo detalių puslapis: santrauka viršuje, rodiklių kortelės su paaiškinimais, tyrimo data, trynimo mygtukas [DEPENDS: 5.2, 5.3, 5.4]
  - [x] 5.6 Parašyti testus analizės utils, marker card, explanation ir summary komponentams [DEPENDS: 5.1, 5.2, 5.3, 5.4]

- [x] 6.0 Istorija ir dinamikos grafikai [DEPENDS: 4.0]
  - [x] 6.1 Sukurti `src/components/dashboard/test-history-list.tsx` — tyrimų sąrašas chronologine tvarka: data, trumpa santrauka, nuoroda į detalų puslapį, trynimo mygtukas [DEPENDS: 4.3, 5.1]
  - [x] 6.2 Sukurti `src/components/dashboard/latest-test-summary.tsx` — paskutinio tyrimo santraukos kortelė dashboard viršuje [DEPENDS: 5.4]
  - [x] 6.3 Sukurti `src/pages/dashboard-page.tsx` — pagrindinis puslapis: paskutinio tyrimo santrauka + istorijos sąrašas + "Naujas tyrimas" mygtukas [DEPENDS: 6.1, 6.2]
  - [x] 6.4 Sukurti `src/components/charts/marker-trend-chart.tsx` — linijinis grafikas (Recharts) pasirinkto rodiklio reikšmėms per visus tyrimus laike [BLOCKS: 6.5]
  - [x] 6.5 Sukurti `src/pages/marker-history-page.tsx` — rodiklio istorijos puslapis: grafikas + lentelė su reikšmėmis per datą [DEPENDS: 6.4]
  - [x] 6.6 Parašyti testus dashboard ir chart komponentams [DEPENDS: 6.1, 6.2, 6.4]

- [x] 7.0 UI/UX ir dizaino finišavimas [DEPENDS: 1.0]
  - [x] 7.1 Sukurti bendrus UI komponentus: Button, Card, Input, Select, Modal/Dialog, Loading Spinner, Alert/Toast — su Tailwind ir custom spalvomis [BLOCKS: 2.5, 2.6, 3.3, 4.4]
  - [x] 7.2 Sukurti layout komponentus: Header (su navigacija, atsijungimo mygtuku), PageWrapper [DEPENDS: 2.4]
  - [x] 7.3 Užtikrinti responsive dizainą visuose puslapiuose (mobile-first) [DEPENDS: 6.3, 5.5]
  - [x] 7.4 Peržiūrėti ir patvirtinti, kad **visi** UI tekstai yra lietuvių kalba (mygtukai, placeholder, klaidos, toast pranešimai) [DEPENDS: 6.3, 5.5]
  - [x] 7.5 Sukurti 404 puslapį ir error boundary komponentą [DEPENDS: 1.7]
  - [x] 7.6 Parašyti testus UI komponentams [DEPENDS: 7.1, 7.2, 7.5]
