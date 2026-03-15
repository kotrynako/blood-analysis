# PRD: Anoniminis Kraujo Tyrimų Įkėlimas (Anonymous Upload & Landing Page)

## Apžvalga / Overview

Šis funkcionalumas leidžia vartotojui įkelti kraujo tyrimo failą (PDF/nuotrauką) ir gauti automatinę analizę bei AI įžvalgas **be registracijos ar prisijungimo**. Pagrindinis landing page keičiasi — neprisijungęs vartotojas iškart mato hero sekciją su failų įkėlimo zona. Po analizės rezultatų ir AI apibendrinimo pateikimo, vartotojas raginamas prisijungti arba registruotis, kad galėtų išsaugoti rezultatus ir ateityje gauti geriau personalizuotas įžvalgas.

**Tikslas:** Sumažinti barjerą naujam vartotojui — leisti iškart patirti produkto vertę be registracijos, o tada konvertuoti į registruotą vartotoją.

---

## Tikslai / Goals

1. Leisti neregistruotam vartotojui įkelti kraujo tyrimo failą ir gauti analizę per < 15 sekundži.
2. Pakeisti landing page į patrauklų hero + upload vaizdą, kuris iškart demonstruoja produkto vertę.
3. Po analizės rezultatų ir AI įžvalgų parodymo — efektyviai raginti registruotis/prisijungti.
4. Po sėkmingos registracijos/prisijungimo — automatiškai išsaugoti anoniminius rezultatus į vartotojo paskyrą.
5. Autentifikuotiems vartotojams `/` puslapis nukreipia į `/dashboard` kaip ir anksčiau.

---

## Vartotojų istorijos / User Stories

- **US-01:** Kaip naujas lankytojas, noriu iškart pamatyti galimybę įkelti savo tyrimo failą, kad nereikėtų ieškoti kaip pradėti.
- **US-02:** Kaip neregistruotas vartotojas, noriu įkelti PDF/nuotrauką ir gauti tyrimo apibendrinimą be registracijos, kad suprasčiau, ar ši paslauga man naudinga.
- **US-03:** Kaip neregistruotas vartotojas, noriu matyti AI sugeneruotas įžvalgas apie mano tyrimo rezultatus, kad greičiau suprasčiau savo sveikatos būklę.
- **US-04:** Kaip neregistruotas vartotojas, po analizės noriu lengvai prisiregistruoti ir kad mano rezultatai būtų automatiškai išsaugoti, kad nereikėtų kelti failo iš naujo.
- **US-05:** Kaip registruotas vartotojas, noriu kad `/` puslapis nukreiptų mane tiesiai į dashboard, kaip ir anksčiau.

---

## Funkciniai reikalavimai / Functional Requirements

### Landing Page (Neprisijungęs vartotojas)

1. Kai vartotojas neprisijungęs ir atidaro `/`, sistema rodo naują landing page su:
   - **Hero sekcija:** Pavadinimas, trumpas aprašymas apie paslaugą (lietuvių kalba).
   - **Failų įkėlimo zona:** Drag & drop arba click-to-upload komponentas iškart po hero. Priimami formatai: PDF, JPG, PNG (maks. 10 MB).
   - **Statinis demo:** Po upload zonos rodoma statinė „Naujausi rezultatai" lentelė su fiktyviais rodikliais (Hemoglobinas, Vitaminas D, Gliukozė) kaip produkto demo. Po failo įkėlimo ši sekcija pakeičiama realiais rezultatais.
2. Landing page turi turėti nuorodas į prisijungimą ir registraciją hero sekcijoje (ne atskiras header).
3. Landing page dizainui naudok pavyzdį iš `Design/image.png`
4. Naudok pavyzdyje hero dalyje pateiktą tekstą išverstą į lietuvių kalbą.
5. Prie greitų nuorodų naudok nuorodas: https://www.manodaktaras.lt/ ir https://www.manodaktaras.lt/paieska/seimos-gydytojas?selectedRemote=1
6. Landing page footer'e pavadinimo ir tab nereikia (feature, solutions, pricing, resources).
7. Header'io taip pat nereikia.

### Anoniminis OCR apdorojimas

3. Po failo įkėlimo sistema apdoroja failą per OCR (OpenAI Vision API) — **be failo saugojimo į Supabase Storage** (failas apdorojamas tik atmintyje / in-memory).
4. Apdorojimo metu rodomas loading indikatorius su informatyviu pranešimu (pvz., „Analizuojame jūsų tyrimo rezultatus...").
5. Jei OCR neatpažįsta jokių rodiklių — rodomas klaidos pranešimas su galimybe bandyti iš naujo.

### Rezultatų ir AI įžvalgų rodymas (Anoniminis)

6. Po sėkmingo OCR apdorojimo sistema rodo atpažintų rodiklių sąrašą su:
   - Rodiklio pavadinimu, reikšme ir matavimo vienetu.
   - Vizualiniu būsenos indikatoriumi (norma / žemiau normos / virš normos).
7. Sistema automatiškai generuoja AI apibendrinimą (per `aiInsightsService`) **be personalizacijos** (be lyties, amžiaus, ankstesnių tyrimų palyginimo — nes vartotojas neprisijungęs ir neturi profilio).
8. AI apibendrinimas rodomas po rodiklių sąrašu.
9. Po AI apibendrinimo rodomas standartinis disclaimer (kaip ir registruotiems vartotojams).

### Registracijos/prisijungimo raginimas

10. Po rezultatų ir AI įžvalgų sekcijos sistema rodo aiškų CTA (call-to-action) bloką, raginantį registruotis arba prisijungti. CTA turi komunikuoti:
    - Rezultatų išsaugojimo galimybę.
    - Galimybę gauti **personalizuotas** įžvalgas (pagal lytį, amžių).
    - Galimybę sekti rodiklių dinamiką laike.
11. CTA blokas turi turėti du mygtukus: „Registruotis" ir „Prisijungti".

### Automatinis rezultatų išsaugojimas po autentifikacijos

12. Anonimiškai gauti OCR rezultatai (rodikliai) saugomi React state arba `sessionStorage`, kad neprarastų duomenų per registracijos/prisijungimo srautą.
13. Po sėkmingos registracijos arba prisijungimo sistema automatiškai:
    - Sukuria naują `blood_tests` įrašą su vartotojo `user_id` ir šiandienos data.
    - Išsaugo visus atpažintus rodiklius kaip `blood_test_results` įrašus.
    - Nukreipia vartotoją į naujai sukurto tyrimo detalių puslapį (`/test/:id`).
14. Jei automatinis išsaugojimas nepavyksta — rodomas klaidos pranešimas, bet vartotojas vis tiek nukreipiamas į dashboard.

### Autentifikuoto vartotojo elgsena

15. Jei vartotojas jau prisijungęs ir atidaro `/` — sistema nukreipia į `/dashboard` (esama logika nesikečia).

---

## Ne-tikslai / Non-Goals (Out of Scope)

- **Rankinis įvedimas anonimams:** Neregistruotas vartotojas negali įvesti rodiklių rankiniu būdu — tik failų įkėlimas per OCR.
- **Failo saugojimas anonimams:** Anonimiškai įkeltas failas nesaugomas Supabase Storage — tik apdorojamas OCR atmintyje.
- **Analizių limitas:** Šioje versijoje nėra limito anoniminėms analizėms.
- **A/B testavimas:** Landing page A/B testavimas — ne šioje versijoje.
- **Social login:** Google/Facebook prisijungimas — ne šioje versijoje (naudojamas tik el. paštas + slaptažodis).

---

## Dizaino sprendimai / Design Considerations

### Landing Page struktūra (pagal `Design/image.png`, be header)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  🩸 SAUGUS DUOMENŲ SAUGOJIMAS                   │
│                                                  │
│  Jūsų sveikatos duomenys,     ┌──────────────┐  │
│  apsaugoti                     │ 📄 Vilkite   │  │
│                                │ medicininius  │  │
│  Saugiai įkelkite ir valdykite │ failus čia    │  │
│  savo medicininius dokumentus. │              │  │
│  Gaukite AI įžvalgas, sekite   │ PDF, JPG, PNG│  │
│  tendencijas.                  │ (maks. 10 MB)│  │
│                                │              │  │
│  [Prisijungti] [Registruotis]  │ [Pasirinkti] │  │
│                                └──────────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  📊 Naujausi rezultatai (DEMO)                   │
│  ┌────────────────────────────────────────────┐  │
│  │ RODIKLIS        REIKŠMĖ  BŪSENA  TENDENC. │  │
│  │ Hemoglobinas    14.2 g/dL  ✅ Norma   80%  │  │
│  │ Vitaminas D     22 ng/mL   ⚠️ Žemas   30%  │  │
│  │ Gliukozė       95 mg/dL   ✅ Norma   65%  │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  Greitos nuorodos                                │
│  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ 🏥 Apsilankymas  │  │ 💻 Virtuali          │  │
│  │ pas gydytoją     │  │ konsultacija         │  │
│  │ manodaktaras.lt  │  │ manodaktaras.lt/...  │  │
│  └──────────────────┘  └──────────────────────┘  │
│                                                  │
├──────────────────────────────────────────────────┤
│  Footer (supaprastintas):                        │
│  Produktas | Pagalba | © 2024                    │
│  (be Features/Solutions/Pricing/Resources tabs)  │
└──────────────────────────────────────────────────┘
```

### Po analizės — rezultatų vaizdas

```
┌──────────────────────────────────────────┐
│  Atpažinti rodikliai (14)                │
│  ┌────────────────────────────────────┐  │
│  │ Hemoglobinas    145 g/L    ✅ Norma │  │
│  │ Leukocitai      12.5 ×10⁹/L ⬆️ Aukštas │
│  │ ...                                │  │
│  └────────────────────────────────────┘  │
│                                          │
│  AI Apibendrinimas                       │
│  ┌────────────────────────────────────┐  │
│  │ ## Bendras įvertinimas             │  │
│  │ Jūsų tyrimo rezultatai rodo...     │  │
│  │                                    │  │
│  │ ## Svarbios pastabos               │  │
│  │ ...                                │  │
│  │                                    │  │
│  │ ## Rekomendacijos                  │  │
│  │ ...                                │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ⚠️ Disclaimer: Tai nėra medicininė     │
│  diagnozė...                             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🔒 Išsaugokite savo rezultatus!  │  │
│  │                                    │  │
│  │  Registruokitės, kad galėtumėte:   │  │
│  │  • Išsaugoti tyrimo rezultatus     │  │
│  │  • Gauti personalizuotas įžvalgas  │  │
│  │  • Sekti rodiklių dinamiką laike   │  │
│  │                                    │  │
│  │  [Registruotis]  [Prisijungti]     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ↑ Grįžti ir įkelti kitą tyrimą         │
│                                          │
└──────────────────────────────────────────┘
```

### Spalvos ir stilius

- Naudoti esamą spalvų paletę (`#3DD0D8` pagrindinis akcentas).
- Hero sekcija — švarus, minimalistinis fonas su subtiliu gradientu arba esamais UI komponentais.
- CTA blokas registracijai — vizualiai išskirtas (pvz., šviesiai mėlynas fonas, border, ikona).

---

## Techniniai sprendimai / Technical Considerations

### Routing pakeitimai

- `/` maršrutas turi būti **hibridinis:**
  - Neprisijungęs → Landing page (nauja).
  - Prisijungęs → Redirect į `/dashboard` (esama logika).
- Nauja landing page komponentas: `src/pages/landing-page.tsx`.
- Paspaudus „Registruotis" arba „Prisijungti" — vartotojas nukreipiamas į esamus `/register` ir `/login` puslapius. Prieš redirect'ą pending rezultatai išsaugomi `sessionStorage`. Po sėkmingos autentifikacijos sistema patikrina `sessionStorage` ir automatiškai išsaugo rezultatus.

### Anoniminio OCR srautas

- Failas apdorojamas per esamą `ocrService.extractMarkers()` — **be Supabase Storage upload** (tik in-memory).
- OCR rezultatai saugomi React state kontekste arba `sessionStorage` (JSON serializacija), kad išliktų per auth redirect'ą.

### AI įžvalgos anonimams

- Naudoti esamą `aiInsightsService.generate()` — bet su `gender: null`, `birthYear: null`, `previousResults: null`.
- Tai reikš, kad prompt'e bus „Lytis: nenurodyta", „Amžius: nenurodyta" — bet vis tiek pateiks bendrą apibendrinimą.

### Duomenų perdavimas per auth srautą

- **Rekomenduojamas būdas:** `sessionStorage` su raktu (pvz., `pending_anonymous_results`).
  - Prieš redirect'ą į `/login` ar `/register` — išsaugoti `{ markers: OcrMarkerResult[], analyzedAt: string }` į `sessionStorage`.
  - Po sėkmingos autentifikacijos — patikrinti ar yra pending rezultatų → jei taip, automatiškai sukurti blood test + results → išvalyti sessionStorage → redirect į `/test/:id`.
- **Alternatyva:** React context su state (bet prarandama per page refresh/redirect).

### Komponentų struktūra (nauji/modifikuojami)

```
src/
  pages/
    landing-page/
      index.tsx                    # Pagrindinis landing page
      landing-page.types.ts        # Tipai
    landing-page/components/
      hero-section.tsx             # Hero blokas
      anonymous-upload.tsx         # Upload + OCR + results + AI flow
      anonymous-results.tsx        # Rezultatų rodymas
      auth-cta.tsx                 # CTA blokas registracijai
  hooks/
    use-anonymous-analysis.ts      # Hook anoniminiam OCR + AI srautui
    use-pending-results.ts         # Hook pending rezultatų valdymui (sessionStorage)
  services/
    (esami servicesai pakanka — nereikia naujų)
```

### Modifikuojami esami failai

- `src/app.tsx` — routing pakeitimai (naujas `/` maršrutas).
- `src/components/auth/public-route.tsx` — gali reikėti modifikuoti, kad leistų landing page.
- `src/hooks/use-auth.ts` — gali reikėti hook'o, kuris po prisijungimo patikrina pending results.

---

## Sėkmės metrikės / Success Metrics

1. **Konversija:** ≥ 15% anoniminių vartotojų, gavusių analizę, registruojasi.
2. **Greitis:** Anoniminis failas apdorojamas ir analizė parodoma per < 30 sekundžių.
3. **Rezultatų perdavimas:** ≥ 95% atvejų po registracijos anoniminiai rezultatai sėkmingai išsaugomi automatiškai.
4. **UX:** Vartotojas gali nuo landing page iki analizės rezultatų pasiekti per ≤ 2 veiksmus (įkelti failą → matyti rezultatus).
5. **Landing page bounce rate:** < 50%.

---

## Atviri klausimai / Open Questions

Visi klausimai išspręsti.

## Išspręsti klausimai / Resolved

- ~~**Hero sekcijos turinys:**~~ Naudojamas `Design/image.png` pavyzdys, tekstas verčiamas į LT.
- ~~**Auth redirect mechanizmas:**~~ Nukreipiama į esamus `/login`, `/register` puslapius (ne modal).
- ~~**Statinis demo vs tik po įkėlimo:**~~ Landing page rodo statinį demo su fiktyviais rodikliais, po įkėlimo pakeičia realiais.
- ~~**Analizių limitas:**~~ Be limito.
- ~~**Session persistence:**~~ Naudojamas `sessionStorage` — jei vartotojas uždaro naršyklę, duomenys prarandami ir tai priimtina. Paprasčiausia implementacija.
- ~~**SEO:**~~ Baziniai meta tags (title, description, og:image) landing page'ui.
