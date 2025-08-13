-- PHASE 1 SECURITY FIXES: Secure Brand Settings Table
-- Drop existing permissive policy
DROP POLICY IF EXISTS "Allow all operations on brand_settings" ON brand_settings;

-- Create tiered access policies for brand_settings
CREATE POLICY "Anyone can read basic branding info" 
ON brand_settings FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can read contact info" 
ON brand_settings FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update brand settings" 
ON brand_settings FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Only super admins can insert brand settings" 
ON brand_settings FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

CREATE POLICY "Only super admins can delete brand settings" 
ON brand_settings FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);