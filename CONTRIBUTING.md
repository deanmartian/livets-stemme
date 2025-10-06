# 🤝 Bidrag til Livets Stemme

Vi ønsker deg velkommen som bidragsyter til Livets Stemme! Dette prosjektet har til mål å lage en tilgjengelig og meningsfull plattform for eldre brukere til å bevare sine livshistorier.

## 📋 Hvordan Bidra

### 🐛 Rapporter Bugs
1. Sjekk eksisterende [issues](https://github.com/[bruker]/livets-stemme/issues) først
2. Opprett en ny issue med:
   - Klar beskrivelse av problemet
   - Steg for å reprodusere
   - Forventet vs faktisk oppførsel
   - Skjermbilder hvis relevant
   - Brukerens alder/tekniske nivå (viktig for UX)

### 💡 Foreslå Nye Funksjoner
1. Opprett en feature request issue
2. Beskriv:
   - Hvilken brukergruppe dette hjelper
   - Hvorfor funksjonen er viktig
   - Forslag til implementering
   - Tilgjengelighetsaspekter for eldre brukere

### 🔧 Code Bidrag

#### Første Gang?
1. Fork repositoryet
2. Klon din fork:
```bash
git clone https://github.com/[dinbruker]/livets-stemme.git
cd livets-stemme
```

3. Installer avhengigheter:
```bash
bun install
```

4. Start utviklingsserver:
```bash
bun run dev
```

#### Utviklingsflyt
1. Opprett en ny branch:
```bash
git checkout -b feature/beskrivende-navn
# eller
git checkout -b bugfix/issue-nummer
```

2. Gjør dine endringer
3. Test endringene:
```bash
bun run lint
bun run type-check
bun run build
```

4. Commit med beskrivende melding:
```bash
git commit -m "feat: legg til funksjon for familiedeling"
# eller
git commit -m "fix: løs problem med lydopptak på mobil"
```

5. Push og opprett Pull Request

## 🎯 Kodestandarder

### TypeScript
- Bruk streng typing - unngå `any`
- Definer interfaces for alle data strukturer
- Bruk React hooks riktig

### Styling
- Følg Tailwind CSS patterns
- Bruk shadcn/ui komponenter når mulig
- Sørg for responsive design

### Tilgjengelighet
- **Kritisk**: Test med store fonter (125%, 150%)
- Bruk semantisk HTML
- Sørg for keyboard navigasjon
- Test kontrastforhold

### Norsk Språk
- All brukervendt tekst skal være på norsk
- Bruk respektfull tone for eldre brukere
- Unngå teknisk sjargong

## 🧪 Testing

### Manuell Testing
- Test på forskjellige skjermstørrelser
- Test med keyboard navigasjon
- Test lydopptak i forskjellige nettlesere
- **Viktig**: Test med eldre familiemedlemmer hvis mulig

### Code Review
- Alle PRs trenger godkjenning
- Focus på tilgjengelighet og brukervennlighet
- Sjekk norsk språk og kulturell sensitivitet

## 🎨 Design Retningslinjer

### For Eldre Brukere
- **Font størrelse**: Minimum 18px base
- **Klikkmål**: Minimum 48px × 48px
- **Kontrast**: WCAG AA standard
- **Språk**: Enkelt, varmt, støttende

### Fargeskjema
- Primær: Amber/Orange (#D97706)
- Sekundær: Warm grays
- Unngå: Sterke blå/lilla farger
- Sørg for god kontrast

## 📱 Plattform Support

### Nettlesere
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- **Mobile**: iOS Safari, Chrome Mobile

### Enheter
- Desktop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔒 Sikkerhet

### Lyddata
- Aldri send lydfiler til eksterne tjenester uten samtykke
- Respekter brukerens privacy innstillinger
- Følg GDPR retningslinjer

### Brukerdata
- Minimal datainnsamling
- Tydelig informasjon om hva som lagres
- Enkel måte å slette data på

## 📚 Ressurser

### Tilgjengelighet
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/)
- [WebAIM](https://webaim.org/)

### Norsk Språk
- [Språkrådet](https://www.sprakradet.no/)
- Bruk enkle, hverdagslige uttrykk

### Senior UX
- Test med eldre brukere
- Stor tekst og knapper
- Enkel navigasjon

## 🏆 Anerkjennelse

Alle bidragsytere blir kreditert i README og release notes. Vi setter pris på:

- 💻 Kode bidrag
- 🎨 Design forslag
- 📝 Dokumentasjon
- 🐛 Bug rapporter
- 🧪 Testing med eldre brukere
- 🌍 Oversettelser
- 💡 Feature ideer

## 📞 Få Hjelp

- **GitHub Issues**: For tekniske spørsmål
- **Discussions**: For generelle diskusjoner
- **E-post**: kontakt@livetsstemme.no

## 📄 Lisens

Ved å bidra, godtar du at dine bidrag blir lisensiert under [MIT License](LICENSE).

---

**Takk for at du hjelper oss med å bevare dyrebare minner! 🎙️❤️**
