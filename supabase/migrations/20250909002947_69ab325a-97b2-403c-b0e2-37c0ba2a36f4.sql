-- Create the admin_kemang user that was expected
INSERT INTO users (username, email, password, role, branch_id, is_active, auth_user_id)
VALUES (
  'admin_kemang',
  'admin.kemang@kemchicks.com', 
  'admin123',
  'admin',
  (SELECT id FROM branches LIMIT 1), -- Use first available branch
  true,
  null
);