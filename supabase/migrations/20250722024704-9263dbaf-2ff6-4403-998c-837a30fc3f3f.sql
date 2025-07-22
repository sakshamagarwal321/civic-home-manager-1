
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM (
  'super_admin',
  'committee_member', 
  'treasurer',
  'resident_owner',
  'resident_tenant',
  'staff_member'
);

-- Create enum for account status
CREATE TYPE public.account_status AS ENUM (
  'active',
  'inactive', 
  'suspended',
  'pending_approval'
);

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  emergency_contact TEXT,
  flat_number TEXT,
  block TEXT,
  role user_role NOT NULL DEFAULT 'resident_owner',
  account_status account_status NOT NULL DEFAULT 'pending_approval',
  profile_photo_url TEXT,
  is_owner BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking active sessions
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  ip_address INET,
  device_info TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activity_log table
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  module TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  module TEXT NOT NULL,
  can_read BOOLEAN DEFAULT false,
  can_write BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  approval_limit DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, module)
);

-- Insert default role permissions
INSERT INTO public.role_permissions (role, module, can_read, can_write, can_delete, can_approve, approval_limit) VALUES
-- Super Admin permissions
('super_admin', 'users', true, true, true, true, 50000.00),
('super_admin', 'finances', true, true, true, true, 50000.00),
('super_admin', 'facilities', true, true, true, true, null),
('super_admin', 'documents', true, true, true, true, null),
('super_admin', 'announcements', true, true, true, true, null),
('super_admin', 'settings', true, true, true, true, null),

-- Committee Member permissions
('committee_member', 'users', true, true, false, false, null),
('committee_member', 'finances', true, true, false, true, 25000.00),
('committee_member', 'facilities', true, true, true, true, null),
('committee_member', 'documents', true, true, true, false, null),
('committee_member', 'announcements', true, true, true, true, null),

-- Treasurer permissions
('treasurer', 'finances', true, true, true, true, null),
('treasurer', 'documents', true, true, false, false, null),
('treasurer', 'users', true, false, false, false, null),

-- Resident Owner permissions
('resident_owner', 'finances', true, false, false, false, null),
('resident_owner', 'facilities', true, true, false, false, null),
('resident_owner', 'documents', true, false, false, false, null),
('resident_owner', 'announcements', true, false, false, false, null),

-- Resident Tenant permissions
('resident_tenant', 'facilities', true, true, false, false, null),
('resident_tenant', 'documents', true, false, false, false, null),
('resident_tenant', 'announcements', true, false, false, false, null),

-- Staff Member permissions
('staff_member', 'facilities', true, true, false, false, null),
('staff_member', 'documents', true, true, false, false, null);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Committee members can view resident profiles" ON public.profiles
  FOR SELECT USING (
    get_user_role(auth.uid()) IN ('committee_member', 'treasurer') AND
    role IN ('resident_owner', 'resident_tenant')
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can update all profiles" ON public.profiles
  FOR UPDATE USING (get_user_role(auth.uid()) = 'super_admin');

CREATE POLICY "Super admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (get_user_role(auth.uid()) = 'super_admin');

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all sessions" ON public.user_sessions
  FOR SELECT USING (get_user_role(auth.uid()) = 'super_admin');

-- Create RLS policies for user_activity_log
CREATE POLICY "Users can view own activity" ON public.user_activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all activity" ON public.user_activity_log
  FOR SELECT USING (get_user_role(auth.uid()) = 'super_admin');

-- Create RLS policies for role_permissions
CREATE POLICY "Everyone can read role permissions" ON public.role_permissions
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (get_user_role(auth.uid()) = 'super_admin');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', 'User'),
    'resident_owner'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_module TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_activity_log (user_id, action, module, details, ip_address)
  VALUES (p_user_id, p_action, p_module, p_details, p_ip_address);
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX idx_profiles_flat_number ON public.profiles(flat_number);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_last_active ON public.user_sessions(last_active);
CREATE INDEX idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON public.user_activity_log(created_at);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role);
