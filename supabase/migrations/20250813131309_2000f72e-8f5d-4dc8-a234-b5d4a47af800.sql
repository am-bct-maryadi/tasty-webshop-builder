-- Disable RLS on users table to fix authentication issues with custom auth system
-- This allows the custom AuthContext to properly verify user credentials
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;