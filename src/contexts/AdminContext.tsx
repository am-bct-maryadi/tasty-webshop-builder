import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/components/product/ProductCard';
import type { Category } from '@/components/product/CategoryFilter';

interface Branch {
  id: string;
  name: string;
  address: string;
  isOpen: boolean;
}

interface Promo {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  isActive: boolean;
  expiryDate: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
}

interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  darkModeEnabled: boolean;
  compactMode: boolean;
}

interface AdminContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'count'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Branches
  branches: Branch[];
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
  
  // Promos
  promos: Promo[];
  addPromo: (promo: Omit<Promo, 'id'>) => void;
  updatePromo: (id: string, promo: Partial<Promo>) => void;
  deletePromo: (id: string) => void;
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Theme Settings
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Initial data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and our special sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    category: 'burgers',
    rating: 4.8,
    prepTime: 15,
    isAvailable: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce on crispy dough',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    category: 'pizza',
    rating: 4.9,
    prepTime: 20,
    isAvailable: true,
    isPopular: true
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan, croutons, and caesar dressing',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=400&fit=crop',
    category: 'salads',
    rating: 4.6,
    prepTime: 10,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Iced Coffee',
    description: 'Premium cold brew coffee served with ice and your choice of milk',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    category: 'beverages',
    rating: 4.7,
    prepTime: 5,
    isAvailable: true
  }
];

const initialCategories: Category[] = [
  { id: 'burgers', name: 'Burgers', count: 1 },
  { id: 'pizza', name: 'Pizza', count: 1 },
  { id: 'salads', name: 'Salads', count: 1 },
  { id: 'beverages', name: 'Beverages', count: 1 }
];

const initialBranches: Branch[] = [
  {
    id: '1',
    name: 'Downtown Branch',
    address: '123 Main Street, Downtown',
    isOpen: true
  },
  {
    id: '2', 
    name: 'Mall Branch',
    address: '456 Shopping Center, North Mall',
    isOpen: true
  },
  {
    id: '3',
    name: 'University Branch',
    address: '789 Campus Drive, University District',
    isOpen: false
  }
];

const initialPromos: Promo[] = [
  {
    id: '1',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 50,
    isActive: true,
    expiryDate: '2024-12-31'
  },
  {
    id: '2',
    code: 'SAVE10',
    type: 'fixed',
    value: 10,
    minOrderAmount: 30,
    isActive: true,
    expiryDate: '2024-06-30'
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@foodieapp.com',
    role: 'admin',
    isActive: true
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager@foodieapp.com',
    role: 'manager',
    isActive: true
  }
];

const initialThemeSettings: ThemeSettings = {
  primaryColor: '#2563eb',
  accentColor: '#7c3aed',
  fontFamily: 'inter',
  fontSize: 14,
  borderRadius: 8,
  darkModeEnabled: false,
  compactMode: false
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('foodieapp-products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('foodieapp-categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('foodieapp-branches');
    return saved ? JSON.parse(saved) : initialBranches;
  });

  const [promos, setPromos] = useState<Promo[]>(() => {
    const saved = localStorage.getItem('foodieapp-promos');
    return saved ? JSON.parse(saved) : initialPromos;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('foodieapp-users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('foodieapp-theme');
    return saved ? JSON.parse(saved) : initialThemeSettings;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('foodieapp-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('foodieapp-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('foodieapp-branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('foodieapp-promos', JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem('foodieapp-users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('foodieapp-theme', JSON.stringify(themeSettings));
  }, [themeSettings]);

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    updateCategoryCount();
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...productData } : product
    ));
    updateCategoryCount();
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    updateCategoryCount();
  };

  // Category CRUD
  const addCategory = (categoryData: Omit<Category, 'id' | 'count'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...categoryData } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    // Remove products in this category
    setProducts(prev => prev.filter(product => product.category !== id));
  };

  // Branch CRUD
  const addBranch = (branchData: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: Date.now().toString(),
    };
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = (id: string, branchData: Partial<Branch>) => {
    setBranches(prev => prev.map(branch => 
      branch.id === id ? { ...branch, ...branchData } : branch
    ));
  };

  const deleteBranch = (id: string) => {
    setBranches(prev => prev.filter(branch => branch.id !== id));
  };

  // Promo CRUD
  const addPromo = (promoData: Omit<Promo, 'id'>) => {
    const newPromo: Promo = {
      ...promoData,
      id: Date.now().toString(),
    };
    setPromos(prev => [...prev, newPromo]);
  };

  const updatePromo = (id: string, promoData: Partial<Promo>) => {
    setPromos(prev => prev.map(promo => 
      promo.id === id ? { ...promo, ...promoData } : promo
    ));
  };

  const deletePromo = (id: string) => {
    setPromos(prev => prev.filter(promo => promo.id !== id));
  };

  // User CRUD
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Theme Settings
  const updateThemeSettings = (settingsData: Partial<ThemeSettings>) => {
    setThemeSettings(prev => ({ ...prev, ...settingsData }));
  };

  // Update category counts based on products
  const updateCategoryCount = () => {
    setCategories(prev => prev.map(category => ({
      ...category,
      count: products.filter(product => product.category === category.id).length
    })));
  };

  const value: AdminContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    branches,
    addBranch,
    updateBranch,
    deleteBranch,
    promos,
    addPromo,
    updatePromo,
    deletePromo,
    users,
    addUser,
    updateUser,
    deleteUser,
    themeSettings,
    updateThemeSettings,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};