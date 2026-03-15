# PRD: Kraujo Tyrimų Analizės Svetainė

## Apžvalga / Overview

Svetainė leidžia paprastiems vartotojams įkelti ar įvesti savo bendros kraujo analizės rezultatus, gauti suprantamus paaiškinimus ir rekomendacijas, bei sekti savo rodiklių dinamiką laike. Tikslas — padėti žmonėms geriau suprasti savo sveikatos būklę be medicininės patirties.

---

## Tikslai / Goals

1. Leisti vartotojui lengvai įvesti arba įkelti kraujo tyrimo rezultatus (rankinis įvedimas arba PDF/nuotrauka).
2. Automatiškai identifikuoti, kurie rodikliai yra normos ribose, žemiau ar virš normos.
3. Pateikti suprantamus lietuviškus paaiškinimus ir rekomendacijas kiekvienam rodikliui.
4. Saugoti tyrimo istoriją ir vizualizuoti rodiklių kitimą laike.
5. Užtikrinti saugų vartotojų autentifikavimą ir privačių duomenų apsaugą.

---

## Vartotojų istorijos / User Stories

- **US-01:** Kaip vartotojas, noriu užsiregistruoti ir prisijungti, kad mano duomenys būtų saugiai saugomi tik man.
- **US-02:** Kaip vartotojas, noriu rankiniu būdu įvesti kraujo tyrimo rodiklius, kad galėčiau analizuoti popierinius rezultatus.
- **US-03:** Kaip vartotojas, noriu įkelti PDF arba nuotrauką su tyrimo rezultatais, kad sistema automatiškai ištrauktų rodiklius.
- **US-04:** Kaip vartotojas, noriu matyti, kurie mano rodikliai yra normos ribose (žalias), žemiau normos (mėlynas/oranžinis) ar virš normos (raudonas), kad greitai suprasčiau savo būklę.
- **US-05:** Kaip vartotojas, noriu gauti suprantamą paaiškinimą apie kiekvieną rodiklį lietuvių kalba, kad žinočiau, ką jis reiškia.
- **US-06:** Kaip vartotojas, noriu matyti savo ankstesnių tyrimų istoriją ir grafikus, kad galėčiau sekti savo sveikatos dinamiką.
- **US-07:** Kaip vartotojas, noriu ištrinti savo tyrimus, kad galėčiau valdyti savo duomenis.

---

## Funkciniai reikalavimai / Functional Requirements

### Autentifikacija
1. Sistema turi leisti vartotojui užsiregistruoti el. paštu ir slaptažodžiu.
2. Sistema turi leisti vartotojui prisijungti ir atsijungti.
3. Sistema turi leisti atstatyti slaptažodį per el. paštą.
4. Visi vartotojo duomenys turi būti prieinami tik jam (Row Level Security per Supabase).

### Duomenų įvedimas
5. Sistema turi pateikti formą su visais bendros kraujo analizės rodikliais (žr. skyrių „Duomenų modelis").
6. Kiekvienas laukelis turi turėti matavimo vienetą ir normos ribas kaip pagalbinį tekstą.
7. Sistema turi leisti įkelti PDF arba nuotrauką (JPG/PNG) su tyrimo rezultatais.
8. Sistema turi bandyti automatiškai ištraukti rodiklius iš įkelto failo (OCR / AI parsing). Jei nepavyksta — vartotojas gali įvesti rankiniu būdu.
9. Kiekvienam tyrimo įrašui vartotojas turi nurodyti datą.

### Analizė ir vizualizacija
10. Sistema turi palyginti kiekvieną rodiklį su standartinėmis normos ribomis pagal lytį ir amžių (jei vartotojas juos nurodė profilyje).
11. Sistema turi vizualiai pažymėti rodiklius: ✅ normos ribose, ⬇️ žemiau normos, ⬆️ virš normos.
12. Kiekvienam rodikliui sistema turi pateikti:
    - Trumpą paaiškinimą, ką jis matuoja.
    - Ką reiškia, jei jis yra aukštas arba žemas.
    - Bendras rekomendacijas (pvz., konsultuotis su gydytoju, atkreipti dėmesį į mitybą).
13. Sistema turi rodyti bendrą tyrimo santrauką (kiek rodiklių normos ribose / ne normoje).

### Istorija ir dinamika
14. Sistema turi saugoti visus vartotojo tyrimus su data.
15. Sistema turi rodyti tyrimų sąrašą chronologine tvarka.
16. Sistema turi rodyti grafiką pasirinkto rodiklio kitimui laike (per visus išsaugotus tyrimus).
17. Vartotojas turi galėti ištrinti bet kurį tyrimo įrašą.

### Profilis
18. Vartotojas turi galėti nurodyti savo lytį ir gimimo metus, kad analizė būtų tikslesnė.

---

## Ne-tikslai / Non-Goals (Out of Scope)

- **Diagnozė:** Sistema nepateikia medicininės diagnozės — tik informacinius paaiškinimus.
- **Kiti tyrimų tipai:** Hormonai, biochemija, šlapimo analizė — ne šioje versijoje.
- **Gydytojo konsultacija:** Integracija su gydytojais ar telemedicina — ne šioje versijoje.
- **Mobiliosios programėlės:** Tik web aplikacija.
- **Socialiniai funkcionalumai:** Dalijimasis rezultatais, komentarai — ne šioje versijoje.
- **Mokamas planas / prenumerata:** MVP yra nemokamas.

---

## Dizaino sprendimai / Design Considerations

### Spalvų paletė
- **Pagrindinis akcentas:** `#3DD0D8` (šviesiai žydra/tirkizinė)
- **Fonas / neutralus:** `#C4CDD1` (pilkšvai mėlyna)
- **Papildoma:** balta `#FFFFFF`, tamsus tekstas `#1A2025`
- **Būsenos spalvos:** žalia normai, oranžinė žemiau normos, raudona virš normos

### UI/UX principai
- Švarus, minimalistinis dizainas — tinka paprastam vartotojui.
- Rodikliai pateikiami kortelėmis (cards) su aiškia vizualine būsenos indikacija.
- Grafikai — paprasti linijiniai grafikai (Recharts biblioteka).
- Mobiliai draugiškas (responsive) dizainas.
- Visi tekstai, mygtukai, klaidos, placeholder'iai — **lietuvių kalba**.

### Pagrindiniai langai (Views)
1. **Prisijungimo / registracijos puslapis**
2. **Pagrindinis puslapis (Dashboard)** — paskutinio tyrimo santrauka + istorijos sąrašas
3. **Naujo tyrimo įvedimo puslapis** — forma arba failo įkėlimas
4. **Tyrimo detalių puslapis** — visi rodikliai su paaiškinimais
5. **Rodiklio istorijos grafikas** — pasirinkto rodiklio dinamika
6. **Profilio nustatymų puslapis**

---

## Techniniai sprendimai / Technical Considerations

### Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend/DB:** Supabase (Auth, PostgreSQL, Storage)
- **Grafikai:** Recharts
- **Formos:** React Hook Form + Zod validacija
- **State:** TanStack Query (React Query) serverio duomenims
- **Failų apdorojimas:** Supabase Storage įkėlimui; OCR — OpenAI Vision API arba Tesseract.js

### Duomenų modelis (Supabase)

```sql
-- Vartotojo profilis
profiles (
  id uuid references auth.users,
  gender text, -- 'male' | 'female'
  birth_year int,
  created_at timestamptz
)

-- Tyrimo įrašai
blood_tests (
  id uuid primary key,
  user_id uuid references profiles(id),
  test_date date not null,
  notes text,
  file_url text, -- įkelto PDF/nuotraukos URL
  created_at timestamptz
)

-- Rodiklių reikšmės
blood_test_results (
  id uuid primary key,
  test_id uuid references blood_tests(id),
  marker_key text not null, -- pvz. 'hemoglobin', 'wbc', 'rbc'
  value numeric not null,
  unit text not null,
  created_at timestamptz
)

-- Normos (statinė lentelė)
reference_ranges (
  marker_key text,
  gender text, -- 'male' | 'female' | 'all'
  min_value numeric,
  max_value numeric,
  unit text
)
```

### Bendros kraujo analizės rodikliai (MVP)
| Rodiklis | Raktas | Vienetas |
|---|---|---|
| Hemoglobinas | `hemoglobin` | g/L |
| Eritrocitai | `rbc` | ×10¹²/L |
| Leukocitai | `wbc` | ×10⁹/L |
| Trombocitai | `plt` | ×10⁹/L |
| Hematokritas | `hematocrit` | % |
| MCV | `mcv` | fL |
| MCH | `mch` | pg |
| MCHC | `mchc` | g/L |
| Neutrofilai | `neutrophils` | % |
| Limfocitai | `lymphocytes` | % |
| Monocitai | `monocytes` | % |
| Eozinofilai | `eosinophils` | % |
| Bazofilai | `basophils` | % |
| ESR (ENG) | `esr` | mm/h |

### Row Level Security
- Visi `blood_tests` ir `blood_test_results` įrašai apsaugoti RLS politikomis — vartotojas mato tik savo duomenis.

---

## Sėkmės metrikės / Success Metrics

1. Vartotojas gali įvesti tyrimo duomenis ir pamatyti analizę per **< 2 minutes**.
2. **100%** rodiklių turi paaiškinimus lietuvių kalba.
3. Tyrimo istorija ir grafikai veikia su **≥ 2 įrašais**.
4. Autentifikacijos srautas (registracija → prisijungimas) veikia be klaidų.
5. Svetainė pilnai veikia mobiliame įrenginyje (responsive).

---

## Atviri klausimai / Open Questions

1. **OCR tikslumas:** Ar pakanka Tesseract.js, ar reikia OpenAI Vision API geresniam PDF/nuotraukų apdorojimui? (Rekomenduojama pradėti nuo OpenAI Vision — tiksliau laboratoriniams dokumentams.)
2. **Rekomendacijų šaltinis:** Ar rekomendacijos bus statinis tekstas duomenų bazėje, ar generuojamos AI realiu laiku?
3. **Normos ribos:** Ar naudosime universalias normos ribas, ar reikia Lietuvos laboratorijų specifinių reikšmių?
4. **El. pašto patvirtinimas:** Ar reikalingas el. pašto patvirtinimas registracijos metu?
