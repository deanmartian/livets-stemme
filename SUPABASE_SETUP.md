# 🗄️ Supabase Setup Guide - Livets Stemme

Denne guiden hjelper deg med å sette opp Supabase database for "Livets Stemme" på 10 minutter.

## 🚀 Steg 1: Opprett Supabase Konto

1. **Gå til [supabase.com](https://supabase.com)**
2. **Klikk "Start your project"**
3. **Logg inn med GitHub** (anbefalt) eller opprett ny konto
4. **Godkjenn tilganger** til GitHub hvis nødvendig

## 📁 Steg 2: Opprett Nytt Prosjekt

1. **Klikk "New project"** på dashboard
2. **Fyll ut prosjektdetaljer:**
   ```
   Organization: [Velg din organization]
   Name: livets-stemme
   Database Password: [Lag et sterkt passord - noter det ned!]
   Region: Europe (eu-west-1) - nærmest Norge
   ```
3. **Klikk "Create new project"**
4. **⏳ Vent 2-3 minutter** mens Supabase setter opp databasen

## 🗃️ Steg 3: Sett opp Database Schema

1. **Gå til "SQL Editor"** i venstre meny
2. **Klikk "New query"**
3. **Kopier innholdet** fra `supabase/schema.sql` filen
4. **Lim inn i SQL editoren**
5. **Klikk "Run"** (eller Ctrl+Enter)
6. **✅ Verifiser:** Du skal se meldingen "Livets Stemme database schema created successfully!"

### 🔍 Verifiser Database Tabeller
1. **Gå til "Table Editor"**
2. **Sjekk at disse tabellene finnes:**
   - `user_profiles`
   - `stories`
   - `family_members`

## 📁 Steg 4: Sett opp Storage Bucket

1. **Gå til "Storage"** i venstre meny
2. **Klikk "Create bucket"**
3. **Fyll ut:**
   ```
   Name: audio-files
   Public: OFF (private bucket)
   ```
4. **Klikk "Create bucket"**

### 🔒 Sett Storage Policies
1. **Klikk på "audio-files" bucket**
2. **Gå til "Policies" tab**
3. **Klikk "New policy"**
4. **Velg "Custom" og lim inn:**

```sql
-- Users can upload their own audio files
CREATE POLICY "Users can upload own audio files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'audio-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own audio files
CREATE POLICY "Users can view own audio files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'audio-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own audio files
CREATE POLICY "Users can update own audio files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'audio-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own audio files
CREATE POLICY "Users can delete own audio files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'audio-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

5. **Klikk "Save policy"**

## 🔐 Steg 5: Konfigurer Authentication

1. **Gå til "Authentication"** → **"Settings"**
2. **Under "Site URL":**
   ```
   Site URL: http://localhost:3000
   ```
3. **Under "Redirect URLs" legg til:**
   ```
   http://localhost:3000/auth/callback
   https://your-app.vercel.app/auth/callback
   ```
4. **Under "Email Auth":**
   - ✅ Enable email confirmations: ON
   - ✅ Enable email change confirmations: ON
   - ✅ Secure email change: ON

### 📧 Konfigurer Email Templates (Valgfritt)
1. **Gå til "Auth" → "Email Templates"**
2. **Rediger "Magic Link" template til norsk:**

```html
<h2>Logg inn på Livets Stemme</h2>
<p>Hei!</p>
<p>Klikk på lenken under for å logge inn trygt på Livets Stemme:</p>
<p><a href="{{ .ConfirmationURL }}">Logg inn</a></p>
<p>Eller kopier og lim inn denne lenken i nettleseren din:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Denne lenken er gyldig i 60 minutter.</p>
<p>Med vennlig hilsen,<br>Livets Stemme</p>
```

## 🔑 Steg 6: Hent API Nøkler

1. **Gå til "Settings"** → **"API"**
2. **Kopier følgende verdier:**

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Public anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Service role key (secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

3. **Opprett `.env.local` fil:**
```bash
cd voice-of-lifetime
cp .env.example .env.local
```

4. **Rediger `.env.local` med dine verdier:**
```bash
# Lim inn dine ekte verdier her
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# NextAuth secret (generer en random string)
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## ✅ Steg 7: Test Setup

### 🧪 Test Database Tilkobling
1. **Åpne terminal i prosjektmappen:**
```bash
cd voice-of-lifetime
bun install
bun run dev
```

2. **Gå til http://localhost:3000**
3. **Klikk "Logg Inn"**
4. **Skriv inn din e-postadresse**
5. **Sjekk e-posten din** for magic link
6. **Klikk på lenken** - du skal bli logget inn!

### 🔍 Verifiser i Supabase Dashboard
1. **Gå til "Authentication" → "Users"**
2. **Du skal se din nye bruker** i listen
3. **Gå til "Table Editor" → "user_profiles"**
4. **Du skal se din brukerprofil** ble opprettet automatisk

## 🎯 Steg 8: Test Full Funksjonalitet

### Test Opptak og Lagring:
1. **Logg inn på nettsiden**
2. **Gå til "Start Opptak"**
3. **Ta opp en kort testhistorie**
4. **Lagre historien**
5. **Sjekk "Mine Historier"** - historien skal være der!

### Verifiser i Database:
1. **Gå til Supabase "Table Editor" → "stories"**
2. **Du skal se den nye historien** i tabellen

## 🔧 Feilsøking

### ❌ "Invalid API key" feil:
- Sjekk at du kopierte riktig anon key
- Kontroller at `.env.local` filen har riktig format
- Restart dev server: `Ctrl+C` og `bun run dev`

### ❌ "RLS policy violation" feil:
- Sjekk at RLS policies ble opprettet korrekt
- Kjør SQL schema på nytt hvis nødvendig

### ❌ Magic link ikke fungerer:
- Sjekk at redirect URLs er korrekt satt
- Kontroller spam/søppelpost
- Verifiser at site URL er riktig

### ❌ Audio upload feiler:
- Sjekk at storage bucket finnes
- Verifiser storage policies
- Kontroller at bucket er private (ikke public)

## 📊 Database Oversikt

### Tabeller som ble opprettet:
- **`user_profiles`**: Brukerinfo og preferanser
- **`stories`**: Lydhistorier med metadata
- **`family_members`**: Familiemedlemmer og tillatelser

### Automatiske funksjoner:
- **Ny bruker trigger**: Oppretter profil automatisk
- **Updated_at trigger**: Oppdaterer timestamp ved endringer
- **Play count funksjon**: Teller avspillinger
- **Analytics funksjon**: Brukerstatistikk

## 🎉 Ferdig!

Supabase er nå konfigurert og klar til bruk!

### ✅ Hva som fungerer nå:
- Ekte brukerpålogging med magic links
- Database lagring av historier og brukere
- Familiedeling og tillatelser
- Audio file upload til sky-lagring
- Automatisk brukerstatistikk

### 🚀 Neste steg:
- Deploy til Vercel (se `VERCEL_DEPLOYMENT.md`)
- Legg til AI-integrasjoner (ElevenLabs, OpenAI)
- Sett opp email notifications

---

**🎙️ Livets Stemme er nå klar for produksjon! 🎉**
