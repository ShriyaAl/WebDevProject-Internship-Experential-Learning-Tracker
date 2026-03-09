-- Add Verification Status
ALTER TABLE public.internships 
ADD COLUMN verification_status TEXT CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')) DEFAULT 'PENDING';

-- Add Supporting Documents
ALTER TABLE public.internships 
ADD COLUMN supporting_documents JSONB DEFAULT '[]'::jsonb;
