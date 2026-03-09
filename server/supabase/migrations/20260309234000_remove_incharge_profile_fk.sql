-- Change the foreign key for reviewed_by to point to users(id) instead of incharge_profiles(user_id)
ALTER TABLE public.document_requests 
  DROP CONSTRAINT IF EXISTS document_requests_reviewed_by_fkey;

ALTER TABLE public.document_requests 
  ADD CONSTRAINT document_requests_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) 
  REFERENCES public.users(id) 
  ON DELETE SET NULL;
