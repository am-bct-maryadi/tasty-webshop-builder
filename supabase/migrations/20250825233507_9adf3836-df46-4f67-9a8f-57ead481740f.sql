-- Create a function to safely get customer data by email for authentication
-- This bypasses RLS and allows us to get the stored password hash for comparison
CREATE OR REPLACE FUNCTION public.get_customer_for_auth(p_email text)
 RETURNS TABLE(customer_id uuid, full_name text, email text, phone text, password_hash text, is_active boolean, email_verified boolean, privacy_accepted boolean, marketing_consent boolean, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Return customer information for authentication
  RETURN QUERY
  SELECT 
    c.id,
    c.full_name,
    c.email,
    c.phone,
    c.password_hash,
    c.is_active,
    c.email_verified,
    c.privacy_accepted,
    c.marketing_consent,
    c.created_at
  FROM customers c
  WHERE c.email = p_email 
    AND c.is_active = true;
END;
$function$;