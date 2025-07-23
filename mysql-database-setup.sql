-- ============================================
-- FoodieApp MySQL Database Setup
-- ============================================

-- Create database (uncomment if needed)
-- CREATE DATABASE foodieapp;
-- USE foodieapp;

-- ============================================
-- Table: branches
-- ============================================
CREATE TABLE branches (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    whatsapp_number VARCHAR(20),
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: brand_settings
-- ============================================
CREATE TABLE brand_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_name VARCHAR(255) NOT NULL,
    logo TEXT,
    tagline TEXT DEFAULT '',
    description TEXT DEFAULT '',
    address TEXT DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    email VARCHAR(100) DEFAULT '',
    website VARCHAR(255) DEFAULT '',
    social_media JSON DEFAULT '{}',
    footer_text TEXT DEFAULT '',
    copyright_text TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table: categories
-- ============================================
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    branch_id VARCHAR(36) NOT NULL,
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- ============================================
-- Table: products
-- ============================================
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    branch_id VARCHAR(36) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    prep_time INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- ============================================
-- Table: promos
-- ============================================
CREATE TABLE promos (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    branch_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'manager', 'staff') NOT NULL,
    branch_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- ============================================
-- Table: orders
-- ============================================
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    items JSON NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled') DEFAULT 'pending',
    promo_code VARCHAR(50),
    notes TEXT,
    branch_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX idx_products_branch_category ON products(branch_id, category);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_branch_status ON orders(branch_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_promos_code_active ON promos(code, is_active);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_categories_branch ON categories(branch_id);

-- ============================================
-- Sample Data Insertion
-- ============================================

-- Insert sample branches
INSERT INTO branches (id, name, address, whatsapp_number, is_open) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Golf Island', 'Jl. Golf Island No. 123, Jakarta', '+62812345678', TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'Kemang Village', 'Jl. Kemang Raya No. 456, Jakarta', '+62812345679', TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'Pacific Place', 'Jl. Jend. Sudirman No. 789, Jakarta', '+62812345680', TRUE);

-- Insert brand settings
INSERT INTO brand_settings (company_name, tagline, description, address, phone, email) VALUES
('FoodieApp', 'Delicious Food Delivered Fast', 'Your favorite local restaurant chain serving fresh, quality meals since 2020.', '123 Main Street, Jakarta, Indonesia', '+62-21-12345678', 'info@foodieapp.com');

-- Insert sample categories for each branch
INSERT INTO categories (name, branch_id) VALUES
('Appetizers', '550e8400-e29b-41d4-a716-446655440001'),
('Main Course', '550e8400-e29b-41d4-a716-446655440001'),
('Desserts', '550e8400-e29b-41d4-a716-446655440001'),
('Beverages', '550e8400-e29b-41d4-a716-446655440001'),
('Appetizers', '550e8400-e29b-41d4-a716-446655440002'),
('Main Course', '550e8400-e29b-41d4-a716-446655440002'),
('Desserts', '550e8400-e29b-41d4-a716-446655440002'),
('Beverages', '550e8400-e29b-41d4-a716-446655440002'),
('Appetizers', '550e8400-e29b-41d4-a716-446655440003'),
('Main Course', '550e8400-e29b-41d4-a716-446655440003'),
('Desserts', '550e8400-e29b-41d4-a716-446655440003'),
('Beverages', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample promotions
INSERT INTO promos (code, type, value, min_order_amount, expiry_date, branch_id) VALUES
('WELCOME10', 'percentage', 10.00, 50000.00, '2025-12-31', '550e8400-e29b-41d4-a716-446655440001'),
('SAVE20K', 'fixed', 20000.00, 100000.00, '2025-12-31', '550e8400-e29b-41d4-a716-446655440002'),
('NEWUSER15', 'percentage', 15.00, 75000.00, '2025-12-31', '550e8400-e29b-41d4-a716-446655440003');

-- Insert admin users
INSERT INTO users (username, email, password, role, branch_id) VALUES
('admin_golf_island', 'admin.golf@foodieapp.com', 'admin123', 'admin', '550e8400-e29b-41d4-a716-446655440001'),
('admin_kemang', 'admin.kemang@foodieapp.com', 'admin123', 'admin', '550e8400-e29b-41d4-a716-446655440002'),
('admin_pacific', 'admin.pacific@foodieapp.com', 'admin123', 'admin', '550e8400-e29b-41d4-a716-446655440003'),
('ADM_PP', 'admin.pp@foodieapp.com', 'admin123', 'admin', '550e8400-e29b-41d4-a716-446655440003');

-- ============================================
-- Stored Procedures (Optional)
-- ============================================

-- Procedure to update category count
DELIMITER //
CREATE PROCEDURE UpdateCategoryCount(IN category_name VARCHAR(255), IN branch_id_param VARCHAR(36))
BEGIN
    UPDATE categories 
    SET count = (
        SELECT COUNT(*) 
        FROM products 
        WHERE category = category_name 
        AND branch_id = branch_id_param 
        AND is_available = TRUE
    )
    WHERE name = category_name AND branch_id = branch_id_param;
END //
DELIMITER ;

-- ============================================
-- Triggers (Optional)
-- ============================================

-- Trigger to update category count when product is added/updated
DELIMITER //
CREATE TRIGGER update_category_count_after_product_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    CALL UpdateCategoryCount(NEW.category, NEW.branch_id);
END //

CREATE TRIGGER update_category_count_after_product_update
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.category != NEW.category OR OLD.branch_id != NEW.branch_id OR OLD.is_available != NEW.is_available THEN
        CALL UpdateCategoryCount(OLD.category, OLD.branch_id);
        CALL UpdateCategoryCount(NEW.category, NEW.branch_id);
    END IF;
END //

CREATE TRIGGER update_category_count_after_product_delete
AFTER DELETE ON products
FOR EACH ROW
BEGIN
    CALL UpdateCategoryCount(OLD.category, OLD.branch_id);
END //
DELIMITER ;

-- ============================================
-- Views for easier data access (Optional)
-- ============================================

-- View for products with branch information
CREATE VIEW product_details AS
SELECT 
    p.*,
    b.name as branch_name,
    b.address as branch_address
FROM products p
JOIN branches b ON p.branch_id = b.id;

-- View for orders with branch information
CREATE VIEW order_details AS
SELECT 
    o.*,
    b.name as branch_name,
    b.address as branch_address
FROM orders o
JOIN branches b ON o.branch_id = b.id;

-- ============================================
-- Database Setup Complete
-- ============================================

-- To check if everything is created correctly:
-- SHOW TABLES;
-- DESCRIBE branches;
-- DESCRIBE products;
-- SELECT * FROM branches;
-- SELECT * FROM brand_settings;

-- Note: Remember to:
-- 1. Update your connection string to point to this MySQL database
-- 2. Replace Supabase client calls with MySQL queries
-- 3. Handle authentication separately (MySQL doesn't have built-in auth like Supabase)
-- 4. Update all CRUD operations to use SQL instead of Supabase SDK