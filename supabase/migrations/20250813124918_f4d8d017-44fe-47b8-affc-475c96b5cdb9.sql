-- Create storage buckets for persistent image storage
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('product-images', 'product-images', true),
  ('brand-assets', 'brand-assets', true);

-- Create RLS policies for product images bucket
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role IN ('admin', 'super_admin')
  )
);

-- Create RLS policies for brand assets bucket
CREATE POLICY "Brand assets are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'brand-assets');

CREATE POLICY "Admins can upload brand assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'brand-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update brand assets" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'brand-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can delete brand assets" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'brand-assets' 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id::text = auth.uid()::text 
    AND role IN ('admin', 'super_admin')
  )
);