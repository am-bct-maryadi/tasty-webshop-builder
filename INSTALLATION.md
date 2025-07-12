# Installation Guide for Self-Hosting with MariaDB

This guide will help you deploy this React application on your own web hosting with MariaDB database.

## Prerequisites

- Web hosting with Node.js support (or static file hosting)
- MariaDB/MySQL database access
- FTP/SSH access to your hosting
- Domain name (optional)

## Step 1: Database Setup

### 1.1 Create MariaDB Database

```sql
CREATE DATABASE restaurant_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'restaurant_user'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON restaurant_app.* TO 'restaurant_user'@'%';
FLUSH PRIVILEGES;
```

### 1.2 Create Tables

```sql
USE restaurant_app;

-- Branches table
CREATE TABLE branches (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    whatsapp_number VARCHAR(20),
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brand settings table
CREATE TABLE brand_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    logo TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    address TEXT,
    footer_text TEXT,
    copyright_text TEXT,
    social_media JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    branch_id VARCHAR(36) NOT NULL,
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Products table
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
    prep_time INT,
    rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Promos table
CREATE TABLE promos (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    code VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'percentage' or 'fixed'
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2),
    expiry_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    branch_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    branch_id VARCHAR(36) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);
```

### 1.3 Insert Sample Data

```sql
-- Insert a default branch
INSERT INTO branches (name, address, whatsapp_number) 
VALUES ('Main Branch', '123 Main Street, City', '+1234567890');

-- Insert brand settings
INSERT INTO brand_settings (company_name, tagline, description) 
VALUES ('Your Restaurant', 'Delicious Food Delivered', 'Fresh ingredients, amazing taste');

-- Get the branch ID for sample data
SET @branch_id = (SELECT id FROM branches LIMIT 1);

-- Insert sample categories
INSERT INTO categories (name, branch_id) VALUES 
('Appetizers', @branch_id),
('Main Course', @branch_id),
('Beverages', @branch_id);
```

## Step 2: Application Configuration

### 2.1 Create Database Configuration

Create `src/lib/database.ts`:

```typescript
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'your-database-host',
  user: 'restaurant_user',
  password: 'your_secure_password',
  database: 'restaurant_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const db = mysql.createPool(dbConfig);
```

### 2.2 Replace Supabase Client

Create `src/lib/api.ts`:

```typescript
import { db } from './database';

export const api = {
  // Branches
  async getBranches() {
    const [rows] = await db.execute('SELECT * FROM branches WHERE is_open = TRUE');
    return rows;
  },

  // Products
  async getProducts(branchId: string) {
    const [rows] = await db.execute(
      'SELECT * FROM products WHERE branch_id = ? AND is_available = TRUE',
      [branchId]
    );
    return rows;
  },

  // Categories
  async getCategories(branchId: string) {
    const [rows] = await db.execute(
      'SELECT * FROM categories WHERE branch_id = ?',
      [branchId]
    );
    return rows;
  },

  // Promos
  async getActivePromos(branchId: string) {
    const [rows] = await db.execute(
      'SELECT * FROM promos WHERE branch_id = ? AND is_active = TRUE AND expiry_date >= CURDATE()',
      [branchId]
    );
    return rows;
  },

  // Brand settings
  async getBrandSettings() {
    const [rows] = await db.execute('SELECT * FROM brand_settings LIMIT 1');
    return rows[0];
  }
};
```

## Step 3: Build Application

### 3.1 Install Dependencies

```bash
npm install
npm install mysql2
```

### 3.2 Update Environment Variables

Create `.env.production`:

```
VITE_DB_HOST=your-database-host
VITE_DB_USER=restaurant_user
VITE_DB_PASSWORD=your_secure_password
VITE_DB_NAME=restaurant_app
```

### 3.3 Build for Production

```bash
npm run build
```

This creates a `dist` folder with your built application.

## Step 4: Deploy to Web Hosting

### 4.1 Upload Files

Upload the contents of the `dist` folder to your web hosting's public directory (usually `public_html` or `www`).

### 4.2 Configure Web Server

#### For Apache (.htaccess)

Create `.htaccess` in your public directory:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

#### For Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

## Step 5: Post-Deployment Setup

### 5.1 Create Admin User

Connect to your MariaDB and run:

```sql
INSERT INTO users (username, email, password_hash, role, branch_id) 
VALUES (
    'admin',
    'admin@yourrestaurant.com',
    '$2b$10$your_hashed_password_here',
    'admin',
    (SELECT id FROM branches LIMIT 1)
);
```

### 5.2 Test Your Application

1. Visit your domain
2. Check that products load correctly
3. Test the admin panel at `/admin`
4. Verify WhatsApp integration works

## Step 6: Security Considerations

### 6.1 Database Security

- Use strong passwords
- Limit database user permissions
- Enable SSL for database connections
- Regular backups

### 6.2 Application Security

- Use HTTPS (SSL certificate)
- Keep dependencies updated
- Implement rate limiting
- Monitor access logs

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check database credentials
   - Verify database server is accessible
   - Check firewall settings

2. **Routing Issues**
   - Ensure .htaccess is properly configured
   - Check web server configuration

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## Maintenance

- Regular database backups
- Monitor application logs
- Update dependencies monthly
- Check for security updates

For additional support, check the application logs and database error logs.