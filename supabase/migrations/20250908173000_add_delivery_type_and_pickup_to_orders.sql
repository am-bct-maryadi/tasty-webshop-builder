-- Add delivery_type, pickup_time, and pickup_branch to orders table

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_type TEXT CHECK (delivery_type IN ('delivery', 'pickup')) DEFAULT 'delivery';

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS pickup_time TIMESTAMP WITH TIME ZONE NULL;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS pickup_branch UUID REFERENCES public.branches(id) ON DELETE SET NULL;