-- Create a secure customer signup function that bypasses RLS
CREATE OR REPLACE FUNCTION public.create_customer_account(
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_password_hash TEXT,
  p_privacy_accepted BOOLEAN,
  p_marketing_consent BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  RETURN new_customer_id;
END;
$$;

-- Create a secure customer authentication function
CREATE OR REPLACE FUNCTION public.authenticate_customer(
  p_email TEXT,
  p_password_hash TEXT
)
RETURNS TABLE(
  customer_id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN,
  email_verified BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update last login timestamp and return customer data
  UPDATE customers 
  SET last_login = NOW()
  WHERE email = p_email 
    AND password_hash = p_password_hash 
    AND is_active = true;

  -- Return customer information if authentication successful
  RETURN QUERY
  SELECT 
    c.id,
    c.full_name,
    c.email,
    c.phone,
    c.is_active,
    c.email_verified
  FROM customers c
  WHERE c.email = p_email 
    AND c.password_hash = p_password_hash 
    AND c.is_active = true;
END;
$$;