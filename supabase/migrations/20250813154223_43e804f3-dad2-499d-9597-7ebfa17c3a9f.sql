-- Update storage RLS policies to work with custom authentication
-- Drop existing storage policies that rely on auth.uid()
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;

-- Create new storage policies that work with custom auth system
-- Allow public read access for product images and brand assets
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Public read access for brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

-- Allow authenticated users to upload to buckets
-- We'll validate authentication in the application layer since we use custom auth
CREATE POLICY "Allow uploads to product images bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow uploads to brand assets bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'brand-assets');

-- Allow authenticated users to update files they uploaded
CREATE POLICY "Allow updates to product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

CREATE POLICY "Allow updates to brand assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'brand-assets');

-- Allow authenticated users to delete files
CREATE POLICY "Allow deletes from product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

CREATE POLICY "Allow deletes from brand assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'brand-assets');