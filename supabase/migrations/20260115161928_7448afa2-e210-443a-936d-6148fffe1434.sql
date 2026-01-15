-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create cognitive_metrics table
CREATE TABLE public.cognitive_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  energy_level INTEGER CHECK (energy_level >= 0 AND energy_level <= 100),
  productivity INTEGER CHECK (productivity >= 0 AND productivity <= 100),
  stress_level INTEGER CHECK (stress_level >= 0 AND stress_level <= 100),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  target_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table for RBAC
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create indexes for performance
CREATE INDEX idx_cognitive_metrics_user_id ON public.cognitive_metrics(user_id);
CREATE INDEX idx_cognitive_metrics_recorded_at ON public.cognitive_metrics(recorded_at);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_milestones_goal_id ON public.milestones(goal_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  -- Create default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create initial cognitive metrics
  INSERT INTO public.cognitive_metrics (user_id, focus_score, energy_level, productivity, stress_level)
  VALUES (NEW.id, 75, 80, 70, 30);
  
  -- Log the signup activity
  INSERT INTO public.activity_logs (user_id, action, category, metadata)
  VALUES (NEW.id, 'account_created', 'auth', '{"source": "signup"}'::jsonb);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for cognitive_metrics
CREATE POLICY "Users can view own metrics"
  ON public.cognitive_metrics FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own metrics"
  ON public.cognitive_metrics FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for goals
CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own goals"
  ON public.goals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON public.goals FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
  ON public.goals FOR DELETE
  USING (user_id = auth.uid());

-- RLS Policies for milestones
CREATE POLICY "Users can view own milestones"
  ON public.milestones FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.goals 
    WHERE id = goal_id AND (user_id = auth.uid() OR public.is_admin())
  ));

CREATE POLICY "Users can insert own milestones"
  ON public.milestones FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.goals 
    WHERE id = goal_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update own milestones"
  ON public.milestones FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.goals 
    WHERE id = goal_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own milestones"
  ON public.milestones FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.goals 
    WHERE id = goal_id AND user_id = auth.uid()
  ));

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own logs"
  ON public.activity_logs FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert own logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());