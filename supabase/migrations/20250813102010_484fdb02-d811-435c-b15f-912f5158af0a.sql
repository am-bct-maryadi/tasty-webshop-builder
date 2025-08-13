-- PHASE 1 SECURITY FIXES: Secure RLS Policies and Hash Passwords

-- Step 1: Secure Users Table RLS Policies
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Allow all operations on users" ON users;

-- Create role-based RLS policies for users table
CREATE POLICY "Users can read their own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own basic profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (
  auth.uid()::text = id::text 
  AND OLD.role = NEW.role 
  AND OLD.branch_id = NEW.branch_id
);

CREATE POLICY "Admins can read users from their branch" 
ON users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
    AND (u.role = 'super_admin' OR u.branch_id = users.branch_id)
  )
);

CREATE POLICY "Admins can create users in their branch" 
ON users FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
    AND (u.role = 'super_admin' OR u.branch_id = NEW.branch_id)
  )
);

CREATE POLICY "Admins can update users in their branch" 
ON users FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
    AND (u.role = 'super_admin' OR u.branch_id = users.branch_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
    AND (u.role = 'super_admin' OR u.branch_id = NEW.branch_id)
  )
);

CREATE POLICY "Super admins can delete users" 
ON users FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

-- Step 2: Hash existing passwords using pgcrypto extension
-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash all existing plaintext passwords
UPDATE users 
SET password = crypt(password, gen_salt('bf', 10))
WHERE password IS NOT NULL 
AND password NOT LIKE '$2%'; -- Only hash if not already hashed