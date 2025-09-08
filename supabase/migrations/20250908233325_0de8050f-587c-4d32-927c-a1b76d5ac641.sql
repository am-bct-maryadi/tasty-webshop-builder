-- Add auth_user_id column to link users table with auth.users
ALTER TABLE public.users 
ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);

-- Create function to link existing user with auth user
CREATE OR REPLACE FUNCTION public.link_user_to_auth(
  p_username text,
  p_email text,
  p_password text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  auth_user_id uuid;
  existing_user_record RECORD;
BEGIN
  -- Get the existing user record
  SELECT * INTO existing_user_record
  FROM public.users 
  WHERE username = p_username AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if already linked
  IF existing_user_record.auth_user_id IS NOT NULL THEN
    RETURN existing_user_record.auth_user_id;
  END IF;
  
  -- Create auth user (this will be called from the application)
  -- For now, just return the user id for manual linking
  RETURN existing_user_record.id;
END;
$$;