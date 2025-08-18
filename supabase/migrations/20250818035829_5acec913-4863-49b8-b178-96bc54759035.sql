-- Clean up invalid blob URLs from brand_settings
UPDATE brand_settings 
SET logo = NULL 
WHERE logo LIKE 'blob:%';

-- Also clean up any blob URLs that might be stored as empty strings or invalid URLs
UPDATE brand_settings 
SET logo = NULL 
WHERE logo = '' OR logo IS NULL OR logo NOT LIKE 'http%';