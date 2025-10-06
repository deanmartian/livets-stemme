# 🚀 Vercel Deployment Guide - Livets Stemme

Denne guiden viser hvordan du deployer "Livets Stemme" til Vercel med alle AI-tjenester og betalingssystemet.

## 📋 Forutsetninger

### 1. Kontoer som kreves:
- [Vercel konto](https://vercel.com) (gratis)
- [Supabase konto](https://supabase.com) (gratis tier)
- [OpenAI konto](https://openai.com) (for AI-assistanse)
- [ElevenLabs konto](https://elevenlabs.io) (for stemmekloning)
- [Stripe konto](https://stripe.com) (for betalinger)
- GitHub repository (allerede opprettet)

## 🚀 Steg 1: Forbered Vercel Deployment

### Installer Vercel CLI:
```bash
# Installer Vercel CLI globalt
npm i -g vercel

# Eller med bun
bun add -g vercel

# Logg inn på Vercel
vercel login
```

### Sjekk at prosjektet er konfigurert riktig:
```bash
cd voice-of-lifetime

# Sjekk at next.config.js IKKE har 'output: export'
cat next.config.js

# Sjekk at vercel.json er oppdatert
cat vercel.json

# Test build lokalt
bun run build
```

## 🗄️ Steg 2: Sett opp Supabase Database

### Opprett Supabase prosjekt:
1. Gå til [supabase.com](https://supabase.com)
2. Klikk **"New project"**
3. Fyll ut:
   - **Name**: `livets-stemme`
   - **Database Password**: Lag et sterkt passord
   - **Region**: Europe (nærmest Norge)

### Kjør Database Schema:
1. Gå til **SQL Editor** i Supabase
2. Kopier innholdet fra `supabase/schema.sql`
3. Kjør scriptet for å opprette tabeller og policies

### Opprett Storage Bucket:
1. Gå til **Storage** → **Create bucket**
2. Name: `audio-files`, Public: OFF (private)

### Hent Supabase Credentials:
1. Gå til **Settings** → **API**
2. Kopier:
   - Project URL
   - anon public key
   - service_role key (secret!)

## 🔑 Steg 3: Sett opp Environment Variables

### Opprett .env.local for testing:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# NextAuth
NEXTAUTH_SECRET=your-long-random-string-here
NEXTAUTH_URL=https://your-app.vercel.app

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Products (create these in Stripe Dashboard)
STRIPE_PREMIUM_PRICE_ID=price_premium_monthly_nok
STRIPE_FAMILY_PRICE_ID=price_family_monthly_nok

# App Config
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## 🚀 Steg 4: Deploy til Vercel

### Via Vercel CLI (anbefalt for første gang):
```bash
cd voice-of-lifetime

# Deploy til preview først
vercel

# Følg instruksjonene:
# - Link to existing project? No
# - Project name: livets-stemme
# - Directory: ./
# - Override settings? No
```

### Via GitHub Integration:
1. Gå til [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klikk **"New Project"**
3. **Import Git Repository** → Velg `livets-stemme`
4. **Configure Project**:
   - Framework Preset: `Next.js`
   - Build Command: `bun run build`
   - Install Command: `bun install`
   - Root Directory: `./`

## ⚙️ Steg 5: Konfigurer Environment Variables i Vercel

### Via Vercel Dashboard:
1. Gå til ditt prosjekt på Vercel
2. **Settings** → **Environment Variables**
3. Legg til alle variabler fra .env.local:

```bash
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.vercel.app

OPENAI_API_KEY=sk_your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

STRIPE_SECRET_KEY=sk_live_your_stripe_live_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

STRIPE_PREMIUM_PRICE_ID=price_live_premium_nok
STRIPE_FAMILY_PRICE_ID=price_live_family_nok

NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Via CLI (alternativ):
```bash
# Sett environment variables via CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
# ... osv for alle variabler
```

## 🔧 Steg 6: Konfigurer Eksterne Tjenester

### Supabase Auth Settings:
1. Gå til **Authentication** → **URL Configuration**
2. **Site URL**: `https://your-app.vercel.app`
3. **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/api/auth/callback/supabase
   ```

### Stripe Webhooks:
1. Gå til Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint**: `https://your-app.vercel.app/api/webhooks/stripe`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## ✅ Steg 7: Test Deployment

### Test API Routes:
```bash
# Test AI story prompts
curl "https://your-app.vercel.app/api/ai/story-prompts?category=Familie"

# Test health check
curl "https://your-app.vercel.app/api/health"
```

### Test i nettleseren:
1. Gå til din Vercel URL
2. Test registrering med ekte e-post
3. Test opptak (gi mikrofontilgang)
4. Test AI-forslag
5. Test Stripe betalinger (bruk test kort: 4242 4242 4242 4242)

## 🎯 Steg 8: Produksjonsoppsett

### Custom Domain (valgfritt):
1. **Vercel Dashboard** → **Settings** → **Domains**
2. Legg til din domain (f.eks. `livetsstemme.no`)
3. Oppdater DNS records som Vercel viser
4. Oppdater environment variables med ny URL

### Performance Monitoring:
```bash
# Legg til Vercel Analytics
bun add @vercel/analytics

# I layout.tsx:
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="nb">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Monitoring:
```bash
# Legg til Sentry (valgfritt)
bun add @sentry/nextjs

# Konfigurer sentry.client.config.js og sentry.server.config.js
```

## 🚨 Feilsøking

### Vanlige problemer:

#### Build feil:
```bash
# Sjekk at alle dependencies er installert
bun install

# Test build lokalt
bun run build

# Sjekk TypeScript feil
bun run type-check
```

#### API Routes fungerer ikke:
```bash
# Sjekk at next.config.js IKKE har 'output: export'
# Sjekk at vercel.json har riktige function timeouts
# Sjekk environment variables i Vercel dashboard
```

#### Database tilkobling feil:
```bash
# Sjekk Supabase URL og keys
# Test lokalt med samme env vars
# Sjekk at RLS policies tillater tilgang
```

#### AI/Stripe API feil:
```bash
# Sjekk API keys i environment variables
# Test API keys lokalt først
# Sjekk rate limits og kvotær
```

## 📊 Monitoring og Vedlikehold

### Vercel Analytics:
- Automatisk performance tracking
- Real User Monitoring (RUM)
- Web Vitals metrics

### Logs og Debugging:
```bash
# Se Vercel function logs
vercel logs your-app.vercel.app

# Real-time logs
vercel logs --follow
```

### Database Monitoring:
- Supabase Dashboard for database metrics
- Query performance og connection pooling
- Storage usage for audio files

## 🔄 Continuous Deployment

### Automatic Deployments:
1. **Production**: Deployes automatisk ved push til `main` branch
2. **Preview**: Deployes automatisk for pull requests
3. **Environment**: Production/Preview har separate environment variables

### Deployment Hooks:
```bash
# Deploy hook for external services
curl -X POST "https://api.vercel.com/v1/integrations/deploy/..."
```

## 💡 Best Practices

### Performance:
- Optimaliser bilder med Next.js Image component
- Bruk Vercel Edge Functions for rask respons
- Cache API responses der mulig

### Sikkerhet:
- Bruk environment variables for alle secrets
- Aktiver HTTPS redirect og security headers
- Valider alle input på server-side

### Monitoring:
- Sett opp alerts for error rates
- Monitor response times for API routes
- Track business metrics (registreringer, betalinger)

---

## ✅ Deployment Sjekkliste

### Pre-deployment:
- [ ] Alle environment variables satt
- [ ] Supabase database schema kjørt
- [ ] Storage bucket opprettet
- [ ] Stripe produkter og webhooks konfigurert
- [ ] next.config.js oppdatert (ingen 'output: export')
- [ ] Local build test passert

### Deployment:
- [ ] Vercel prosjekt opprettet og deployet
- [ ] Environment variables satt i Vercel
- [ ] Custom domain konfigurert (hvis ønsket)
- [ ] DNS records oppdatert

### Post-deployment:
- [ ] Alle API routes testet
- [ ] Auth flow testet med ekte e-post
- [ ] AI funksjoner testet
- [ ] Stripe betalinger testet
- [ ] Performance metrics overvåket

---

## 🎉 Gratulerer!

"Livets Stemme" kjører nå i produksjon på Vercel!

**Din app er tilgjengelig på**: `https://your-app.vercel.app`

### Neste steg:
1. **Test grundig** med ekte brukere
2. **Markedsfør** til norske seniorer
3. **Overvåk** metrics og bruker-feedback
4. **Iterer** basert på tilbakemelding

**🎯 Lykke til med lanseringen av Norges første AI-drevne minnearkiv! 🇳🇴**
