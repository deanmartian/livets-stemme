# 👥 Brukertesting Guide - Livets Stemme

## 🎯 Mål med Brukertesting

**Hovedmål**: Sikre at "Livets Stemme" er virkelig brukervennlig for norske eldre (65+) og møter deres behov for å bevare livshistorier.

### Spesifikke Mål:
- **Tilgjengelighet**: Kan eldre bruke appen uten teknisk hjelp?
- **Språk**: Er norsk tekst forståelig og naturlig?
- **Emosjonell tilkobling**: Føler brukerne seg komfortable med å dele historier?
- **Teknisk fungering**: Virker audio-opptak på deres enheter?
- **Familiedeling**: Forstår de hvordan de kan dele med familie?

---

## 👤 Rekruttering av Testdeltakere

### Målgruppe:
- **Alder**: 65-85 år
- **Teknisk nivå**: Blandede ferdigheter (nybegynnere til moderat erfarne)
- **Geografisk**: Hele Norge (med fokus på både by og land)
- **Familiesituasjon**: Både de med nær familie og de uten

### Rekrutteringskanaler:

#### 🏢 Seniorsentre og Eldresenter
```
Kontaktpersoner å nå ut til:
- Nasjonalforeningen for folkehelsen (eldresentre)
- Sanitetsforeninger lokalt
- Bibliotek med seniortilbud
- Pensjonistforeninger
- Frivilligsentral
```

#### ⛪ Kulturelle/Religiøse Organisasjoner
```
- Menigheter (mange eldre er aktive her)
- Kulturhus og foreninger
- Korsgrupper og hobbygrupper
```

#### 🌐 Digital Rekruttering
```
- Facebook grupper for seniorer
- Lokale Facebook grupper
- Gjennom familiemedlemmer på sosiale medier
- Seniorportaler som senior.no
```

#### 📧 Rekrutteringsmal (Norsk):

```
Emne: Hjelp oss teste en ny app for livshistorier - få 500 kr for deltakelse

Hei!

Vi trenger din hjelp til å teste "Livets Stemme" - en ny tjeneste som hjelper deg med å ta opp og bevare livshistoriene dine for familien.

Vi søker personer som:
- Er 65 år eller eldre
- Har en smarttelefon, nettbrett eller datamaskin
- Har 1-2 timer tilgjengelig for testing
- Synes det kunne vært interessant å dele livserfaringer

Som takk for deltakelse får du:
- 500 kr i kompensasjon
- Gratis tilgang til appen i 6 måneder
- Mulighet til å påvirke hvordan appen utvikles

Testing kan skje hjemme hos deg eller på [lokalt senter].

Interessert? Send mail til [epost] eller ring [telefon].

Med vennlig hilsen,
Livets Stemme teamet
```

---

## 🧪 Testoppsett og Metoder

### Testformat: Hybrid Tilnærming

#### 1. **Hjemmebesøk** (Anbefalt)
- **Varighet**: 90 minutter
- **Antall**: 8-12 deltakere
- **Fordeler**: Naturlig miljø, deres egne enheter, mer komfort
- **Oppsett**: En tester + en observatør/notatmaker

#### 2. **Senterbasert Testing**
- **Lokasjon**: Eldresenter eller bibliotek
- **Varighet**: 60 minutter
- **Antall**: 6-8 deltakere
- **Fordeler**: Kontrollert miljø, enklere logistikk

#### 3. **Digital Testing** (Oppfølging)
- **Platform**: Video-call (Zoom/Teams) med skjermdeling
- **Varighet**: 45 minutter
- **Antall**: 4-6 deltakere
- **Fordeler**: Geografisk spredning

---

## 📝 Testscenarioer

### Scenario 1: Førstegangsbruk (20 min)
```
Situasjon: "Du har hørt om denne appen fra et barnebarn som synes du burde dele historiene dine med familien."

Oppgaver:
1. Åpne appen første gang
2. Registrer en konto
3. Forstå hva appen gjør
4. Naviger til de viktigste funksjonene

Suksesskriterier:
- Forstår hensikten uten hjelp
- Kan registrere seg uten frustrasjon
- Finner opptaksfunksjonen
```

### Scenario 2: Ta opp første historie (25 min)
```
Situasjon: "Du vil ta opp historien om da du møtte din ektefelle."

Oppgaver:
1. Start nytt opptak
2. Bruk AI-assistenten for inspirasjon
3. Ta opp en 2-3 minutters historie
4. Lytt til opptaket
5. Legg til tittel og beskrivelse
6. Lagre historien

Suksesskriterier:
- Finner frem til opptak uten hjelp
- Forstår AI-forslagene
- Klarer å ta opp uten tekniske problemer
- Kan lagre og finne igjen historien
```

### Scenario 3: Familiedeling (20 min)
```
Situasjon: "Du vil at ditt barnebarn skal kunne høre denne historien."

Oppgaver:
1. Finn en lagret historie
2. Del den med familiemedlem
3. Sett tillatelser for hva de kan gjøre
4. Send invitasjon

Suksesskriterier:
- Forstår delingskontrollen
- Kan sende invitasjon
- Forstår forskjell på ulike tillatelser
```

### Scenario 4: Navigering og overvåking (15 min)
```
Situasjon: "Du vil se oversikt over alle historiene dine."

Oppgaver:
1. Gå til historiesoversikt
2. Søk etter en spesifikk historie
3. Se på familiedelingsaktivitet
4. Forstå bruksstatistikken din

Suksesskriterier:
- Finner oversiktsfunksjonene
- Kan bruke søkefunksjonen
- Forstår aktivitetsinformasjonen
```

---

## 📊 Datainnsamling

### Kvantitative Målinger:
```javascript
// Automatisk sporing i appen
const userTestingMetrics = {
  taskCompletionRate: 0, // % som fullfører oppgaver
  timeToComplete: 0,     // Sekunder per oppgave
  errorRate: 0,          // Antall feil per oppgave
  helpRequested: 0,      // Ganger de ber om hjelp
  dropOffPoints: [],     // Hvor de gir opp
  clickaccuracy: 0       // Traff riktig knapp første gang
}
```

### Kvalitative Observasjoner:
```
Observasjonsskjema:
□ Rynker pannen/ser forvirret ut
□ Mumler frustrert
□ Smiler/ser fornøyd ut
□ Ber om hjelp
□ Prøver samme ting flere ganger
□ Kommenterer positivt/negativt
□ Begynner å fortelle relatert historie
□ Virker engasjert vs distrahert
```

### Post-Test Intervju (15 min):
```
Spørsmål:
1. "Hva synes du var enklest å bruke?"
2. "Hva var mest forvirrende?"
3. "Hvordan føltes det å ta opp en historie?"
4. "Ville du brukt dette hjemme på egen hånd?"
5. "Hva skulle du ønske var annerledes?"
6. "Ville du anbefalt dette til en venn?"
7. "Hvor viktig er det for deg å bevare historiene dine?"
```

---

## 🛠️ Testing Verktøy

### For Opptak av Testing:
```
Anbefalt verktøy:
- OBS Studio (gratis skjermopptak)
- Zoom/Teams (for remote testing)
- Mobil med stativ (for hjemmebesøk)
- Loom (for enkle skjermopptak)
```

### For Analyse:
```
Analyse verktøy:
- Google Sheets for kvantitative data
- Miro/Figma for user journey mapping
- Hotjar/FullStory for automatisk opptak
- Typeform for post-test spørreundersøkelser
```

### Feedback Portal i Appen:
```typescript
// Feedback komponent for testing
interface TestingFeedback {
  taskId: string
  difficulty: 1 | 2 | 3 | 4 | 5
  confusion: string[]
  positiveNotes: string
  suggestions: string
  wouldRecommend: boolean
}
```

---

## 📈 Analysering av Resultater

### Prioritert Forbedringsliste:
```
1. KRITISK (stopper bruk):
   - Kan ikke registrere seg
   - Opptak fungerer ikke
   - Forstår ikke hensikten

2. HØYPRIORITET (frustrerende):
   - Forvirrende navigasjon
   - For små knapper/tekst
   - Uklar språkbruk

3. MEDIUM (forbedrer opplevelse):
   - Ikke intuitive ikoner
   - Manglende feedback
   - Ønsker ekstra funksjoner

4. LAV (nice-to-have):
   - Designpreferanser
   - Ekstra tilpasningsmuligheter
```

### Suksesskriterier for Beta-lansering:
```
✅ 80%+ fullfører registrering uten hjelp
✅ 70%+ kan ta opp og lagre en historie
✅ 60%+ forstår familiedelingsfunksjonen
✅ Gjennomsnittlig oppgavetid < 5 min per oppgave
✅ < 20% ber om hjelp under testing
✅ 80%+ sier de ville brukt det hjemme
✅ 85%+ ville anbefalt det til en venn
```

---

## 🔄 Iterativ Testing Prosess

### Runde 1: Proof of Concept (6-8 deltakere)
```
Fokus: Grunnleggende brukbarhet
- Kan de forstå konseptet?
- Virker teknologien?
- Er språket forståelig?
```

### Runde 2: Feature Testing (8-12 deltakere)
```
Fokus: Spesifikke funksjoner
- Familiedeling og tillatelser
- AI-assistanse for historier
- Søk og organisering
```

### Runde 3: Full User Journey (10-15 deltakere)
```
Fokus: Helhetlig opplevelse
- Onboarding til første historie
- Langtidsbruk (1 uke hjemme)
- Familiereaksjoner og engagement
```

---

## 💡 Spesielle Hensyn for Eldre Brukere

### Fysiske Tilpasninger:
```
- Test med/uten briller
- Test med/uten høreapparat
- Vurder skjelvende hender
- Sjekk med ulike skjermstørrelser
```

### Kognitiv Belastning:
```
- En oppgave av gangen
- Tydelige instruksjoner
- Pause hvis de blir slitne
- Ikke stress med tid
```

### Emosjonell Trygghet:
```
- Forsikre om at ingenting lagres permanent under testing
- Respekter hvis de ikke vil dele personlige historier
- Ha enkle, nøytrale eksempler klare
- Vær tålmodig og oppmuntrende
```

---

## 📞 Testing Koordinering

### Praktisk Organisering:
```
Forberedelser:
- Ring deltakere dagen før for bekreftelse
- Ha teknisk support på standby
- Bring power bank og backup enheter
- Ta med kompensasjon i kontanter

Under testing:
- Presentér deg og hensikten tydelig
- Forklare at de tester appen, ikke omvendt
- Oppmuntre til å "tenke høyt"
- Ta notater kontinuerlig

Etter testing:
- Takk for deltakelse og gi kompensasjon
- Send oppfølgings-email med kontaktinfo
- Tilby å dele resultater når de er klare
```

### Budsjett Eksempel:
```
Per deltaker:
- Kompensasjon: 500 kr
- Reisekostnader: 200 kr (hvis hjemmebesøk)
- Tester honorar: 800 kr
- Materielle kostnader: 100 kr
Total per deltaker: ~1600 kr

For 15 deltakere: ~24,000 kr
```

---

**🎯 Målet er å sikre at "Livets Stemme" virkelig tjener sine brukere og bevarer de verdifulle historiene deres på best mulig måte.**
