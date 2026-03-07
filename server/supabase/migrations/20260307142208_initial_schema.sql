-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'INCHARGE', 'ADMIN')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. student_profiles
CREATE TABLE public.student_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  reg_no TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  dept TEXT DEFAULT 'IT',
  year INTEGER CHECK (year > 0 AND year <= 5),
  gender TEXT,
  phone TEXT,
  linkedin_url TEXT
);

-- 3. incharge_profiles
CREATE TABLE public.incharge_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  designation TEXT,
  phone TEXT
);

-- 4. internships
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_user_id UUID REFERENCES public.student_profiles(user_id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_linkedin TEXT,
  role_title TEXT NOT NULL,
  expected_start_date DATE,
  expected_end_date DATE,
  stipend TEXT,
  location TEXT,
  mode TEXT CHECK (mode IN ('ONSITE', 'REMOTE', 'HYBRID')),
  offer_letter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. request_types
CREATE TABLE public.request_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- BONAFIDE, OD, etc.
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  form_schema_json JSONB DEFAULT '{}'::jsonb
);

-- 6. document_requests
CREATE TABLE public.document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  student_user_id UUID REFERENCES public.student_profiles(user_id) ON DELETE CASCADE,
  request_type_id UUID REFERENCES public.request_types(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'ON_HOLD', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
  student_note TEXT,
  incharge_comment TEXT,
  reviewed_by UUID REFERENCES public.incharge_profiles(user_id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. request_submissions
CREATE TABLE public.request_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.document_requests(id) ON DELETE CASCADE,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_latest BOOLEAN DEFAULT true
);

-- 8. request_status_history
CREATE TABLE public.request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.document_requests(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  comment TEXT,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. activity_logs
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  meta_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert starting/seed request_types
INSERT INTO public.request_types (code, name, form_schema_json) VALUES 
('BONAFIDE', 'Bonafide Certificate', '{"fields": [{"name": "purpose", "type": "text", "label": "Purpose of Bonafide", "required": true}]}'::jsonb),
('OD', 'On Duty (OD) Request', '{"fields": [{"name": "reason", "type": "text", "label": "Reason", "required": true}, {"name": "no_of_days", "type": "number", "label": "Number of Days", "required": true}]}'::jsonb);
