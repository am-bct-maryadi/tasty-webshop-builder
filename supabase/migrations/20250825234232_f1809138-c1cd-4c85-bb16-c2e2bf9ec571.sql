-- Create function to set customer context for RLS policies
CREATE OR REPLACE FUNCTION public.set_customer_context(customer_id_param text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Set the customer context for RLS policies
  PERFORM set_config('app.current_customer_id', customer_id_param, false);
END;
$function$;