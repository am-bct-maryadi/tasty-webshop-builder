-- Create customers table for customer registration and management
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  privacy_accepted_at TIMESTAMP WITH TIME ZONE,
  marketing_consent BOOLEAN NOT NULL DEFAULT false
);

-- Create customer addresses table for multiple delivery addresses
CREATE TABLE public.customer_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  label TEXT NOT NULL, -- e.g., 'Home', 'Work', 'Other'
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'ID',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add customer_id to orders table (make it optional for backward compatibility)
ALTER TABLE public.orders 
ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;

-- Create customer sessions table for session management
CREATE TABLE public.customer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers table
CREATE POLICY "Customers can view their own profile" 
ON public.customers 
FOR SELECT 
USING (id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers can update their own profile" 
ON public.customers 
FOR UPDATE 
USING (id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Anyone can create customer accounts" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all customers" 
ON public.customers 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id::text = auth.uid()::text 
  AND role IN ('admin', 'super_admin')
));

-- RLS Policies for customer addresses
CREATE POLICY "Customers can manage their own addresses" 
ON public.customer_addresses 
FOR ALL 
USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Admins can view all customer addresses" 
ON public.customer_addresses 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id::text = auth.uid()::text 
  AND role IN ('admin', 'super_admin')
));

-- RLS Policies for customer sessions
CREATE POLICY "Customers can view their own sessions" 
ON public.customer_sessions 
FOR SELECT 
USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "System can manage sessions" 
ON public.customer_sessions 
FOR ALL 
USING (true);

-- Update orders RLS to allow customers to view their own orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders 
FOR SELECT 
USING (customer_id::text = current_setting('app.current_customer_id', true));

CREATE POLICY "Customers can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (customer_id::text = current_setting('app.current_customer_id', true) OR customer_id IS NULL);

-- Create function to update updated_at column
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at
BEFORE UPDATE ON public.customer_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to ensure only one default address per customer
CREATE OR REPLACE FUNCTION public.ensure_single_default_address()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for default address management
CREATE TRIGGER ensure_single_default_address_trigger
  BEFORE INSERT OR UPDATE ON public.customer_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_default_address();

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customer_addresses_customer_id ON public.customer_addresses(customer_id);
CREATE INDEX idx_customer_sessions_customer_id ON public.customer_sessions(customer_id);
CREATE INDEX idx_customer_sessions_token ON public.customer_sessions(session_token);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);