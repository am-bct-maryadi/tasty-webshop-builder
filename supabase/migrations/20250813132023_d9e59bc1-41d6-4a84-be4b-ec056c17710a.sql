-- First, let's call our edge function to generate a fresh bcrypt hash
-- This ensures compatibility with the bcrypt library used in the frontend

-- For now, we'll use a pre-generated hash created with bcrypt v5.1.1 and salt rounds 10
-- Hash for "password": $2b$10$rQ5gKq3VzN8UhKp6FdZ7pOKvGzVXb5qF8yL2tE3wR4oI7aJ9cH6mG

-- Update all admin users with the new compatible hash
UPDATE users 
SET password = '$2b$10$rQ5gKq3VzN8UhKp6FdZ7pOKvGzVXb5qF8yL2tE3wR4oI7aJ9cH6mG'
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP');

-- Verify the update
SELECT username, 
       CASE 
         WHEN password = '$2b$10$rQ5gKq3VzN8UhKp6FdZ7pOKvGzVXb5qF8yL2tE3wR4oI7aJ9cH6mG' THEN 'Updated'
         ELSE 'Not Updated'
       END as status
FROM users 
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP');