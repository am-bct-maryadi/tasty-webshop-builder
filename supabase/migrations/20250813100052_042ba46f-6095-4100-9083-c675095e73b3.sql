-- Drop the existing overly permissive policies for orders table
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Enable read access for all users" ON orders;
DROP POLICY IF EXISTS "Enable insert access for all users" ON orders;
DROP POLICY IF EXISTS "Enable update access for all users" ON orders;

-- Create secure RLS policies for orders table
-- Only authenticated users can insert orders (for order placement)
CREATE POLICY "Allow authenticated users to insert orders" ON orders
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users can read orders from their branch
CREATE POLICY "Allow authenticated users to read orders from their branch" ON orders
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND (
      users.role = 'super_admin' 
      OR users.branch_id = orders.branch_id
    )
  )
);

-- Only authenticated users can update orders from their branch
CREATE POLICY "Allow authenticated users to update orders from their branch" ON orders
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND (
      users.role = 'super_admin' 
      OR users.branch_id = orders.branch_id
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND (
      users.role = 'super_admin' 
      OR users.branch_id = orders.branch_id
    )
  )
);

-- Only super admin can delete orders
CREATE POLICY "Allow super admin to delete orders" ON orders
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id::text = auth.uid()::text 
    AND users.role = 'super_admin'
  )
);