-- Fix RLS policies for orders table to ensure admins can see orders

-- First, drop the existing SELECT policies that might be conflicting
DROP POLICY IF EXISTS "Allow authenticated users to read orders from their branch" ON orders;
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;

-- Create proper RLS policies for orders
-- Admins can see all orders (or filtered by their branch)
CREATE POLICY "Admins can view all orders" 
ON orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE (users.id)::text = (auth.uid())::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

-- Customers can view their own orders
CREATE POLICY "Customers can view their own orders" 
ON orders 
FOR SELECT 
USING (
  (customer_id)::text = current_setting('app.current_customer_id', true)
);

-- Allow public to view orders (for guest checkout scenarios)
CREATE POLICY "Public can view orders for guest checkout" 
ON orders 
FOR SELECT 
USING (customer_id IS NULL);