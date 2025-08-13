-- Update all user passwords to "password" using bcrypt hash
-- The bcrypt hash for "password" with salt rounds 6
UPDATE users SET password = '$2a$06$EIRmBdwHNKnhpdQghTM0De0CCQhcplhGHa2FvvBE.XJpiyX4B8YTi' 
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP');