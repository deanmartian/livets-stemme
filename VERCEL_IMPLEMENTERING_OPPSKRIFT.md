# 🍳 Vercel Deployment Oppskrift - Livets Stemme

En enkel, steg-for-steg guide for å få "Livets Stemme" live på Vercel på 30 minutter.

## 📋 Du trenger:

- GitHub konto (gratis)
- Vercel konto (gratis)
- Supabase konto (gratis)
- 30 minutter tid

## 🥇 STEG 1: Klon Repository (2 min)

```bash
# 1. Klon prosjektet
git clone https://github.com/deanmartian/livets-stemme.git
cd livets-stemme

# 2. Installer dependencies
bun install

# 3. Test at alt fungerer lokalt
bun run build
bun run dev
```

✅ **Sjekk**: Åpne http://localhost:3000 - du skal se "Livets Stemme" hjemmeside

---

## 🗄️ STEG 2: Sett opp Supabase Database (8 min)

### 2.1 Opprett Supabase prosjekt:
1. Gå til [supabase.com](https://supabase.com)
2. Klikk **"New project"**
3. Navn: `livets-stemme`
4. Passord: Lag et sterkt passord (noter det!)
5. Region: **Europe** (nærmest Norge)
6. Klikk **"Create new project"**

### 2.2 Kjør Database Schema:
1. Gå til **"SQL Editor"** (i venstre meny)
2. Klikk **"New query"**
3. Kopier alt innhold fra `supabase/schema.sql`
4. Lim inn og klikk **"Run"**
5. ✅ Du skal se: "Livets Stemme database schema created successfully!"

### 2.3 Opprett Storage:
1. Gå til **"Storage"**
2. Klikk **"Create bucket"**
3. Name: `audio-files`
4. Public: **OFF** (private)
5. Klikk **"Create bucket"**

### 2.4 Hent API Keys:
1. Gå til **"Settings"** → **"API"**
2. Kopier disse (du trenger dem senere):
   - **Project URL** (https://xxx.supabase.co)
   - **anon public key** (eyJhbGciOiJIUzI1NiIs...)
   - **service_role key** (eyJhbGciOiJIUzI1NiIs...)

---

## 🚀 STEG 3: Deploy til Vercel (10 min)

### 3.1 Push til GitHub (hvis ikke gjort):
```bash
# Hvis du ikke har pushet til GitHub ennå:
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 3.2 Connect til Vercel:
1. Gå til [vercel.com](https://vercel.com)
2. Logg inn med GitHub
3. Klikk **"New Project"**
4. **Import Git Repository** → Velg `livets-stemme`
5. **Framework Preset**: Next.js (automatisk)
6. **Root Directory**: `./` (standard)
7. **IKKE** klikk Deploy ennå!

### 3.3 Legg til Environment Variables:
I Vercel dashboard, før deploy:

1. Klikk **"Environment Variables"**
2. Legg til disse (en og en):

```bash
# Påkrevde variabler:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
NEXTAUTH_SECRET=en-lang-tilfeldig-streng-minst-32-tegn
NEXTAUTH_URL=https://your-app.vercel.app

# Valgfrie (for AI - kan legges til senere):
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. **Environment**: Velg **Production** for alle
4. Klikk **"Deploy"**

---

## ✅ STEG 4: Test Deployment (5 min)

### 4.1 Vent på deployment:
- Vercel vil bygge appen (2-3 minutter)
- Du får en URL: `https://livets-stemme-xxx.vercel.app`

### 4.2 Test grunnleggende funksjonalitet:
1. **Åpne din Vercel URL**
2. **Test navigasjon**: Klikk rundt på sidene
3. **Test registrering**: Prøv å lage konto med din e-post
4. **Test health check**: Gå til `/api/health`
5. **Test admin side**: Gå til `/admin/vercel-status`

### 4.3 Fiks Supabase Auth:
1. Gå tilbake til Supabase dashboard
2. **Authentication** → **URL Configuration**
3. **Site URL**: `https://din-app.vercel.app`
4. **Redirect URLs**: `https://din-app.vercel.app/auth/callback`

---

## 🎯 STEG 5: Aktivér AI Tjenester (valgfritt, 5 min)

### 5.1 OpenAI (for historieforslag):
1. Gå til [platform.openai.com](https://platform.openai.com)
2. Opprett konto og få API key
3. Legg til i Vercel: `OPENAI_API_KEY=sk-...`

### 5.2 ElevenLabs (for stemmekloning):
1. Gå til [elevenlabs.io](https://elevenlabs.io)
2. Opprett konto og få API key
3. Legg til i Vercel: `ELEVENLABS_API_KEY=...`

### 5.3 Redeploy:
- Gå til Vercel dashboard
- Klikk **"Redeploy"** for å aktivere nye API keys

---

## 🏆 FERDIG! Din app er live!

**🔗 Din app**: `https://livets-stemme-xxx.vercel.app`

### Test disse funksjonene:
- ✅ **Registrering**: Opprett konto med ekte e-post
- ✅ **Opptak**: Test lydopptak (gi mikrofontilgang)
- ✅ **AI Forslag**: Test historieforslag (hvis OpenAI aktivert)
- ✅ **Familiedeling**: Inviter familiemedlem
- ✅ **Admin Panel**: `/admin/vercel-status`

---

## 🔧 Feilsøking

### Problem: "Build failed"
```bash
# Lokalt test:
bun run build

# Hvis feil: sjekk environment variables i Vercel
```

### Problem: "Auth ikke fungerer"
```bash
# Sjekk Supabase Auth URLs:
# Site URL: https://din-app.vercel.app
# Redirect: https://din-app.vercel.app/auth/callback
```

### Problem: "API routes 404"
```bash
# Sjekk at next.config.js IKKE har 'output: export'
# API routes krever server-side rendering
```

### Problem: "Database tilkobling feil"
```bash
# Test Supabase credentials:
# 1. Riktig Project URL?
# 2. Riktig anon key?
# 3. Service role key satt?
```

---

## 🎨 Tilpass Din App

### Endre domene (valgfritt):
1. Vercel dashboard → **Settings** → **Domains**
2. Legg til din domain (f.eks. `mittfamilienavn.no`)
3. Oppdater DNS som Vercel viser

### Legg til Stripe betalinger:
1. Opprett [Stripe konto](https://stripe.com)
2. Få test API keys
3. Legg til i Vercel environment variables
4. Test med testkort: `4242 4242 4242 4242`

### Overvåking:
```bash
# Se Vercel logs:
vercel logs din-app.vercel.app

# Real-time logs:
vercel logs --follow
```

---

## 🎉 Gratulerer!

Du har nå en fullt fungerende norsk minnearkiv-app live på internett!

### Neste steg:
1. **Test med venner/familie**
2. **Samle tilbakemelding**
3. **Legg til AI-tjenester** (OpenAI, ElevenLabs)
4. **Sett opp betalinger** (Stripe)
5. **Markedsfør** til norske seniorer

---

## 📞 Trenger hjelp?

### Vercel Support:
- [Vercel Docs](https://vercel.com/docs)
- [Discord Community](https://discord.gg/vercel)

### Supabase Support:
- [Supabase Docs](https://supabase.com/docs)
- [Discord Community](https://discord.supabase.com)

### Prosjekt Support:
- **GitHub Issues**: [github.com/deanmartian/livets-stemme/issues](https://github.com/deanmartian/livets-stemme/issues)
- **Dokumentasjon**: Se `README.md` og `VERCEL_DEPLOYMENT_GUIDE.md`

---

**🎯 Din "Livets Stemme" app er nå live og klar til å bevare norske familiehistorier! 🇳🇴**

**Total tid brukt**: ~30 minutter
**Månedlige kostnader**: 0 kr (med gratis tiers)
**Kapasitet**: Hundrevis av brukere
