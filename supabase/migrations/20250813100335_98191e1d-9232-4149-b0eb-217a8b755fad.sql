-- Drop the existing overly permissive policies for users table
DROP POLICY IF EXISTS "Allow all operations on users" ON users;

-- Create secure RLS policies for users table
-- Users can only read their own profile data
CREATE POLICY "Users can read their own profile" ON users
FOR SELECT 
TO authenticated
USING (id::text = auth.uid()::text);

-- Admins can read users from their branch, super admins can read all users
CREATE POLICY "Admins can read users from their branch" ON users
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u 
    WHERE u.id::text = auth.uid()::text 
    AND (
      u.role = 'super_admin' 
      OR (u.role = 'admin' AND u.branch_id = users.branch_id)
    )
  )
);

-- Only super admin can insert new users
CREATE POLICY "Super admin can insert users" ON users
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
  )
);

-- Users can update their own profile (except role and branch_id)
CREATE POLICY "Users can update their own profile" ON users
FOR UPDATE 
TO authenticated
USING (id::text = auth.uid()::text)
WITH CHECK (
  id::text = auth.uid()::text AND
  (OLD.role = NEW.role) AND 
  (OLD.branch_id = NEW.branch_id)
);

-- Super admin can update any user
CREATE POLICY "Super admin can update any user" ON users
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
  )
);

-- Only super admin can delete users
CREATE POLICY "Super admin can delete users" ON users
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
  )
);