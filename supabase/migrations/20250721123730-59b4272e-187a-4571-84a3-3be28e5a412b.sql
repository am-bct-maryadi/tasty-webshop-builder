-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  promo_code text,
  notes text,
  branch_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Allow all operations on orders" 
ON public.orders 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert admin users for each branch
INSERT INTO public.users (username, email, role, branch_id, is_active) VALUES 
('admin_downtown', 'admin.downtown@foodieapp.com', 'admin', (SELECT id FROM public.branches WHERE name = 'Downtown Branch'), true),
('admin_mall', 'admin.mall@foodieapp.com', 'admin', (SELECT id FROM public.branches WHERE name = 'Mall Branch'), true),
('admin_university', 'admin.university@foodieapp.com', 'admin', (SELECT id FROM public.branches WHERE name = 'University Branch'), true)
ON CONFLICT (email) DO NOTHING;