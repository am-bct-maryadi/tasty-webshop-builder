-- Temporarily use plain text passwords for testing
UPDATE users 
SET password = 'admin123'
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP');

-- Verify update
SELECT username, password, is_active, role
FROM users 
WHERE username IN ('admin_kemang', 'admin_pacific', 'admin_golf_island', 'ADM_PP');