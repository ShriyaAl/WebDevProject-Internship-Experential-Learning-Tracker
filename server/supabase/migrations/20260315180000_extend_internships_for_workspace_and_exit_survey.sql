-- Extend internships table for richer frontend workflow support
ALTER TABLE public.internships
  ADD COLUMN internship_type TEXT,
  ADD COLUMN map_for_credits BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN offer_letter_received BOOLEAN,
  ADD COLUMN reporting_authority_name TEXT,
  ADD COLUMN reporting_authority_designation TEXT,
  ADD COLUMN reporting_authority_email TEXT,
  ADD COLUMN reporting_authority_phone TEXT,
  ADD COLUMN activity_status TEXT NOT NULL DEFAULT 'Ongoing' CHECK (activity_status IN ('Ongoing', 'Completed')),
  ADD COLUMN exit_survey JSONB,
  ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;
