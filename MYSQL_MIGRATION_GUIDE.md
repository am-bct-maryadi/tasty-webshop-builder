# 🔄 MySQL Migration Guide

## Overview
This guide will help you migrate from Supabase to MySQL database for your FoodieApp.

## ⚠️ Important Considerations

**Before migrating, consider:**
- **Code Changes Required**: Extensive modifications needed throughout the app
- **Authentication**: You'll need to implement your own auth system
- **Real-time Features**: MySQL doesn't have built-in real-time subscriptions
- **Hosting Requirements**: Need PHP/Node.js backend support
- **Maintenance**: More server management required

## 📋 Migration Steps

### 1. Database Setup

**Create MySQL Database:**
```sql
-- Run the mysql-database-setup.sql file
mysql -u your_username -p your_database_name < mysql-database-setup.sql
```

**Or via cPanel/phpMyAdmin:**
1. Create new database
2. Import `mysql-database-setup.sql` file
3. Verify all tables are created

### 2. Install MySQL Dependencies

```bash
npm install mysql2
```

### 3. Create Database Connection

Create `src/lib/database.ts`:
```typescript
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost', // Your MySQL host
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'your_database_name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

export const db = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
```

### 4. Create API Layer

Create `src/lib/mysql-api.ts`:
```typescript
import { db } from './database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Branches
export async function getBranches() {
  try {
    const [rows] = await db.execute<RowDataPacket[]>('SELECT * FROM branches WHERE is_open = TRUE');
    return rows;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
}

// Products
export async function getProducts(branchId?: string) {
  try {
    let query = 'SELECT * FROM products WHERE is_available = TRUE';
    let params: any[] = [];
    
    if (branchId) {
      query += ' AND branch_id = ?';
      params.push(branchId);
    }
    
    const [rows] = await db.execute<RowDataPacket[]>(query, params);
    return rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Categories
export async function getCategories(branchId?: string) {
  try {
    let query = 'SELECT * FROM categories';
    let params: any[] = [];
    
    if (branchId) {
      query += ' WHERE branch_id = ?';
      params.push(branchId);
    }
    
    const [rows] = await db.execute<RowDataPacket[]>(query, params);
    return rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

// Orders
export async function createOrder(orderData: any) {
  try {
    const query = `
      INSERT INTO orders (
        customer_name, customer_phone, customer_address, 
        items, subtotal, discount, total, promo_code, notes, branch_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute<ResultSetHeader>(query, [
      orderData.customer_name,
      orderData.customer_phone,
      orderData.customer_address,
      JSON.stringify(orderData.items),
      orderData.subtotal,
      orderData.discount || 0,
      orderData.total,
      orderData.promo_code || null,
      orderData.notes || null,
      orderData.branch_id
    ]);
    
    return { id: result.insertId, ...orderData };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Authentication
export async function authenticateUser(username: string, password: string) {
  try {
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND is_active = TRUE';
    const [rows] = await db.execute<RowDataPacket[]>(query, [username, password]);
    
    if (rows.length > 0) {
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

// Promos
export async function validatePromo(code: string, branchId: string, orderAmount: number) {
  try {
    const query = `
      SELECT * FROM promos 
      WHERE code = ? AND branch_id = ? AND is_active = TRUE 
      AND expiry_date >= CURDATE() AND min_order_amount <= ?
    `;
    
    const [rows] = await db.execute<RowDataPacket[]>(query, [code, branchId, orderAmount]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error validating promo:', error);
    throw error;
  }
}
```

### 5. Update Context Files

**Replace Supabase calls in AdminContext.tsx:**
```typescript
import { getBranches, getProducts, getCategories, authenticateUser } from '@/lib/mysql-api';

// Replace all supabase.from() calls with MySQL API calls
// Example:
const loadBranches = async () => {
  try {
    const branches = await getBranches();
    setBranches(branches);
  } catch (error) {
    console.error('Error loading branches:', error);
  }
};
```

### 6. Update Authentication

**Replace AuthContext.tsx:**
```typescript
import { authenticateUser } from '@/lib/mysql-api';

const login = async (username: string, password: string) => {
  try {
    const user = await authenticateUser(username, password);
    if (user) {
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', user.role === 'admin' ? 'true' : 'false');
      localStorage.setItem('selectedAdminBranch', user.branch_id);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

### 7. Environment Configuration

Create `.env` file:
```
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

**Update database.ts to use environment variables:**
```typescript
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // ... rest of config
};
```

## 🔧 Required Code Changes

### Files to Update:
1. **src/contexts/AdminContext.tsx** - Replace all Supabase calls
2. **src/contexts/AuthContext.tsx** - Implement MySQL authentication
3. **src/pages/admin/*.tsx** - Update all admin pages
4. **src/components/cart/CartSheet.tsx** - Update order creation
5. **src/hooks/useDatabase.ts** - Replace with MySQL hooks

### Remove Files:
- `src/integrations/supabase/` (entire folder)
- `src/lib/supabase.ts`

## 🚨 Migration Challenges

### 1. Real-time Features
**Issue**: MySQL doesn't have real-time subscriptions
**Solution**: Implement polling or WebSocket server

### 2. File Storage
**Issue**: No built-in file storage like Supabase
**Solution**: Use local file storage or cloud services (AWS S3, Cloudinary)

### 3. Authentication
**Issue**: No built-in auth system
**Solution**: Implement JWT tokens or session-based auth

### 4. UUID vs Auto-increment
**Issue**: Different ID generation
**Solution**: Use VARCHAR(36) for UUIDs or switch to auto-increment

## 📊 Performance Considerations

### Optimize Queries:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_products_branch_category ON products(branch_id, category);
CREATE INDEX idx_orders_status_date ON orders(status, created_at);
```

### Connection Pooling:
```typescript
// Use connection pooling for better performance
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database'
});
```

## 🔒 Security Updates

### 1. Password Hashing
```typescript
import bcrypt from 'bcrypt';

// Hash passwords before storing
const hashedPassword = await bcrypt.hash(password, 10);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. SQL Injection Prevention
```typescript
// Always use parameterized queries
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
const [rows] = await db.execute(query, [username, hashedPassword]);
```

## 🧪 Testing Migration

### 1. Test Database Connection
```typescript
import { testConnection } from './lib/database';

testConnection().then(success => {
  if (success) {
    console.log('✅ Database connection working');
  } else {
    console.log('❌ Database connection failed');
  }
});
```

### 2. Test CRUD Operations
```typescript
// Test each API function
const branches = await getBranches();
console.log('Branches:', branches);

const products = await getProducts('branch-id');
console.log('Products:', products);
```

## 📝 Deployment Notes

### cPanel/Shared Hosting:
1. Create MySQL database via cPanel
2. Import SQL file via phpMyAdmin
3. Update connection credentials
4. Test API endpoints

### VPS/Cloud Server:
1. Install MySQL server
2. Create database and user
3. Import schema
4. Configure firewall rules

## 🎯 Recommendation

**Consider keeping Supabase if:**
- You value the built-in features (auth, real-time, storage)
- You want to focus on app features, not infrastructure
- You need real-time updates
- You prefer managed services

**Migrate to MySQL if:**
- You need full control over your database
- You have specific hosting requirements
- You want to reduce external dependencies
- You have existing MySQL infrastructure

---

This migration requires significant development time and testing. Consider the trade-offs carefully before proceeding.