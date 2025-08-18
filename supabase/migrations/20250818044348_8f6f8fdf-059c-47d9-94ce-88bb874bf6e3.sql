-- Set a valid logo URL from uploaded files to immediately fix the display issue
UPDATE brand_settings 
SET logo = 'https://pelytyjonytekqdiwjri.supabase.co/storage/v1/object/public/brand-assets/1755491326350-s0c8f.png',
    updated_at = now()
WHERE id = (
  SELECT id 
  FROM brand_settings 
  ORDER BY updated_at DESC 
  LIMIT 1
);