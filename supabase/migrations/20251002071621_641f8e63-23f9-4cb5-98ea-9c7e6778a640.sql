-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table with multilingual and accessibility support
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  date_of_birth DATE,
  language TEXT DEFAULT 'en',
  accessibility_settings JSONB DEFAULT '{"screenReader": false, "dyslexiaFont": false, "highContrast": false}'::jsonb,
  is_caregiver BOOLEAN DEFAULT false,
  caregiver_for UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create screening_results table
CREATE TABLE public.screening_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  screening_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  risk_level TEXT CHECK (risk_level IN ('low', 'moderate', 'high')),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  personal_info JSONB,
  audio_analysis JSONB,
  cognitive_scores JSONB,
  ai_breakdown JSONB,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cognitive_tasks table for gamified tracking
CREATE TABLE public.cognitive_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id UUID REFERENCES public.screening_results(id) ON DELETE CASCADE NOT NULL,
  task_type TEXT NOT NULL,
  task_name TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  completion_time INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Caregivers can view patient profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.profiles 
      WHERE caregiver_for = profiles.user_id
    )
  );

-- RLS Policies for screening_results
CREATE POLICY "Users can view own results"
  ON public.screening_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results"
  ON public.screening_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Caregivers can view patient results"
  ON public.screening_results FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.profiles 
      WHERE caregiver_for = screening_results.user_id
    )
  );

-- RLS Policies for cognitive_tasks
CREATE POLICY "Users can view own tasks"
  ON public.cognitive_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.screening_results 
      WHERE screening_results.id = cognitive_tasks.screening_id 
      AND screening_results.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own tasks"
  ON public.cognitive_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.screening_results 
      WHERE screening_results.id = cognitive_tasks.screening_id 
      AND screening_results.user_id = auth.uid()
    )
  );

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();