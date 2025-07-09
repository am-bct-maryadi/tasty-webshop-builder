-- Create tables for FoodieApp
-- Run this SQL in your Supabase SQL Editor

-- Branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table  
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  branch_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  prep_time INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  branch_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promos table
CREATE TABLE IF NOT EXISTS promos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expiry_date DATE NOT NULL,
  branch_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'staff')),
  is_active BOOLEAN DEFAULT true,
  branch_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand settings table
CREATE TABLE IF NOT EXISTS brand_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  website TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  social_media JSONB DEFAULT '{}',
  footer_text TEXT DEFAULT '',
  copyright_text TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data
INSERT INTO branches (id, name, address, is_open) VALUES 
  ('1', 'Downtown Branch', '123 Main Street, Downtown', true),
  ('2', 'Mall Branch', '456 Shopping Center, North Mall', true),
  ('3', 'University Branch', '789 Campus Drive, University District', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, count, branch_id) VALUES
  ('burgers', 'Burgers', 1, '1'),
  ('pizza', 'Pizza', 2, '1'),
  ('salads-2', 'Salads', 1, '2'),
  ('beverages-2', 'Beverages', 1, '2'),
  ('pizza-3', 'Pizza', 1, '3')
ON CONFLICT (id) DO NOTHING;

INSERT INTO promos (id, code, type, value, min_order_amount, is_active, expiry_date, branch_id) VALUES
  ('1', 'WELCOME20', 'percentage', 20, 50, true, '2024-12-31', '1'),
  ('2', 'SAVE10', 'fixed', 10, 30, true, '2024-06-30', '2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, email, role, is_active, branch_id) VALUES
  ('1', 'admin', 'admin@foodieapp.com', 'admin', true, 'all'),
  ('2', 'manager1', 'manager@foodieapp.com', 'manager', true, '1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO brand_settings (company_name, tagline, description, website, email, phone, address, social_media, footer_text, copyright_text) VALUES
  ('FoodieApp', 'Delicious food delivered to your door', 'We are a premium food delivery service committed to bringing you the best meals from top restaurants in your area.', 'https://foodieapp.com', 'contact@foodieapp.com', '+1 (555) 123-4567', '123 Food Street, Culinary City, FC 12345', '{"facebook": "https://facebook.com/foodieapp", "twitter": "https://twitter.com/foodieapp", "instagram": "https://instagram.com/foodieapp", "linkedin": "https://linkedin.com/company/foodieapp"}', 'Your favorite meals, delivered fresh and fast.', '© 2024 FoodieApp. All rights reserved.')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can make these more restrictive later)
CREATE POLICY "Allow all operations on branches" ON branches FOR ALL USING (true);
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations on promos" ON promos FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on brand_settings" ON brand_settings FOR ALL USING (true);