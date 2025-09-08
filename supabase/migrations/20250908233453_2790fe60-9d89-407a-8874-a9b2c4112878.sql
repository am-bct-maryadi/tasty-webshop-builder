-- Update RLS policies for banners to work with linked auth system
-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can create banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can update banners" ON public.banners;
DROP POLICY IF EXISTS "Admins can view all banners" ON public.banners;
DROP POLICY IF EXISTS "Super admins can delete banners" ON public.banners;

-- Create updated policies that use auth_user_id link
CREATE POLICY "Admins can create banners" 
ON public.banners 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can update banners" 
ON public.banners 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);

CREATE POLICY "Admins can view all banners" 
ON public.banners 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'super_admin') 
    AND is_active = true
  )
);

CREATE POLICY "Super admins can delete banners" 
ON public.banners 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE auth_user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  )
);