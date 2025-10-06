-- Livets Stemme Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.family_members;
DROP TABLE IF EXISTS public.stories;
DROP TABLE IF EXISTS public.user_profiles;

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'premium', 'family')),
  preferences JSONB DEFAULT '{
    "language": "nb",
    "notifications": true,
    "autoSave": true,
    "audioQuality": "standard"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Generelt',
  duration INTEGER DEFAULT 0, -- seconds
  audio_url TEXT, -- Supabase storage URL
  transcript TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  share_settings JSONB DEFAULT '{
    "allowDownload": false,
    "allowComments": true
  }'::jsonb,
  ai_metadata JSONB DEFAULT '{
    "suggestions": [],
    "mood": "",
    "themes": [],
    "voiceCloneReady": false
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family members table
CREATE TABLE public.family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  permissions TEXT[] DEFAULT '{"view", "listen"}', -- view, listen, download, comment
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending', 'accepted', 'declined')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_stories_category ON public.stories(category);
CREATE INDEX idx_stories_created_at ON public.stories(created_at DESC);
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX idx_family_members_email ON public.family_members(email);

-- Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Stories Policies
CREATE POLICY "Users can view own stories" ON public.stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON public.stories
  FOR DELETE USING (auth.uid() = user_id);

-- Family members can view shared stories (if they have permission)
CREATE POLICY "Family members can view shared stories" ON public.stories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND fm.user_id = stories.user_id
        AND fm.invite_status = 'accepted'
        AND 'view' = ANY(fm.permissions)
    )
  );

-- Family Members Policies
CREATE POLICY "Users can view own family members" ON public.family_members
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family members" ON public.family_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family members" ON public.family_members
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own family members" ON public.family_members
  FOR DELETE USING (auth.uid() = user_id);

-- Invited users can view their invitations
CREATE POLICY "Users can view their invitations" ON public.family_members
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Invited users can update their invitation status
CREATE POLICY "Users can update their invitation status" ON public.family_members
  FOR UPDATE USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Functions and Triggers

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_user_profiles
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_stories
  BEFORE UPDATE ON public.stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to increment play count
CREATE OR REPLACE FUNCTION public.increment_play_count(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.stories
  SET play_count = play_count + 1,
      updated_at = NOW()
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user analytics
CREATE OR REPLACE FUNCTION public.get_user_analytics(user_uuid UUID)
RETURNS TABLE (
  total_stories INTEGER,
  total_duration INTEGER,
  total_plays INTEGER,
  family_members_count INTEGER,
  categories JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::INTEGER FROM public.stories WHERE user_id = user_uuid),
    (SELECT COALESCE(SUM(duration), 0)::INTEGER FROM public.stories WHERE user_id = user_uuid),
    (SELECT COALESCE(SUM(play_count), 0)::INTEGER FROM public.stories WHERE user_id = user_uuid),
    (SELECT COUNT(*)::INTEGER FROM public.family_members WHERE user_id = user_uuid),
    (SELECT COALESCE(jsonb_object_agg(category, count), '{}'::jsonb)
     FROM (
       SELECT category, COUNT(*) as count
       FROM public.stories
       WHERE user_id = user_uuid
       GROUP BY category
     ) category_counts);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some Norwegian story categories
INSERT INTO public.stories (user_id, title, description, category, duration, tags, created_at)
VALUES
  -- These are example stories - they will be owned by the first user who signs up
  ('00000000-0000-0000-0000-000000000000', 'Eksempel: Barndomsminne', 'Et eksempel på en barndomshistorie', 'Barndom & Oppvekst', 180, '{"barndom", "familie"}', NOW() - INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000000', 'Eksempel: Familietradisjon', 'En historie om familietradisjoner', 'Familie & Forhold', 240, '{"tradisjon", "jul"}', NOW() - INTERVAL '20 days')
ON CONFLICT DO NOTHING;

-- Create storage bucket for audio files (run this separately in Storage section)
-- This needs to be done in the Supabase dashboard Storage section
-- Bucket name: 'audio-files'
-- Public: false (private bucket)

COMMENT ON SCHEMA public IS 'Livets Stemme - Digital memory archive for elderly users';
COMMENT ON TABLE public.user_profiles IS 'Extended user profiles with preferences and subscription info';
COMMENT ON TABLE public.stories IS 'User-recorded life stories with metadata and AI analysis';
COMMENT ON TABLE public.family_members IS 'Family member invitations and permissions for story sharing';

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Show success message
DO $$
BEGIN
  RAISE NOTICE '✅ Livets Stemme database schema created successfully!';
  RAISE NOTICE '📋 Next steps:';
  RAISE NOTICE '1. Create audio-files storage bucket in Storage section';
  RAISE NOTICE '2. Configure authentication settings';
  RAISE NOTICE '3. Update your .env.local with the database credentials';
END $$;
