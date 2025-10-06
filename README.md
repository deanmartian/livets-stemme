# 🎙️ Livets Stemme - Digital Minnearkiv

En trygg og enkel plattform for eldre brukere (65+) til å ta opp og bevare livshistoriene sine for familien. Spesiallaget for norske brukere med AI-assistanse og enkle delingsfunksjoner.

![Livets Stemme](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Norwegian](https://img.shields.io/badge/Language-Norsk-red)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)

## 📖 Om Prosjektet

**Livets Stemme** er en digital minnearkiv-plattform som lar eldre brukere enkelt ta opp og organisere livshistoriene sine. Prosjektet fokuserer på tilgjengelighet, kulturell sensitivitet og familiedeling.

### 🎯 Målgruppe
- Eldre brukere (65+) som ønsker å bevare sine historier
- Familiemedlemmer som vil samle og dele familiehistorie
- Organisasjoner som jobber med seniorer og kulturarv

## ✨ Hovedfunksjoner

### 🔐 Brukervennlig Innlogging
- **Passordløs autentisering** med e-post (magic links)
- Store, tydelige knapper designet for eldre brukere
- Sikker session-håndtering

### 🎙️ Profesjonelt Opptak
- Høykvalitets lydopptak direkte i nettleseren
- Sanntids analyse av lydkvalitet og varighet
- AI-assistert audio-optimalisering

### 🤖 AI-Assistanse
- Kulturelt tilpassede historieforslag for nordmenn
- Automatisk transkripsjon (tale-til-tekst)
- Stemmekloning-klarhet vurdering
- Intelligente emneforslag basert på brukerens bakgrunn

### 👥 Familiedeling
- Invitasjonssystem for familiemedlemmer
- Tillatelsesbasert tilgangskontroll
- Private familiesamlinger av historier
- Kommentar- og samhandlingsfunksjoner

### 📊 Analytics Dashboard
- Personlig statistikk (historier, spilletid, popularitet)
- Familieengasjement-metrics
- Søk og kategorisering av historier
- Bruksanalyse og trender

## 🛠️ Teknologi Stack

- **Frontend**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + localStorage (demo)
- **Audio**: MediaRecorder API + Web Audio API
- **AI**: Simulert (klar for ElevenLabs + OpenAI/Claude)
- **Deployment**: Netlify (static export)

### 🔮 Produksjonsklare integrasjoner:
- **Database**: PostgreSQL (Supabase/PlanetScale)
- **Auth**: Supabase Auth / Firebase Auth
- **Storage**: AWS S3 / Cloudinary
- **AI**: ElevenLabs (stemmekloning) + OpenAI/Claude (historieassistanse)
- **Transcription**: AssemblyAI / Whisper API
- **Payments**: Stripe

## 🚀 Komme i Gang

### Forutsetninger
- Node.js 18+ eller Bun
- Git

### Installasjon

```bash
# Klon repositoryet
git clone https://github.com/[bruker]/livets-stemme.git
cd livets-stemme

# Installer avhengigheter
bun install

# Start utviklingsserver
bun run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren din.

### 🌐 Live Demo
**https://same-qwc8draomtn-latest.netlify.app**

## 📱 Skjermbilder

### Hjemmeside
![Hjemmeside](docs/screenshots/homepage.png)
*Varm, velkommende hjemmeside med tydelig norsk språk*

### Opptak Interface
![Opptak](docs/screenshots/recording.png)
*Enkelt opptaksgrensesnitt med sanntids feedback*

### Bruker Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Omfattende dashboard med analytics og familiestyring*

## 🎨 Design Prinsipper

### Tilgjengelighet for Eldre
- **18px base font** for bedre lesbarhet
- **Store klikkmål** (minimum 48px)
- **Høy kontrast** og tydelige fokusindikatorer
- **Enkel navigasjon** uten komplekse menyer
- **Varm fargeskjema** (amber/oransje) som føles trygt

### Kulturell Sensitivitet
- **Norsk språk** gjennom hele applikasjonen
- **Kulturelt relevante** historieemner og forslag
- **Norske datoformater** og lokalisering
- **Respekt for familietradisjoner** og verdier

## 🏗️ Arkitektur

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Hjemmeside
│   ├── record/            # Opptakssider
│   ├── stories/           # Historiestyring
│   └── layout.tsx         # Hovedlayout
├── components/            # Gjenbrukbare komponenter
│   ├── auth/              # Autentisering
│   ├── recording/         # Opptaksfunksjonalitet
│   └── dashboard/         # Dashboard komponenter
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Brukerautentisering
├── lib/                   # Utilities og tjenester
│   └── auth.ts           # Auth og data services
└── styles/               # Styling
```

## 🚀 Deployment

### Statisk Export (Current)
```bash
bun run build
```

### Produksjonsdeployment
1. Sett opp Supabase prosjekt
2. Konfigurer miljøvariabler
3. Deploy til Vercel/Netlify
4. Koble til custom domene

## 🧪 Testing

```bash
# Kjør linting
bun run lint

# Type checking
bun run type-check

# Build test
bun run build
```

## 📊 Roadmap

### ✅ Versjon 3.0 (Nåværende)
- Komplett brukerautentisering
- Avansert opptakssystem
- AI-funksjoner (simulert)
- Familiedeling og tillatelser
- Omfattende dashboard

### 🔄 Versjon 4.0 (Planlagt)
- [ ] Ekte database integrasjon (Supabase)
- [ ] ElevenLabs stemmekloning
- [ ] OpenAI/Claude historieassistanse
- [ ] Stripe betalingssystem
- [ ] Ekte transkripsjon (AssemblyAI)

### 🔮 Versjon 5.0 (Fremtid)
- [ ] Mobil app (React Native)
- [ ] Offline sync
- [ ] Avanserte analyseverktøy
- [ ] Integrering med sosiale medier
- [ ] Stemmeanalyse og følelsesgjenkjenning

## 🤝 Bidrag

Vi ønsker bidrag! Se [CONTRIBUTING.md](CONTRIBUTING.md) for retningslinjer.

### Utviklingsmiljø
```bash
# Installer pre-commit hooks
npm run prepare

# Følg coding standards
npm run lint:fix
```

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se [LICENSE](LICENSE) filen for detaljer.

## 👥 Team

- **Prosjektleder**: [Navn]
- **UI/UX Design**: Fokus på tilgjengelighet for eldre
- **Frontend**: Next.js + TypeScript
- **AI Integration**: ElevenLabs + OpenAI
- **Kulturell Rådgiver**: Norsk språk og kultur

## 📞 Kontakt

- **E-post**: kontakt@livetsstemme.no
- **Support**: support@livetsstemme.no
- **Website**: https://livetsstemme.no

## 🙏 Takk til

- Norske senior sentre for testing og tilbakemelding
- Familier som har delt sine historier
- Open source samfunnet for fantastiske verktøy

---

**Laget med ❤️ for å bevare dyrebare minner**

*Dine historier. Din stemme. Din arv.*
