-- Make branch_id nullable to support "all branches" functionality
ALTER TABLE public.banners 
ALTER COLUMN branch_id DROP NOT NULL;