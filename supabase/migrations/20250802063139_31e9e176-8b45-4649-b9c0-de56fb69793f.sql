
-- Update the flats table to include more detailed information
ALTER TABLE public.flats 
ADD COLUMN IF NOT EXISTS carpet_area NUMERIC,
ADD COLUMN IF NOT EXISTS possession_date DATE,
ADD COLUMN IF NOT EXISTS floor_number INTEGER,
ADD COLUMN IF NOT EXISTS ownership_type TEXT CHECK (ownership_type IN ('owner', 'tenant')),
ADD COLUMN IF NOT EXISTS lease_start_date DATE,
ADD COLUMN IF NOT EXISTS lease_end_date DATE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'vacant' CHECK (status IN ('occupied', 'vacant', 'pending')),
ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- Create flat_assignments table to track assignment history
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on flat_assignments
ALTER TABLE public.flat_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for flat_assignments
CREATE POLICY "Admin can manage all assignments" ON public.flat_assignments
  FOR ALL USING (get_user_role(auth.uid()) = ANY (ARRAY['committee_member'::user_role, 'treasurer'::user_role, 'super_admin'::user_role]));

CREATE POLICY "Users can view their assignments" ON public.flat_assignments
  FOR SELECT USING (user_id = auth.uid() OR get_user_role(auth.uid()) = ANY (ARRAY['committee_member'::user_role, 'treasurer'::user_role, 'super_admin'::user_role]));

-- Insert sample flats data
INSERT INTO public.flats (flat_number, block, flat_type, carpet_area, floor_number, status)
VALUES 
  ('A-101', 'A', '2BHK', 1200, 1, 'vacant'),
  ('A-102', 'A', '2BHK', 1200, 1, 'occupied'),
  ('A-201', 'A', '3BHK', 1500, 2, 'vacant'),
  ('A-301', 'A', '2BHK', 1200, 3, 'occupied'),
  ('B-101', 'B', '1BHK', 800, 1, 'vacant'),
  ('B-201', 'B', '2BHK', 1100, 2, 'occupied'),
  ('C-101', 'C', '3BHK', 1600, 1, 'pending'),
  ('C-201', 'C', '2BHK', 1250, 2, 'vacant')
ON CONFLICT (flat_number) DO NOTHING;

-- Create a sample user profile for Rajesh Kumar if not exists
INSERT INTO public.profiles (id, first_name, last_name, phone, role)
SELECT gen_random_uuid(), 'Rajesh', 'Kumar', '+91 9876543210', 'committee_member'::user_role
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE first_name = 'Rajesh' AND last_name = 'Kumar');

-- Assign flat A-301 to Rajesh Kumar as owner
WITH rajesh_profile AS (
  SELECT id FROM public.profiles WHERE first_name = 'Rajesh' AND last_name = 'Kumar' LIMIT 1
),
flat_a301 AS (
  SELECT id FROM public.flats WHERE flat_number = 'A-301' LIMIT 1
)
INSERT INTO public.flat_assignments (flat_id, user_id, assignment_type, start_date, is_active)
SELECT f.id, r.id, 'owner', '2020-03-15', true
FROM rajesh_profile r, flat_a301 f
ON CONFLICT DO NOTHING;

-- Update the flat status and resident info
UPDATE public.flats 
SET 
  resident_id = (SELECT id FROM public.profiles WHERE first_name = 'Rajesh' AND last_name = 'Kumar' LIMIT 1),
  resident_name = 'Rajesh Kumar',
  status = 'occupied',
  ownership_type = 'owner',
  possession_date = '2020-03-15'
WHERE flat_number = 'A-301';

-- Create function to get flat assignments with user details
CREATE OR REPLACE FUNCTION public.get_flat_assignments()
RETURNS TABLE (
  flat_id UUID,
  flat_number TEXT,
  block TEXT,
  flat_type TEXT,
  carpet_area NUMERIC,
  floor_number INTEGER,
  status TEXT,
  assignment_type TEXT,
  user_id UUID,
  user_name TEXT,
  user_phone TEXT,
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
    f.status,
    fa.assignment_type,
    p.id,
    CONCAT(p.first_name, ' ', p.last_name),
    p.phone,
    fa.start_date,
    fa.end_date,
    fa.is_active
  FROM public.flats f
  LEFT JOIN public.flat_assignments fa ON f.id = fa.flat_id AND fa.is_active = true
  LEFT JOIN public.profiles p ON fa.user_id = p.id
  ORDER BY f.block, f.flat_number;
$$;
