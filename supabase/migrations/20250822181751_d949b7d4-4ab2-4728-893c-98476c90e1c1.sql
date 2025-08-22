-- Drop and recreate create_customer_account function to return complete customer data
DROP FUNCTION IF EXISTS public.create_customer_account(text,text,text,text,boolean,boolean);

CREATE OR REPLACE FUNCTION public.create_customer_account(
  p_full_name text, 
  p_email text, 
  p_phone text, 
  p_password_hash text, 
  p_privacy_accepted boolean, 
  p_marketing_consent boolean DEFAULT false
)
RETURNS TABLE(
  customer_id uuid,
  full_name text,
  email text,
  phone text,
  is_active boolean,
  email_verified boolean,
  privacy_accepted boolean,
  marketing_consent boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_customer_id UUID;
BEGIN
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM customers WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;

  -- Check if phone already exists
  IF EXISTS (SELECT 1 FROM customers WHERE phone = p_phone) THEN
    RAISE EXCEPTION 'Phone number already exists';
  END IF;

  -- Insert the new customer
  INSERT INTO customers (
    full_name,
    email,
    phone,
    password_hash,
    privacy_accepted,
    privacy_accepted_at,
    marketing_consent,
    is_active,
    email_verified
  ) VALUES (
    p_full_name,
    p_email,
    p_phone,
    p_password_hash,
    p_privacy_accepted,
    CASE WHEN p_privacy_accepted THEN NOW() ELSE NULL END,
    p_marketing_consent,
    true,
    false
  ) RETURNING id INTO new_customer_id;

  -- Return the complete customer data
  RETURN QUERY
  SELECT 
    c.id,
    c.full_name,
    c.email,
    c.phone,
    c.is_active,
    c.email_verified,
    c.privacy_accepted,
    c.marketing_consent,
    c.created_at
  FROM customers c
  WHERE c.id = new_customer_id;
END;
$function$;