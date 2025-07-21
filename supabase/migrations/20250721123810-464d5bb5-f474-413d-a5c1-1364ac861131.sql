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
  branch_id text NOT NULL,
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

-- Create trigger for automatic timestamp updates if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
        CREATE TRIGGER update_orders_updated_at
            BEFORE UPDATE ON public.orders
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

-- Insert admin users for each branch with correct branch IDs
INSERT INTO public.users (username, email, role, branch_id, is_active) VALUES 
('admin_golf_island', 'admin.golf@kemchicks.com', 'admin', 'e8191944-83b5-4818-ac68-c9764cbf1b40', true),
('admin_kemang', 'admin.kemang@kemchicks.com', 'admin', '5793079a-f4e1-424c-a8df-0f0f8efa1e7f', true),
('admin_pacific', 'admin.pacific@kemchicks.com', 'admin', '9f127932-6b68-42a9-8934-e5712c29e3b7', true)
ON CONFLICT (email) DO NOTHING;