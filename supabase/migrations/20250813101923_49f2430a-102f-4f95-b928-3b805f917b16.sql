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
    SELECT 1 FROM users current_user 
    WHERE current_user.id::text = auth.uid()::text 
    AND current_user.role IN ('admin', 'super_admin')
    AND (current_user.role = 'super_admin' OR current_user.branch_id = users.branch_id)
  )
);

CREATE POLICY "Admins can create users in their branch" 
ON users FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users current_user 
    WHERE current_user.id::text = auth.uid()::text 
    AND current_user.role IN ('admin', 'super_admin')
    AND (current_user.role = 'super_admin' OR current_user.branch_id = NEW.branch_id)
  )
);

CREATE POLICY "Admins can update users in their branch" 
ON users FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users current_user 
    WHERE current_user.id::text = auth.uid()::text 
    AND current_user.role IN ('admin', 'super_admin')
    AND (current_user.role = 'super_admin' OR current_user.branch_id = users.branch_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users current_user 
    WHERE current_user.id::text = auth.uid()::text 
    AND current_user.role IN ('admin', 'super_admin')
    AND (current_user.role = 'super_admin' OR current_user.branch_id = NEW.branch_id)
  )
);

CREATE POLICY "Super admins can delete users" 
ON users FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users current_user 
    WHERE current_user.id::text = auth.uid()::text 
    AND current_user.role = 'super_admin'
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

-- Step 3: Secure Brand Settings Table RLS Policies
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Allow all operations on brand_settings" ON brand_settings;

-- Create tiered access policies for brand_settings
CREATE POLICY "Public can read basic branding info" 
ON brand_settings FOR SELECT 
USING (true);

CREATE POLICY "Only admins can update brand settings" 
ON brand_settings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

CREATE POLICY "Only super admins can insert brand settings" 
ON brand_settings FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
    AND users.is_active = true
  )
);

CREATE POLICY "Only super admins can delete brand settings" 
ON brand_settings FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
    AND users.is_active = true
  )
);

-- Step 4: Secure Branches Table RLS Policies
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Allow all operations on branches" ON branches;

-- Create tiered access policies for branches
CREATE POLICY "Public can read basic branch info" 
ON branches FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create branches" 
ON branches FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

CREATE POLICY "Only admins can update branches" 
ON branches FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

CREATE POLICY "Only super admins can delete branches" 
ON branches FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
    AND users.is_active = true
  )
);

-- Step 5: Fix update_updated_at_column function security
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;