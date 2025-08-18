-- Clean up duplicate brand_settings records, keeping only the most recent one
DELETE FROM brand_settings 
WHERE id NOT IN (
  SELECT id 
  FROM brand_settings 
  ORDER BY updated_at DESC 
  LIMIT 1
);