-- Clean up the RLS policies on users table since RLS is now disabled
-- This removes the conflicting policies that were causing infinite recursion
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users from their branch" ON public.users;
DROP POLICY IF EXISTS "Only super admins can create users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own basic profile" ON public.users;
DROP POLICY IF EXISTS "Admins can update users in their branch" ON public.users;
DROP POLICY IF EXISTS "Only super admins can delete users" ON public.users;