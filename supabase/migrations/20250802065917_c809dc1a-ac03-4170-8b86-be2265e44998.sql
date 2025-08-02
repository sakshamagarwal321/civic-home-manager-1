
-- First, let's add missing columns to the flats table that are referenced in the code
ALTER TABLE public.flats 
ADD COLUMN IF NOT EXISTS carpet_area INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS floor_number INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ownership_type TEXT DEFAULT 'owner',
ADD COLUMN IF NOT EXISTS possession_date DATE DEFAULT CURRENT_DATE;

-- Insert sample flats data
INSERT INTO public.flats (flat_number, flat_type, block, floor_number, carpet_area, is_active, created_at, updated_at) VALUES
('A-101', '1BHK', 'A', 1, 650, true, NOW(), NOW()),
('A-201', '2BHK', 'A', 2, 950, true, NOW(), NOW()),
('A-301', '2BHK', 'A', 3, 950, true, NOW(), NOW()),
('B-102', '3BHK', 'B', 1, 1200, true, NOW(), NOW()),
('B-202', '3BHK', 'B', 2, 1200, true, NOW(), NOW()),
('C-103', '1BHK', 'C', 1, 650, true, NOW(), NOW())
ON CONFLICT (flat_number) DO NOTHING;

-- Create sample users in profiles table (we'll use these as test users)
-- Note: In a real scenario, these would be created through user registration
INSERT INTO public.profiles (id, first_name, last_name, role, account_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rajesh', 'Kumar', 'resident_owner', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Priya', 'Sharma', 'resident_owner', 'active'),
('550e8400-e29b-41d4-a716-446655440003', 'Amit', 'Patel', 'resident_tenant', 'active')
ON CONFLICT (id) DO NOTHING;

-- Assign flats to users
UPDATE public.flats SET 
  resident_id = '550e8400-e29b-41d4-a716-446655440001',
  resident_name = 'Rajesh Kumar',
  ownership_type = 'owner',
  possession_date = '2020-03-01'
WHERE flat_number = 'A-301';

UPDATE public.flats SET 
  resident_id = '550e8400-e29b-41d4-a716-446655440002',
  resident_name = 'Priya Sharma',
  ownership_type = 'owner',
  possession_date = '2019-12-15'
WHERE flat_number = 'B-202';

UPDATE public.flats SET 
  resident_id = '550e8400-e29b-41d4-a716-446655440003',
  resident_name = 'Amit Patel',
  ownership_type = 'tenant',
  possession_date = '2021-06-01'
WHERE flat_number = 'C-103';

-- Insert some sample maintenance payment records for testing
INSERT INTO public.maintenance_payments (
  flat_number, 
  resident_id, 
  payment_month, 
  base_amount, 
  penalty_amount, 
  total_amount, 
  payment_date, 
  payment_method, 
  status, 
  receipt_number
) VALUES
('A-301', '550e8400-e29b-41d4-a716-446655440001', '2024-01-01', 2500, 0, 2500, '2024-01-08', 'upi_imps', 'paid', 'ECO-2024-001'),
('A-301', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01', 2500, 0, 2500, '2024-02-05', 'bank_transfer', 'paid', 'ECO-2024-002'),
('B-202', '550e8400-e29b-41d4-a716-446655440002', '2024-01-01', 2500, 0, 2500, '2024-01-12', 'cheque', 'paid', 'ECO-2024-003'),
('C-103', '550e8400-e29b-41d4-a716-446655440003', '2024-01-01', 2500, 200, 2700, '2024-01-18', 'cash', 'paid', 'ECO-2024-004')
ON CONFLICT DO NOTHING;
