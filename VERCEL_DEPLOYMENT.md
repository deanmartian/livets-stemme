# 🚀 Vercel Deployment Guide - Med Ekte Autentisering

Denne guiden viser hvordan du setter opp "Livets Stemme" på Vercel med ekte database og autentisering.

## 📋 Forutsetninger

### 1. Kontoer du trenger:
- [Vercel konto](https://vercel.com) (gratis)
- [Supabase konto](https://supabase.com) (gratis tier)
- GitHub repository (opprettet i forrige steg)

### 2. Teknologi stack for produksjon:
- **Frontend**: Next.js (eksisterende)
- **Database**: Supabase PostgreSQL
- **Autentisering**: Supabase Auth
- **File Storage**: Supabase Storage
- **Deployment**: Vercel

## 🗄️ Steg 1: Sett opp Supabase Database

### Opprett Supabase prosjekt:
1. Gå til [supabase.com](https://supabase.com)
2. Klikk **"New project"**
3. Fyll ut:
   - **Name**: `livets-stemme`
   - **Database Password**: Lag et sterkt passord
   - **Region**: Europe (closest to Norway)
4. Klikk **"Create new project"**

### Database Schema:
Gå til **SQL Editor** i Supabase og kjør:

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'premium', 'family')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration INTEGER DEFAULT 0,
  audio_url TEXT,
  transcript TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  share_settings JSONB DEFAULT '{}',
  ai_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family members table
CREATE TABLE public.family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending', 'accepted', 'declined')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can CRUD their own stories
CREATE POLICY "Users can view own stories" ON public.stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON public.stories
  FOR DELETE USING (auth.uid() = user_id);

-- Family members policies
CREATE POLICY "Users can view own family members" ON public.family_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own family members" ON public.family_members
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Sett opp Storage:
1. Gå til **Storage** i Supabase
2. Opprett bucket: `audio-files`
3. Sett bucket til public: `false` (private)

## 🔧 Steg 2: Installer Supabase i Prosjektet

```bash
cd voice-of-lifetime

# Installer Supabase client (allerede installert)
# bun add @supabase/supabase-js

# Installer NextAuth.js for backup auth
bun add next-auth @auth/supabase-adapter
```

## ⚙️ Steg 3: Opprett Miljøvariabler

### Opprett `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (backup)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Optional: AI Services
ELEVENLABS_API_KEY=your-elevenlabs-key
OPENAI_API_KEY=your-openai-key
ASSEMBLYAI_API_KEY=your-assemblyai-key

# Optional: Email
RESEND_API_KEY=your-resend-key
```

### Finn Supabase nøkler:
1. Gå til **Settings** → **API** i Supabase
2. Kopier:
   - **URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role**: `SUPABASE_SERVICE_ROLE_KEY`

## 🔄 Steg 4: Oppdater Koden til Ekte Backend

### Opprett ny `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          subscription: 'free' | 'premium' | 'family'
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          subscription?: 'free' | 'premium' | 'family'
          preferences?: any
        }
        Update: {
          name?: string
          avatar_url?: string | null
          subscription?: 'free' | 'premium' | 'family'
          preferences?: any
        }
      }
      stories: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category: string
          duration: number
          audio_url: string | null
          transcript: string | null
          tags: string[]
          is_public: boolean
          play_count: number
          share_settings: any
          ai_metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          category: string
          duration?: number
          audio_url?: string | null
          transcript?: string | null
          tags?: string[]
          is_public?: boolean
          play_count?: number
          share_settings?: any
          ai_metadata?: any
        }
        Update: {
          title?: string
          description?: string | null
          category?: string
          duration?: number
          audio_url?: string | null
          transcript?: string | null
          tags?: string[]
          is_public?: boolean
          play_count?: number
          share_settings?: any
          ai_metadata?: any
        }
      }
      family_members: {
        Row: {
          id: string
          user_id: string
          email: string
          name: string
          relationship: string
          permissions: string[]
          invite_status: 'pending' | 'accepted' | 'declined'
          invited_at: string
        }
        Insert: {
          user_id: string
          email: string
          name: string
          relationship: string
          permissions?: string[]
          invite_status?: 'pending' | 'accepted' | 'declined'
        }
        Update: {
          name?: string
          relationship?: string
          permissions?: string[]
          invite_status?: 'pending' | 'accepted' | 'declined'
        }
      }
    }
  }
}
```

### Oppdater `lib/auth.ts`:
```typescript
import { supabase } from './supabase'
import type { Database } from './supabase'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type Story = Database['public']['Tables']['stories']['Row']
type FamilyMember = Database['public']['Tables']['family_members']['Row']

export class AuthService {
  // Real authentication with Supabase
  static async signInWithEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return null // User will be redirected via email
  }

  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile
  }

  // Story management with real database
  static async getStories(userId: string): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async saveStory(story: Partial<Story>): Promise<Story> {
    if (story.id) {
      // Update existing
      const { data, error } = await supabase
        .from('stories')
        .update(story)
        .eq('id', story.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('stories')
        .insert(story)
        .select()
        .single()

      if (error) throw error
      return data
    }
  }

  static async deleteStory(storyId: string): Promise<void> {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId)

    if (error) throw error
  }

  // Audio file upload
  static async uploadAudio(file: Blob, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(fileName, file)

    if (error) throw error
    return data.path
  }
}
```

## 🚀 Steg 5: Deploy til Vercel

### Via Vercel CLI:
```bash
# Installer Vercel CLI
npm i -g vercel

# Login til Vercel
vercel login

# Deploy fra prosjektmappen
cd voice-of-lifetime
vercel

# Følg instruksjonene:
# - Link to existing project? No
# - Project name: livets-stemme
# - Directory: ./
# - Build Command: next build
# - Output Directory: .next
```

### Via GitHub Integration (anbefalt):
1. Gå til [vercel.com](https://vercel.com)
2. Klikk **"New Project"**
3. **Import Git Repository**
4. Velg ditt `livets-stemme` repository
5. **Configure Project**:
   - Framework Preset: `Next.js`
   - Build Command: `bun run build`
   - Install Command: `bun install`

### Sett Environment Variables i Vercel:
1. Gå til **Settings** → **Environment Variables**
2. Legg til alle variabler fra `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

## 🔄 Steg 6: Oppdater Supabase Auth Settings

1. Gå til **Authentication** → **URL Configuration** i Supabase
2. **Site URL**: `https://your-app.vercel.app`
3. **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

## ✅ Steg 7: Test Deployment

### Lokal testing:
```bash
bun run dev
# Test auth flow på localhost:3000
```

### Produksjon testing:
1. Gå til din Vercel URL
2. Test registrering med ekte e-post
3. Sjekk at du får magic link på e-post
4. Test opptak og lagring
5. Verifiser at data lagres i Supabase

## 🎯 Neste Steg: AI Integrasjoner

### ElevenLabs Voice Cloning:
```bash
bun add elevenlabs-js
```

### OpenAI for Story Assistance:
```bash
bun add openai
```

### AssemblyAI for Transcription:
```bash
bun add assemblyai
```

## 📊 Monitoring & Analytics

### Vercel Analytics:
```bash
bun add @vercel/analytics
```

### Sentry Error Tracking:
```bash
bun add @sentry/nextjs
```

## 🔒 Sikkerhet

### HTTPS og Security Headers
Vercel håndterer automatisk:
- SSL certificates
- Security headers
- DDoS protection

### Rate Limiting
Implementer i API routes:
```typescript
// app/api/upload/route.ts
import { ratelimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const { success } = await ratelimit.limit('upload', request.ip)
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  // ... handle upload
}
```

## ✅ Deployment Checklist

- [ ] Supabase prosjekt opprettet
- [ ] Database schema kjørt
- [ ] Environment variables satt
- [ ] Kode oppdatert til ekte backend
- [ ] Vercel deployment konfigurert
- [ ] Auth URLs oppdatert i Supabase
- [ ] Testing av full auth flow
- [ ] Production URL fungerer
- [ ] Audio upload og storage fungerer

---

**Gratulerer! "Livets Stemme" kjører nå i produksjon med ekte autentisering! 🎉**

**Production URL**: `https://your-app.vercel.app`
