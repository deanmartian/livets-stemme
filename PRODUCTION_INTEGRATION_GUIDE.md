# 🚀 Produksjonsintegrasjon Guide - Livets Stemme

Denne guiden viser hvordan du integrerer AI-tjenester, betalingssystem og brukertesting for "Livets Stemme".

## 🤖 1. AI-Tjenester Integrasjon

### 1.1 ElevenLabs Stemmekloning

#### Setup:
```bash
# Installer ElevenLabs pakke
bun add elevenlabs

# Legg til environment variabler
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

#### Implementering:
```typescript
// src/lib/elevenlabs.ts er allerede opprettet
import { ElevenLabsService } from '@/lib/elevenlabs'

// Bruk i komponenter:
const handleVoiceClone = async () => {
  const result = await fetch('/api/voice/clone', {
    method: 'POST',
    body: formData // Med audiofiler
  })
}
```

#### Prisstruktur ElevenLabs:
- **Gratis**: 10,000 karakterer/måned
- **Starter ($5)**: 30,000 karakterer/måned + voice cloning
- **Creator ($22)**: 100,000 karakterer/måned + instant voice cloning
- **Pro ($99)**: 500,000 karakterer/måned + professional voice cloning

### 1.2 OpenAI Historieassistanse

#### Setup:
```bash
# Installer OpenAI pakke
bun add openai

# Environment variabler
OPENAI_API_KEY=your_openai_api_key
```

#### Implementering:
```typescript
// Generer historieforslag
const prompts = await fetch('/api/ai/story-prompts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    category: 'Barndom & Oppvekst',
    context: { userAge: 72, region: 'Norge' }
  })
})
```

#### OpenAI Kostnad Estimat:
- **GPT-4**: ~$0.03 per 1K tokens (historieforslag)
- **Whisper**: $0.006 per minutt (transkripsjon)
- **Månedlig bruk (100 brukere)**: ~$50-100

---

## 💳 2. Stripe Betalingssystem

### 2.1 Oppsett av Stripe

#### Registrering og Setup:
```bash
# Installer Stripe
bun add stripe

# Stripe CLI for testing
brew install stripe/stripe-cli/stripe
stripe login
```

#### Environment Variabler:
```bash
# .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Produkter (opprett i Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_premium_month_nok
STRIPE_FAMILY_PRICE_ID=price_family_month_nok
```

### 2.2 Norske Priser og MVA

```typescript
// Pricing i NOK (inkl. 25% MVA)
const subscriptionPlans = [
  {
    name: 'Gratis',
    price: 0,
    features: ['3 historier/måned', 'Standard kvalitet']
  },
  {
    name: 'Premium',
    price: 149, // ~$14 USD
    features: ['Ubegrenset historier', 'AI-assistanse', 'Stemmekloning']
  },
  {
    name: 'Familie',
    price: 249, // ~$23 USD
    features: ['Alt i Premium', '10 familiekontoer', 'Familie-dashboard']
  }
]
```

### 2.3 Betalingsflyt

```typescript
// Frontend: Start betalingsprosess
const handleSubscribe = async (priceId: string) => {
  const response = await fetch('/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      customerEmail: user.email,
      customerName: user.name,
      successUrl: window.location.origin + '/success',
      cancelUrl: window.location.origin + '/pricing'
    })
  })

  const { sessionId } = await response.json()

  // Redirect til Stripe Checkout
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  await stripe?.redirectToCheckout({ sessionId })
}
```

### 2.4 Webhook Håndtering

```bash
# Test webhooks lokalt
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Verifiser webhook i produksjon
curl -X POST https://your-app.vercel.app/api/webhooks/stripe \
  -H "stripe-signature: test_signature" \
  -d "test_payload"
```

---

## 👥 3. Brukertesting Implementering

### 3.1 Rekruttering av Testbrukere

#### Praktisk Plan:
```markdown
Uke 1-2: Rekruttering
- Kontakt 15 seniorsentre i Norge
- Post i Facebook grupper for seniorer
- Ring lokale bibliotek og pensjonistforeninger
- Mål: Rekruttere 15-20 deltakere

Uke 3-4: Testing Runde 1
- 8 hjemmebesøk (Oslo, Bergen, Trondheim, Stavanger)
- 4 senter-baserte tester
- 1-2 digitale tester via video

Uke 5: Analyse og Forbedringer
- Analyser resultater
- Implementer kritiske forbedringer
- Forbered neste runde

Uke 6-7: Testing Runde 2
- Test forbedringer med 6-8 nye deltakere
- Valider endringene
```

### 3.2 Testing Infrastructure

#### Feedback Portal i App:
```typescript
// src/components/testing/FeedbackWidget.tsx
export function FeedbackWidget() {
  const [showFeedback, setShowFeedback] = useState(false)

  const submitFeedback = async (feedback: TestingFeedback) => {
    await fetch('/api/testing/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...feedback,
        userId: user.id,
        timestamp: new Date().toISOString(),
        url: window.location.pathname
      })
    })
  }

  // Widget som følger brukeren gjennom appen
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={() => setShowFeedback(true)}>
        💬 Tilbakemelding
      </Button>
      {showFeedback && (
        <FeedbackForm onSubmit={submitFeedback} />
      )}
    </div>
  )
}
```

#### Automatisk Datainnsamling:
```typescript
// src/lib/testing-analytics.ts
export function trackUserAction(action: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Testing Action:', action, data)

    // Send til testing database
    fetch('/api/testing/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        data,
        timestamp: Date.now(),
        userId: getCurrentUserId(),
        sessionId: getSessionId()
      })
    })
  }
}

// Bruk i komponenter:
const handleRecordStart = () => {
  trackUserAction('recording_started', {
    duration: 0,
    category: selectedCategory
  })
  startRecording()
}
```

### 3.3 Testing Logistikk

#### Budsjett og Planlegging:
```
Kostnad per deltaker:
- Kompensasjon: 500 kr
- Reise (hjemmebesøk): 300 kr
- Tester honorar: 600 kr
- Materiell: 100 kr
Total: 1,500 kr per deltaker

For 20 deltakere: 30,000 kr

Utstyr nødvendig:
- Laptop med skjermopptak software
- Mobil kamera på stativ
- Notisblokk og skrivesaker
- Power bank og ladere
- Kontanter for kompensasjon
```

#### Rekrutteringsmal (Praktisk):
```
Emne: Test ny norsk app for livshistorier - 500 kr kompensasjon

Hei [Navn],

Vi utvikler "Livets Stemme" - en app som hjelper deg bevare livshistoriene dine for familien, og vi trenger din hjelp til å teste den.

Hva innebærer det?
- 1-2 timer testing (hjemme hos deg eller på [lokalt senter])
- Du prøver appen mens vi observerer og noterer
- Ingen krav til teknisk kunnskap
- 500 kr kompensasjon + gratis tilgang i 6 måneder

Interessert?
Ring meg på [telefon] eller svar på denne e-posten.

Med vennlig hilsen,
[Navn] fra Livets Stemme
```

---

## 🔄 4. Sammenstilling og Deployment

### 4.1 Environment Variabler (Komplett)

```bash
# .env.local (Produksjon)

# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=your_elevenlabs_key

# Payments
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_FAMILY_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_BASE_URL=https://livetsstemme.no
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://livetsstemme.no

# Optional: Analytics & Monitoring
VERCEL_ANALYTICS_ID=your_analytics_id
SENTRY_DSN=your_sentry_dsn

# Testing (kun for staging)
ENABLE_TESTING_FEATURES=true
TESTING_DATABASE_URL=your_testing_db_url
```

### 4.2 Deployment Prosess

#### Steg 1: Supabase Setup
```bash
# 1. Kjør database schema
# - Gå til Supabase SQL Editor
# - Kjør supabase/schema.sql

# 2. Opprett storage bucket
# - Gå til Storage i Supabase
# - Opprett "audio-files" bucket (private)

# 3. Sett opp authentication
# - Konfigurer magic link e-post templates på norsk
# - Legg til produksjons-URL i redirect URLs
```

#### Steg 2: Stripe Konfigurering
```bash
# 1. Opprett produkter i Stripe Dashboard
stripe products create --name="Livets Stemme Premium" --description="AI-assistanse og ubegrenset historier"

# 2. Opprett priser i NOK
stripe prices create --product=prod_xxx --currency=nok --unit-amount=14900 --recurring='{"interval":"month"}'

# 3. Sett opp webhooks
# - Legg til webhook endpoint: https://your-app.vercel.app/api/webhooks/stripe
# - Velg events: checkout.session.completed, customer.subscription.*
```

#### Steg 3: Vercel Deployment
```bash
# Deploy til Vercel
vercel --prod

# Sett environment variabler i Vercel Dashboard
# Test at alle API routes fungerer
curl https://your-app.vercel.app/api/ai/story-prompts?category=Familie
```

### 4.3 Testing i Produksjon

```bash
# 1. Test AI funksjoner
curl -X POST https://your-app.vercel.app/api/ai/story-prompts \
  -H "Content-Type: application/json" \
  -d '{"category":"Barndom & Oppvekst"}'

# 2. Test Stripe betalinger (test mode)
# - Bruk test card: 4242 4242 4242 4242
# - Verifiser webhook mottak

# 3. Test stemmekloning
# - Upload test lydfil
# - Sjekk ElevenLabs dashboard

# 4. Test med ekte brukere
# - Beta-testing med 5-10 venner/familie først
# - Samle tilbakemelding før full lansering
```

---

## 📊 5. Overvåking og Analyse

### 5.1 Sentrale Metrics

```typescript
// Analytics å spore:
const keyMetrics = {
  // Business Metrics
  activeUsers: 'DAU/MAU',
  subscriptionConversion: 'Free → Premium %',
  churnRate: 'Månedlig kundetap',

  // Product Metrics
  storiesCreated: 'Antall historier per bruker',
  familyShares: 'Andel som deler med familie',
  aiUsage: 'Bruk av AI-assistanse',

  // Technical Metrics
  audioQuality: 'Gjennomsnittlig opptakskvalitet',
  transcriptionAccuracy: 'Whisper nøyaktighet',
  voiceCloningSuccess: 'ElevenLabs suksessrate'
}
```

### 5.2 Norsk Markedsføring

```markdown
Markedsføringskanaler for Norge:

1. Digital:
   - Google Ads (norske søkeord)
   - Facebook Ads (55+ targeting)
   - Samarbeid med senior.no
   - SEO for "livshistorier", "digital minnebok"

2. Tradisjonell:
   - Lokalaviser (annonser + PR)
   - Radio lokaloppslag
   - Pensjonistforeninger
   - Bibliotek og kulturhus

3. Partnerskap:
   - Helsenorge.no
   - Seniorportaler
   - Lokalhistoriske lag
   - Slektsforskerforeninger
```

---

## ✅ 6. Lansering Sjekkliste

### Pre-Launch (2 uker før):
- [ ] Alle API-integrasjoner testet i produksjon
- [ ] Norsk støtte/FAQ dokumentasjon klar
- [ ] Stripe betalinger og webhooks verifisert
- [ ] Brukertesting runde 2 fullført og analyser implementert
- [ ] GDPR/personvern policy på norsk
- [ ] Kundeservice e-post (support@livetsstemme.no) satt opp

### Launch Day:
- [ ] Monitorer error rates og ytelse
- [ ] Test alle kritiske brukerflyt
- [ ] Ha support tilgjengelig på norsk
- [ ] Social media og PR klar for aktivering

### Post-Launch (første uke):
- [ ] Daglig overvåking av metrics
- [ ] Samle bruker-feedback aktivt
- [ ] Fiks kritiske bugs innen 24 timer
- [ ] Planlegg neste iterasjon basert på data

---

**🎯 Med disse integrasjonene er "Livets Stemme" klar for å bli en førende plattform for å bevare norske livshistorier!**

**Total estimert utviklingstid**: 6-8 uker
**Total kostnad (utvikling + testing)**: ~150,000-200,000 kr
**Månedlige driftskostnader**: ~10,000-15,000 kr (AI + hosting + support)

---

**Repository**: https://github.com/deanmartian/livets-stemme
**Live Demo**: https://same-qwc8draomtn-latest.netlify.app
