
-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM ('cash', 'cheque', 'upi_imps', 'bank_transfer');

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'verified');

-- Create table for maintenance payments
CREATE TABLE public.maintenance_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flat_number TEXT NOT NULL,
  resident_id UUID REFERENCES public.profiles(id),
  payment_month DATE NOT NULL, -- First day of the payment month
  base_amount DECIMAL(10,2) NOT NULL DEFAULT 2500.00,
  penalty_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  receipt_number TEXT UNIQUE NOT NULL,
  
  -- Payment method specific fields
  cheque_number TEXT,
  cheque_date DATE,
  bank_name TEXT,
  transaction_reference TEXT,
  
  -- Admin fields
  received_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.profiles(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one payment per flat per month
  UNIQUE(flat_number, payment_month)
);

-- Create table for flat information
CREATE TABLE public.flats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flat_number TEXT UNIQUE NOT NULL,
  flat_type TEXT NOT NULL, -- '1BHK', '2BHK', '3BHK'
  block TEXT,
  resident_id UUID REFERENCES public.profiles(id),
  resident_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for payment reminders
CREATE TABLE public.payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flat_number TEXT NOT NULL,
  payment_month DATE NOT NULL,
  reminder_type TEXT NOT NULL, -- 'email', 'sms'
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  sent_by UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'sent'
);

-- Create table for receipt templates and settings
CREATE TABLE public.maintenance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_name TEXT DEFAULT 'ECO RESIDENTS WELFARE SOCIETY',
  society_address TEXT DEFAULT 'Greenfield Residency\nBangalore - 560001',
  base_maintenance_fee DECIMAL(10,2) DEFAULT 2500.00,
  late_payment_penalty DECIMAL(10,2) DEFAULT 200.00,
  penalty_due_date INTEGER DEFAULT 10, -- 10th of each month
  receipt_prefix TEXT DEFAULT 'ECO',
  current_receipt_sequence INTEGER DEFAULT 1,
  email_template TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.maintenance_settings (id) VALUES (gen_random_uuid());

-- Insert sample flat data
INSERT INTO public.flats (flat_number, flat_type, block, resident_name) VALUES
('A-101', '2BHK', 'A', 'Rajesh Kumar'),
('A-102', '2BHK', 'A', 'Priya Sharma'),
('A-103', '3BHK', 'A', 'Amit Singh'),
('B-201', '1BHK', 'B', 'Sunita Devi'),
('B-202', '2BHK', 'B', 'Ravi Gupta'),
('B-203', '3BHK', 'B', 'Meera Patel'),
('C-301', '2BHK', 'C', 'Vikram Rao'),
('C-302', '3BHK', 'C', 'Lakshmi Nair');

-- Enable RLS
ALTER TABLE public.maintenance_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for maintenance_payments
CREATE POLICY "Users can view their own flat payments"
  ON public.maintenance_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.flats 
      WHERE flats.flat_number = maintenance_payments.flat_number 
      AND flats.resident_id = auth.uid()
    )
    OR 
    get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin')
  );

CREATE POLICY "Users can create payments for their flats"
  ON public.maintenance_payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.flats 
      WHERE flats.flat_number = maintenance_payments.flat_number 
      AND flats.resident_id = auth.uid()
    )
    OR 
    get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin')
  );

CREATE POLICY "Committee members can update payments"
  ON public.maintenance_payments FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin'));

-- Create RLS policies for flats
CREATE POLICY "Users can view their own flats"
  ON public.flats FOR SELECT
  USING (
    resident_id = auth.uid()
    OR 
    get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin')
  );

CREATE POLICY "Committee members can manage flats"
  ON public.flats FOR ALL
  USING (get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin'));

-- Create RLS policies for payment_reminders
CREATE POLICY "Committee members can manage reminders"
  ON public.payment_reminders FOR ALL
  USING (get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin'));

-- Create RLS policies for maintenance_settings
CREATE POLICY "Everyone can read settings"
  ON public.maintenance_settings FOR SELECT
  USING (true);

CREATE POLICY "Committee members can update settings"
  ON public.maintenance_settings FOR UPDATE
  USING (get_user_role(auth.uid()) IN ('committee_member', 'treasurer', 'super_admin'));

-- Create function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  next_sequence INTEGER;
  receipt_number TEXT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Get and increment the sequence
  UPDATE public.maintenance_settings 
  SET current_receipt_sequence = current_receipt_sequence + 1
  RETURNING current_receipt_sequence INTO next_sequence;
  
  -- Format: ECO-YYYY-XXX
  receipt_number := 'ECO-' || current_year || '-' || LPAD(next_sequence::TEXT, 3, '0');
  
  RETURN receipt_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate penalty
CREATE OR REPLACE FUNCTION calculate_penalty(payment_date DATE, payment_month DATE)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  penalty_due_date INTEGER;
  penalty_amount DECIMAL(10,2);
  due_date DATE;
BEGIN
  -- Get penalty settings
  SELECT penalty_due_date, late_payment_penalty 
  INTO penalty_due_date, penalty_amount
  FROM public.maintenance_settings 
  LIMIT 1;
  
  -- Calculate due date (10th of the payment month)
  due_date := payment_month + INTERVAL '1 month' - INTERVAL '1 day' + INTERVAL '10 days';
  
  -- If payment is after due date, apply penalty
  IF payment_date > due_date THEN
    RETURN penalty_amount;
  ELSE
    RETURN 0.00;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-generate receipt numbers and calculate penalties
CREATE OR REPLACE FUNCTION set_payment_details()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate receipt number if not provided
  IF NEW.receipt_number IS NULL OR NEW.receipt_number = '' THEN
    NEW.receipt_number := generate_receipt_number();
  END IF;
  
  -- Calculate penalty if not provided
  IF NEW.penalty_amount IS NULL THEN
    NEW.penalty_amount := calculate_penalty(NEW.payment_date, NEW.payment_month);
  END IF;
  
  -- Calculate total amount
  NEW.total_amount := NEW.base_amount + NEW.penalty_amount;
  
  -- Set updated timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_payment_details_trigger
  BEFORE INSERT OR UPDATE ON public.maintenance_payments
  FOR EACH ROW EXECUTE FUNCTION set_payment_details();
