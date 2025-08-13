-- CRITICAL SECURITY FIX: Secure Users Table with Password Hashing and RLS (CORRECTED)
-- This migration addresses the critical security vulnerability in the users table

-- First, create a function to hash existing plaintext passwords
CREATE OR REPLACE FUNCTION hash_existing_passwords()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    hashed_pwd TEXT;
BEGIN
    -- Loop through all users with plaintext passwords
    FOR user_record IN 
        SELECT id, password FROM users 
        WHERE password IS NOT NULL 
        AND LENGTH(password) < 60 -- bcrypt hashes are 60 characters
    LOOP
        -- Hash the password using crypt with bcrypt
        hashed_pwd := crypt(user_record.password, gen_salt('bf'));
        
        -- Update the user's password with the hashed version
        UPDATE users 
        SET password = hashed_pwd 
        WHERE id = user_record.id;
    END LOOP;
END;
$$;

-- Execute the password hashing function
SELECT hash_existing_passwords();

-- Drop the function after use (security best practice)
DROP FUNCTION hash_existing_passwords();

-- Drop the existing permissive policy
DROP POLICY IF EXISTS "Allow all operations on users" ON users;

-- Create secure RLS policies for users table
CREATE POLICY "Users can read their own profile" 
ON users FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can read all users from their branch" 
ON users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.id::text = auth.uid()::text 
    AND admin_user.role IN ('admin', 'super_admin')
    AND (admin_user.role = 'super_admin' OR admin_user.branch_id = users.branch_id)
  )
);

CREATE POLICY "Only super admins can create users" 
ON users FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

-- FIXED: Removed OLD/NEW references which are invalid in RLS policies
CREATE POLICY "Users can update their own basic profile" 
ON users FOR UPDATE 
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admins can update users in their branch" 
ON users FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.id::text = auth.uid()::text 
    AND admin_user.role IN ('admin', 'super_admin')
    AND (admin_user.role = 'super_admin' OR admin_user.branch_id = users.branch_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users admin_user
    WHERE admin_user.id::text = auth.uid()::text 
    AND admin_user.role IN ('admin', 'super_admin')
    AND (admin_user.role = 'super_admin' OR admin_user.branch_id = users.branch_id)
  )
);

CREATE POLICY "Only super admins can delete users" 
ON users FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id::text = auth.uid()::text 
    AND u.role = 'super_admin'
  )
);

-- Create trigger to prevent role/branch changes by non-admins
CREATE OR REPLACE FUNCTION prevent_unauthorized_role_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow super admins to change anything
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text 
    AND role = 'super_admin'
  ) THEN
    RETURN NEW;
  END IF;
  
  -- For regular users updating their own profile
  IF auth.uid()::text = NEW.id::text THEN
    -- Prevent role changes
    IF OLD.role != NEW.role THEN
      RAISE EXCEPTION 'Users cannot change their own role';
    END IF;
    
    -- Prevent branch changes
    IF OLD.branch_id != NEW.branch_id THEN
      RAISE EXCEPTION 'Users cannot change their own branch';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER users_role_protection_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_unauthorized_role_changes();

-- Enable pgcrypto extension for password hashing (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;