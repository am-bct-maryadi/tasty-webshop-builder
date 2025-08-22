-- Fix security warning: Set search_path for the function to prevent SQL injection
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If the new/updated address is set as default
  IF NEW.is_default = true THEN
    -- Set all other addresses for this customer to non-default
    UPDATE public.customer_addresses 
    SET is_default = false 
    WHERE customer_id = NEW.customer_id AND id != NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;