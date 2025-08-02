
-- First, let's ensure we have the proper flat assignment structure
-- Update flats table with additional columns if they don't exist
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flats' AND column_name = 'carpet_area') THEN
    ALTER TABLE public.flats ADD COLUMN carpet_area NUMERIC;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flats' AND column_name = 'floor_number') THEN
    ALTER TABLE public.flats ADD COLUMN floor_number INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flats' AND column_name = 'ownership_type') THEN
    ALTER TABLE public.flats ADD COLUMN ownership_type TEXT CHECK (ownership_type IN ('owner', 'tenant'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'flats' AND column_name = 'possession_date') THEN
    ALTER TABLE public.flats ADD COLUMN possession_date DATE;
  END IF;
END $$;

-- Create flat_assignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.flat_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  flat_id UUID REFERENCES public.flats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assignment_type TEXT NOT NULL CHECK (assignment_type IN ('owner', 'tenant')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(flat_id, user_id, assignment_type, is_active)
);

-- Enable RLS on flat_assignments
ALTER TABLE public.flat_assignments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can manage all assignments" ON public.flat_assignments;
DROP POLICY IF EXISTS "Users can view their assignments" ON public.flat_assignments;

-- Create RLS policies for flat_assignments
CREATE POLICY "Admin can manage all assignments" ON public.flat_assignments
  FOR ALL USING (get_user_role(auth.uid()) = ANY (ARRAY['committee_member'::user_role, 'treasurer'::user_role, 'super_admin'::user_role]));

CREATE POLICY "Users can view their assignments" ON public.flat_assignments
  FOR SELECT USING (user_id = auth.uid() OR get_user_role(auth.uid()) = ANY (ARRAY['committee_member'::user_role, 'treasurer'::user_role, 'super_admin'::user_role]));

-- Insert or update sample flats data
INSERT INTO public.flats (flat_number, block, flat_type, carpet_area, floor_number, is_active)
VALUES 
  ('A-301', 'A', '2BHK', 1200, 3, true),
  ('A-101', 'A', '2BHK', 1200, 1, true),
  ('B-204', 'B', '3BHK', 1500, 2, true),
  ('C-105', 'C', '1BHK', 800, 1, true)
ON CONFLICT (flat_number) DO UPDATE SET
  carpet_area = EXCLUDED.carpet_area,
  floor_number = EXCLUDED.floor_number,
  is_active = EXCLUDED.is_active;

-- Create or update Rajesh Kumar profile
INSERT INTO public.profiles (id, first_name, last_name, phone, role, account_status)
SELECT 
  gen_random_uuid(), 
  'Rajesh', 
  'Kumar', 
  '+91 9876543210', 
  'committee_member'::user_role,
  'approved'::account_status
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE first_name = 'Rajesh' AND last_name = 'Kumar'
);

-- Assign flat A-301 to Rajesh Kumar as owner
DO $$
DECLARE
  rajesh_id UUID;
  flat_id UUID;
BEGIN
  -- Get Rajesh Kumar's profile ID
  SELECT id INTO rajesh_id 
  FROM public.profiles 
  WHERE first_name = 'Rajesh' AND last_name = 'Kumar' 
  LIMIT 1;
  
  -- Get flat A-301 ID
  SELECT id INTO flat_id 
  FROM public.flats 
  WHERE flat_number = 'A-301' 
  LIMIT 1;
  
  -- Insert flat assignment if both IDs exist
  IF rajesh_id IS NOT NULL AND flat_id IS NOT NULL THEN
    INSERT INTO public.flat_assignments (
      flat_id, 
      user_id, 
      assignment_type, 
      start_date, 
      is_active
    )
    VALUES (
      flat_id, 
      rajesh_id, 
      'owner', 
      '2020-03-15', 
      true
    )
    ON CONFLICT (flat_id, user_id, assignment_type, is_active) 
    WHERE is_active = true
    DO NOTHING;
    
    -- Update the flats table with resident information
    UPDATE public.flats 
    SET 
      resident_id = rajesh_id,
      resident_name = 'Rajesh Kumar',
      ownership_type = 'owner',
      possession_date = '2020-03-15'
    WHERE id = flat_id;
  END IF;
END $$;

-- Create function to get user's assigned flats
CREATE OR REPLACE FUNCTION public.get_user_flats(user_uuid UUID)
RETURNS TABLE (
  flat_id UUID,
  flat_number TEXT,
  block TEXT,
  flat_type TEXT,
  carpet_area NUMERIC,
  floor_number INTEGER,
  assignment_type TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    f.id,
    f.flat_number,
    f.block,
    f.flat_type,
    f.carpet_area,
    f.floor_number,
    fa.assignment_type,
    fa.start_date,
    fa.end_date,
    fa.is_active
  FROM public.flats f
  INNER JOIN public.flat_assignments fa ON f.id = fa.flat_id
  WHERE fa.user_id = user_uuid 
    AND fa.is_active = true
    AND f.is_active = true
  ORDER BY f.flat_number;
$$;
