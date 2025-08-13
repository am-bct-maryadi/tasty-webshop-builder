-- PHASE 1 SECURITY FIXES: Secure Branches Table
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Allow all operations on branches" ON branches;

-- Create secure policies for branches table
CREATE POLICY "Anyone can read basic branch info" 
ON branches FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can read branch contact details" 
ON branches FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can create branches" 
ON branches FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Only admins can update branches" 
ON branches FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
    AND (u.role = 'super_admin' OR u.branch_id::text = branches.id::text)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
    AND (u.role = 'super_admin' OR u.branch_id::text = branches.id::text)
  )
);

CREATE POLICY "Only super admins can delete branches" 
ON branches FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);