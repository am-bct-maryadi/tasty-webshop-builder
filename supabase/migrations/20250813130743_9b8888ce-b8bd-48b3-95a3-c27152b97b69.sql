-- Create password reset tokens table
CREATE TABLE public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id = password_reset_tokens.user_id 
  AND users.id::text = auth.uid()::text
));

CREATE POLICY "System can insert reset tokens" 
ON public.password_reset_tokens 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update reset tokens" 
ON public.password_reset_tokens 
FOR UPDATE 
USING (true);

-- Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < now() OR used_at IS NOT NULL;
END;
$$;

-- Create trigger to automatically clean up on insert
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_tokens()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.cleanup_expired_reset_tokens();
  RETURN NEW;
END;
$$;

CREATE TRIGGER cleanup_expired_tokens_trigger
  AFTER INSERT ON public.password_reset_tokens
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_cleanup_expired_tokens();