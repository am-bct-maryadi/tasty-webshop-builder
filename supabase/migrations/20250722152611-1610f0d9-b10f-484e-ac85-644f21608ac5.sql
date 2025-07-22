-- Set passwords for admin users
UPDATE public.users 
SET password = 'admin123' 
WHERE role = 'admin' AND password IS NULL;