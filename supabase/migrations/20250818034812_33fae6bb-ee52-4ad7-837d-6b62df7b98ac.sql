-- Fix security warning by setting search_path for functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id::text = auth.uid()::text LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_branch()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT branch_id FROM public.users WHERE id::text = auth.uid()::text LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_user_active(user_uuid uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT is_active FROM public.users WHERE id = user_uuid LIMIT 1;
$$;