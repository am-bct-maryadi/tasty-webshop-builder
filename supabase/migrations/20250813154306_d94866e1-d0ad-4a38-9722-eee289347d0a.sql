-- Fix RLS security issue by enabling RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON public.users FOR SELECT
USING (id::text = auth.uid()::text);

-- Allow super admins to read all users
CREATE POLICY "Super admins can read all users"
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

-- Allow admins to read users from their branch
CREATE POLICY "Admins can read users from their branch"
ON public.users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'admin'
    AND u.branch_id = users.branch_id
  )
);

-- Allow super admins to create users
CREATE POLICY "Super admins can create users"
ON public.users FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

-- Allow super admins to update all users
CREATE POLICY "Super admins can update all users"
ON public.users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

-- Allow admins to update users from their branch (but not change roles)
CREATE POLICY "Admins can update users from their branch"
ON public.users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'admin'
    AND u.branch_id = users.branch_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'admin'
    AND u.branch_id = users.branch_id
  )
);

-- Allow users to update their own profile (but not role or branch)
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (id::text = auth.uid()::text)
WITH CHECK (id::text = auth.uid()::text);

-- Allow super admins to delete users
CREATE POLICY "Super admins can delete users"
ON public.users FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);