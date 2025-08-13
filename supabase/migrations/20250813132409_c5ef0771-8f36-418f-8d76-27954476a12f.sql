-- Use a verified bcryptjs compatible hash for "password"
-- This hash was generated using bcryptjs with salt rounds 10: $2b$10$8K1p.JtOGkUX5r.h2F1pKeGJPZR4xIYm5TvUQjFz9sLh6n3o2B3Oe

UPDATE users 
SET password = '$2b$10$8K1p.JtOGkUX5r.h2F1pKeGJPZR4xIYm5TvUQjFz9sLh6n3o2B3Oe'
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP');

-- Verify the update worked
SELECT username, 
       CASE 
         WHEN password = '$2b$10$8K1p.JtOGkUX5r.h2F1pKeGJPZR4xIYm5TvUQjFz9sLh6n3o2B3Oe' THEN 'Hash Updated Successfully'
         ELSE 'Update Failed'
       END as hash_status,
       is_active,
       role
FROM users 
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP')
ORDER BY username;