
-- CV Adapt - Add job information to CVs
-- Run after 20261016_create_cvs.sql
-- Already applied manually in the current Supabase database.

ALTER TABLE public.cvs
ADD COLUMN IF NOT EXISTS job_info JSONB
NOT NULL DEFAULT '{}'::jsonb;
