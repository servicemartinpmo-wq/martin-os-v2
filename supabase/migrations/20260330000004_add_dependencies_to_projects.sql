-- Add dependencies field to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS dependencies UUID[] DEFAULT '{}'::uuid[];
