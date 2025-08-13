-- Fix Function Search Path Mutable warnings by setting secure search paths
-- This addresses the security linter warnings about mutable search paths

-- Update the update_updated_at_column function with secure search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- Secure search path
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Update the prevent_unauthorized_role_changes function with secure search path
CREATE OR REPLACE FUNCTION public.prevent_unauthorized_role_changes()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''  -- Secure search path
AS $$
BEGIN
  -- Allow super admins to change anything
  IF EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role = 'super_admin'
  ) THEN
    RETURN NEW;
  END IF;
  
  -- For regular users updating their own profile
  IF auth.uid()::text = NEW.id::text THEN
    -- Prevent role changes
    IF OLD.role != NEW.role THEN
      RAISE EXCEPTION 'Users cannot change their own role';
    END IF;
    
    -- Prevent branch changes
    IF OLD.branch_id != NEW.branch_id THEN
      RAISE EXCEPTION 'Users cannot change their own branch';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;