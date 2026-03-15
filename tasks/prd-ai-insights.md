# PRD Papildymas: AI Įžvalgos apie Kraujo Tyrimus

## Apžvalga

Papildyti esamą kraujo tyrimų analizės sistemą AI generuojamomis įžvalgomis. Vietoj tik statinių paaiškinimų kiekvienam rodikliui, sistema pateiks personalizuotą tyrimo apibendrinimą, kuris atsižvelgs į visų rodiklių kombinaciją, vartotojo profilį ir tyrimų istoriją.

**Pastaba:** Sistema nepateikia medicininės diagnozės — tik informacines AI įžvalgas suprantama kalba.

---

## Tikslai

1. Pateikti personalizuotą AI apibendrinimą kiekvienam kraujo tyrimui lietuvių kalba.
2. Atkreipti dėmesį į rodiklių tarpusavio ryšius (pvz., žemas hemoglobinas + žemi eritrocitai = galima anemija).
3. Palyginti su ankstesniais tyrimais ir nurodyti tendencijas (pagerėjimas / pablogėjimas).
4. Pateikti bendras rekomendacijas atsižvelgiant į visą tyrimą, ne tik atskirus rodiklius.

---

## Vartotojų istorijos

- **US-08:** Kaip vartotojas, noriu gauti AI sugeneruotą tyrimo apibendrinimą, kad greitai suprasčiau savo bendrą sveikatos būklę.
- **US-09:** Kaip vartotojas, noriu matyti, ar mano rodikliai pagerėjo ar pablogėjo lyginant su ankstesniu tyrimu.
- **US-10:** Kaip vartotojas, noriu gauti bendras rekomendacijas, atsižvelgiančias į visų rodiklių kombinaciją.

---

## Funkciniai reikalavimai

### AI Įžvalgos
19. Tyrimo detalių puslapyje sistema turi rodyti AI sugeneruotą tyrimo apibendrinimo sekciją.
20. AI apibendrinimas turi apimti:
    - Bendrą tyrimo įvertinimą (1–2 sakiniai).
    - Svarbiausias pastabas apie nukrypusius rodiklius ir jų galimus ryšius.
    - Palyginimą su ankstesniu tyrimu (jei toks yra): kas pagerėjo, kas pablogėjo.
    - 2–4 konkrečias rekomendacijas pagal rodiklių kombinaciją.
    - nurodyti, kokios gydytojų konsultacijos būtų rekomenduojamas. Pateikti nuorodą į gydytojų paiešką svetainėje per CTA mygtuką: https://www.manodaktaras.lt/
21. Visas AI tekstas turi būti lietuvių kalba, suprantamas paprastam vartotojui (ne medicininis žargonas).
22. AI turi aiškiai nurodyti, kad tai nėra medicininė diagnozė (disclaimer).
23. Generavimas turi vykti asinchroniškai — vartotojas mato tyrimo detalių puslapį iškart, AI apibendrinimas kraunamas atskirai su loading indikacija.
24. Jei AI generavimas nepavyksta — rodomas fallback pranešimas, sistema toliau veikia normaliai.
25. AI atsakymas turi būti kešuojamas (saugomas), kad pakartotinai atidarius tyrimą nebūtų generuojamas iš naujo.

---

## Techniniai sprendimai

### API
- **OpenAI GPT-4o-mini** (arba kitas pigesnis/greitesnis modelis) per REST API.
- API raktas saugomas kaip `VITE_OPENAI_API_KEY` aplinkos kintamasis (jau naudojamas OCR).

### Prompt struktūra
AI prompt turi gauti:
- Visų šio tyrimo rodiklių reikšmes ir jų statusus (norma/žemas/aukštas).
- Normos ribas pagal vartotojo lytį.
- Ankstesnio tyrimo rodiklius (jei yra) palyginimui.
- Vartotojo lytį ir amžių (jei nurodyti profilyje).

### Kešavimas
- AI apibendrinimas saugomas `blood_tests` lentelėje naujame `ai_summary` stulpelyje (`text, nullable`).
- Pirmo atidarymo metu generuojamas ir išsaugomas; vėliau naudojamas iš DB.
- Vartotojas gali paspausti „Atnaujinti AI įžvalgas" mygtuką, kuris sugeneruoja iš naujo.

### Duomenų modelio pakeitimas
```sql
ALTER TABLE blood_tests ADD COLUMN ai_summary text;
```

### Nauji failai
- `src/services/ai-insights.service.ts` — OpenAI API kvietimas ir prompt formavimas.
- `src/hooks/use-ai-insights.ts` — hook AI įžvalgų gavimui/generavimui.
- `src/components/blood-test/ai-insights-card.tsx` — UI komponentas apibendrinimui rodyti.

---

## UI/UX

### Vieta puslapyje
AI įžvalgų kortelė rodoma **tyrimo detalių puslapyje** (`test-detail-page.tsx`):
- Po tyrimo santraukos kortelės, prieš rodiklių tinklelį.
- Turi unikalų dizainą (gradientas arba akcentuota kraštinė), kad išsiskirtų nuo statinių paaiškinimų.

### Kortelės struktūra
```
┌──────────────────────────────────────────┐
│ 🤖 AI Įžvalgos                          │
│                                          │
│ [Bendras tyrimo įvertinimas]             │
│                                          │
│ 📊 Svarbios pastabos:                    │
│ • ...                                    │
│ • ...                                    │
│                                          │
│ 📈 Palyginimas su ankstesniu tyrimu:     │
│ • ...                                    │
│                                          │
│ 💡 Rekomendacijos:                       │
│ • ...                                    │
│ • ...                                    │
│                                          │
│ ⚠️ Tai nėra medicininė diagnozė.        │
│ Konsultuokitės su gydytoju.              │
│                                          │
│ [🔄 Atnaujinti]                          │
└──────────────────────────────────────────┘
```

### Būsenos
- **Kraunama:** Skeleton/spinner su tekstu „Generuojamos AI įžvalgos..."
- **Įkelta:** Pilna kortelė su tekstu.
- **Klaida:** „Nepavyko sugeneruoti AI įžvalgų. Bandykite dar kartą." + „Bandyti iš naujo" mygtukas.
- **Nėra API rakto:** Kortelė nerodoma (graceful degradation).

---

## Ne-tikslai (šiai funkcijai)

- **Realaus laiko pokalbis su AI** — tik vienkartinis apibendrinimas.
- **AI diagnostika** — sistema aiškiai nurodo, kad tai tik informacinės įžvalgos.
- **AI kiekvienam rodikliui atskirai** — statiniai paaiškinimai lieka, AI generuoja tik bendrą apibendrinimą.
- **Ilgalaikių tendencijų AI analizė** — tik palyginimas su vienu ankstesniu tyrimu.

---

## Sėkmės metrikės

1. AI apibendrinimas sugeneruojamas per **< 5 sekundžių**.
2. Pakartotinis tyrimo atidarymas rodo kešuotą rezultatą be papildomo API kvietimo.
3. AI tekstas yra suprantamas, lietuviškas ir neviršija **300 žodžių**.
4. Klaidos atveju sistema veikia normaliai be AI kortelės.

---

## Atviri klausimai

1. **Modelio pasirinkimas:** GPT-4o-mini vs GPT-4o? Mini pigesnis ir greitesnis, bet mažiau tikslus sudėtingiems rodiklių ryšiams.
2. **API limitas:** Ar reikia riboti generavimų skaičių per dieną/vartotoją?
3. **Kešavimo strategija:** Ar AI apibendrinimas turi būti atnaujinamas automatiškai pakeitus tyrimo duomenis?
