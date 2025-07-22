import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/components/product/ProductCard';
import type { Category } from '@/components/product/CategoryFilter';
import { useDatabase } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';

interface Branch {
  id: string;
  name: string;
  address: string;
  whatsappNumber?: string;
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
  branchId: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  branchId: string;
}

interface BrandSettings {
  companyName: string;
  logo: string;
  tagline: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  footerText: string;
  copyrightText: string;
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

interface Order {
  id: string;
  customerName: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  branchId: string;
}

interface InventoryItem {
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'customers' | 'staff';
  channel: 'push' | 'email' | 'sms';
  sentAt: string;
  recipients: number;
}

interface ReleaseNote {
  id: string;
  version: string;
  title: string;
  description: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  category: 'feature' | 'improvement' | 'bugfix' | 'security';
  changes: Array<{
    id: string;
    description: string;
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  }>;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  inventory: boolean;
  system: boolean;
}

interface AdminContextType {
  // Branch Management
  selectedAdminBranch: string | null;
  setSelectedAdminBranch: (branchId: string | null) => void;
  
  // Products (filtered by branch)
  products: Product[];
  allProducts: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Categories (filtered by branch)
  categories: Category[];
  allCategories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'count'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Branches
  branches: Branch[];
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
  
  // Promos (filtered by branch)
  promos: Promo[];
  allPromos: Promo[];
  addPromo: (promo: Omit<Promo, 'id'>) => void;
  updatePromo: (id: string, promo: Partial<Promo>) => void;
  deletePromo: (id: string) => void;
  
  // Users (filtered by branch)
  users: User[];
  allUsers: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Brand Settings
  brandSettings: BrandSettings;
  updateBrandSettings: (settings: Partial<BrandSettings>) => void;
  
  // Theme Settings
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  
  // Orders (for analytics)
  orders: Order[];
  analytics: any;
  
  // Inventory Management
  inventory: Record<string, InventoryItem>;
  updateInventory: (productId: string, quantity: number, operation: 'add' | 'subtract' | 'set', notes?: string) => void;
  addInventoryLog: (productId: string, operation: string, quantity: number, notes?: string) => void;
  getInventoryAlerts: () => any[];
  
  // Release Notes
  releaseNotes: ReleaseNote[];
  addReleaseNote: (note: Omit<ReleaseNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReleaseNote: (id: string, note: Partial<ReleaseNote>) => void;
  deleteReleaseNote: (id: string) => void;
  publishReleaseNote: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  sendNotification: (notification: Omit<Notification, 'id' | 'sentAt' | 'recipients'>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
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
    isPopular: true,
    branchId: '1'
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
    isPopular: true,
    branchId: '1'
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
    isAvailable: true,
    branchId: '2'
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
    isAvailable: true,
    branchId: '2'
  },
  {
    id: '5',
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella and tomato sauce',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=400&fit=crop',
    category: 'pizza',
    rating: 4.8,
    prepTime: 20,
    isAvailable: true,
    branchId: '3'
  }
];

const initialCategories: Category[] = [
  { id: 'burgers', name: 'Burgers', count: 1, branchId: '1' },
  { id: 'pizza', name: 'Pizza', count: 2, branchId: '1' },
  { id: 'salads-2', name: 'Salads', count: 1, branchId: '2' },
  { id: 'beverages-2', name: 'Beverages', count: 1, branchId: '2' },
  { id: 'pizza-3', name: 'Pizza', count: 1, branchId: '3' }
];

const initialBranches: Branch[] = [
  {
    id: '1',
    name: 'Downtown Branch',
    address: '123 Main Street, Downtown',
    whatsappNumber: '628158882505',
    isOpen: true
  },
  {
    id: '2', 
    name: 'Mall Branch',
    address: '456 Shopping Center, North Mall',
    whatsappNumber: '628158882506',
    isOpen: true
  },
  {
    id: '3',
    name: 'University Branch',
    address: '789 Campus Drive, University District',
    whatsappNumber: '628158882507',
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
    expiryDate: '2024-12-31',
    branchId: '1'
  },
  {
    id: '2',
    code: 'SAVE10',
    type: 'fixed',
    value: 10,
    minOrderAmount: 30,
    isActive: true,
    expiryDate: '2024-06-30',
    branchId: '2'
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@foodieapp.com',
    role: 'admin',
    isActive: true,
    branchId: 'all'
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager@foodieapp.com',
    role: 'manager',
    isActive: true,
    branchId: '1'
  }
];

const initialBrandSettings: BrandSettings = {
  companyName: 'FoodieApp',
  logo: '',
  tagline: 'Delicious food delivered to your door',
  description: 'We are a premium food delivery service committed to bringing you the best meals from top restaurants in your area.',
  website: 'https://foodieapp.com',
  email: 'contact@foodieapp.com',
  phone: '+1 (555) 123-4567',
  address: '123 Food Street, Culinary City, FC 12345',
  socialMedia: {
    facebook: 'https://facebook.com/foodieapp',
    twitter: 'https://twitter.com/foodieapp',
    instagram: 'https://instagram.com/foodieapp',
    linkedin: 'https://linkedin.com/company/foodieapp',
  },
  footerText: 'Your favorite meals, delivered fresh and fast.',
  copyrightText: '© 2024 FoodieApp. All rights reserved.',
};

const initialThemeSettings: ThemeSettings = {
  primaryColor: '#2563eb',
  accentColor: '#7c3aed',
  fontFamily: 'inter',
  fontSize: 14,
  borderRadius: 8,
  darkModeEnabled: false,
  compactMode: false
};

const initialOrders: Order[] = [];

const initialInventory: Record<string, InventoryItem> = {
  '1': { quantity: 50, lowStockThreshold: 10, lastUpdated: new Date().toISOString() },
  '2': { quantity: 30, lowStockThreshold: 5, lastUpdated: new Date().toISOString() },
  '3': { quantity: 5, lowStockThreshold: 10, lastUpdated: new Date().toISOString() },
  '4': { quantity: 100, lowStockThreshold: 20, lastUpdated: new Date().toISOString() },
};

const initialReleaseNotes: ReleaseNote[] = [
  {
    id: '1',
    version: '1.0.0',
    title: 'Initial Launch',
    description: 'Welcome to FoodieApp! Our initial release includes all core features.',
    type: 'major',
    category: 'feature',
    changes: [
      { id: '1', description: 'Product catalog with categories and filters', type: 'added' },
      { id: '2', description: 'Branch selection and management', type: 'added' },
      { id: '3', description: 'Shopping cart functionality', type: 'added' },
      { id: '4', description: 'Admin panel with full CMS', type: 'added' },
      { id: '5', description: 'Inventory management system', type: 'added' },
    ],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const initialNotifications: Notification[] = [];

const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  orderUpdates: true,
  promotions: true,
  inventory: true,
  system: true,
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [selectedAdminBranch, setSelectedAdminBranch] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const db = useDatabase();
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // Filtered data based on selected admin branch
  const products = selectedAdminBranch 
    ? allProducts.filter(p => p.branchId === selectedAdminBranch)
    : allProducts;
    
  const categories = selectedAdminBranch 
    ? allCategories.filter(c => c.branchId === selectedAdminBranch)
    : allCategories;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [allPromos, setAllPromos] = useState<Promo[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Filtered data based on selected admin branch
  const promos = selectedAdminBranch 
    ? allPromos.filter(p => p.branchId === selectedAdminBranch)
    : allPromos;
    
  const users = selectedAdminBranch 
    ? allUsers.filter(u => u.branchId === selectedAdminBranch || u.branchId === 'all')
    : allUsers;

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(initialBrandSettings);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('foodieapp-theme');
    return saved ? JSON.parse(saved) : initialThemeSettings;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('foodieapp-orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>(() => {
    const saved = localStorage.getItem('foodieapp-inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>(() => {
    const saved = localStorage.getItem('foodieapp-release-notes');
    return saved ? JSON.parse(saved) : initialReleaseNotes;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('foodieapp-notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('foodieapp-notification-settings');
    return saved ? JSON.parse(saved) : initialNotificationSettings;
  });

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [products, categories, branchesData, promos, users, brandData] = await Promise.all([
          db.getProducts(),
          db.getCategories(),
          db.getBranches(),
          db.getPromos(),
          db.getUsers(),
          db.getBrandSettings(),
        ]);

        setAllProducts(products);
        
        // Update categories with proper counts
        const updatedCategories = categories.map(cat => ({
          ...cat,
          count: products.filter(p => p.category === cat.id && p.branchId === cat.branchId).length
        }));
        setAllCategories(updatedCategories);
        
        setBranches(branchesData);
        setAllPromos(promos);
        setAllUsers(users);
        
        if (brandData) {
          setBrandSettings(brandData);
        }

        // Set default branch selection to the first branch to avoid data clustering
        if (branchesData && branchesData.length > 0 && !selectedAdminBranch) {
          setSelectedAdminBranch(branchesData[0].id);
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Use fallback data from database if available
        setAllProducts(initialProducts);
        setAllCategories(initialCategories);
        setBranches(initialBranches);
        setAllPromos(initialPromos);
        setAllUsers(initialUsers);
        setBrandSettings(initialBrandSettings);
        setThemeSettings(initialThemeSettings);
        
        toast({
          title: "Error",
          description: "Failed to load data from database. Using default values.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save localStorage items that still use localStorage (theme, orders, etc.)
  useEffect(() => {
    localStorage.setItem('foodieapp-theme', JSON.stringify(themeSettings));
  }, [themeSettings]);

  useEffect(() => {
    localStorage.setItem('foodieapp-orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foodieapp-inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('foodieapp-release-notes', JSON.stringify(releaseNotes));
  }, [releaseNotes]);

  useEffect(() => {
    localStorage.setItem('foodieapp-notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('foodieapp-notification-settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Product CRUD
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const productWithBranch = {
        ...productData,
        branchId: productData.branchId || selectedAdminBranch || '1',
      };
      const newProduct = await db.addProduct(productWithBranch);
      setAllProducts(prev => [...prev, newProduct]);
      updateCategoryCount();
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await db.updateProduct(id, productData);
      setAllProducts(prev => prev.map(product => 
        product.id === id ? updatedProduct : product
      ));
      updateCategoryCount();
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await db.deleteProduct(id);
      setAllProducts(prev => prev.filter(product => product.id !== id));
      updateCategoryCount();
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  // Category CRUD
  const addCategory = async (categoryData: Omit<Category, 'id' | 'count'>) => {
    try {
      const categoryWithId = {
        ...categoryData,
        id: `${categoryData.name.toLowerCase().replace(/\s+/g, '-')}-${selectedAdminBranch || '1'}`,
        branchId: categoryData.branchId || selectedAdminBranch || '1',
      };
      const newCategory = await db.addCategory(categoryWithId);
      setAllCategories(prev => [...prev, newCategory]);
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updatedCategory = await db.updateCategory(id, categoryData);
      setAllCategories(prev => prev.map(category => 
        category.id === id ? updatedCategory : category
      ));
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await db.deleteCategory(id);
      setAllCategories(prev => prev.filter(category => category.id !== id));
      // Remove products in this category
      const productsToDelete = allProducts.filter(product => product.category === id);
      for (const product of productsToDelete) {
        await db.deleteProduct(product.id);
      }
      setAllProducts(prev => prev.filter(product => product.category !== id));
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Branch CRUD
  const addBranch = async (branchData: Omit<Branch, 'id'>) => {
    try {
      const newBranch = await db.addBranch(branchData);
      setBranches(prev => [...prev, newBranch]);
      toast({
        title: "Success",
        description: "Branch added successfully",
      });
    } catch (error) {
      console.error('Error adding branch:', error);
      toast({
        title: "Error",
        description: "Failed to add branch",
        variant: "destructive",
      });
    }
  };

  const updateBranch = async (id: string, branchData: Partial<Branch>) => {
    try {
      const updatedBranch = await db.updateBranch(id, branchData);
      setBranches(prev => prev.map(branch => 
        branch.id === id ? updatedBranch : branch
      ));
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
    } catch (error) {
      console.error('Error updating branch:', error);
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await db.deleteBranch(id);
      setBranches(prev => prev.filter(branch => branch.id !== id));
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  // Promo CRUD
  const addPromo = async (promoData: Omit<Promo, 'id'>) => {
    try {
      const newPromo = await db.addPromo(promoData);
      setAllPromos(prev => [...prev, newPromo]);
      toast({
        title: "Success",
        description: "Promo added successfully",
      });
    } catch (error) {
      console.error('Error adding promo:', error);
      toast({
        title: "Error",
        description: "Failed to add promo",
        variant: "destructive",
      });
    }
  };

  const updatePromo = async (id: string, promoData: Partial<Promo>) => {
    try {
      const updatedPromo = await db.updatePromo(id, promoData);
      setAllPromos(prev => prev.map(promo => 
        promo.id === id ? updatedPromo : promo
      ));
      toast({
        title: "Success",
        description: "Promo updated successfully",
      });
    } catch (error) {
      console.error('Error updating promo:', error);
      toast({
        title: "Error",
        description: "Failed to update promo",
        variant: "destructive",
      });
    }
  };

  const deletePromo = async (id: string) => {
    try {
      await db.deletePromo(id);
      setAllPromos(prev => prev.filter(promo => promo.id !== id));
      toast({
        title: "Success",
        description: "Promo deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting promo:', error);
      toast({
        title: "Error",
        description: "Failed to delete promo",
        variant: "destructive",
      });
    }
  };

  // User CRUD
  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = await db.addUser(userData);
      setAllUsers(prev => [...prev, newUser]);
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await db.updateUser(id, userData);
      setAllUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await db.deleteUser(id);
      setAllUsers(prev => prev.filter(user => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // Brand Settings
  const updateBrandSettings = async (settingsData: Partial<BrandSettings>) => {
    try {
      const updatedSettings = { ...brandSettings, ...settingsData };
      await db.updateBrandSettings(updatedSettings);
      setBrandSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Brand settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating brand settings:', error);
      toast({
        title: "Error",
        description: "Failed to update brand settings",
        variant: "destructive",
      });
    }
  };

  // Theme Settings
  const updateThemeSettings = async (settingsData: Partial<ThemeSettings>) => {
    try {
      const updatedSettings = { ...themeSettings, ...settingsData };
      // Store theme settings in database as part of brand settings
      await db.updateBrandSettings({ ...brandSettings, themeSettings: updatedSettings } as any);
      setThemeSettings(updatedSettings);
      
      // Apply theme changes to document with proper HSL format
      if (settingsData.primaryColor) {
        const primaryHsl = hexToHsl(settingsData.primaryColor);
        document.documentElement.style.setProperty('--primary', primaryHsl);
      }
      if (settingsData.accentColor) {
        const accentHsl = hexToHsl(settingsData.accentColor);
        document.documentElement.style.setProperty('--accent', accentHsl);
      }
      if (settingsData.fontFamily) {
        document.body.style.fontFamily = settingsData.fontFamily;
      }
      
      toast({
        title: "Success",
        description: "Theme settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating theme settings:', error);
      toast({
        title: "Error",
        description: "Failed to update theme settings",
        variant: "destructive",
      });
    }
  };

  // Helper function to convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Inventory Management
  const updateInventory = (productId: string, quantity: number, operation: 'add' | 'subtract' | 'set', notes?: string) => {
    setInventory(prev => {
      const current = prev[productId] || { quantity: 0, lowStockThreshold: 10, lastUpdated: new Date().toISOString() };
      let newQuantity = current.quantity;
      
      switch (operation) {
        case 'add':
          newQuantity += quantity;
          break;
        case 'subtract':
          newQuantity = Math.max(0, current.quantity - quantity);
          break;
        case 'set':
          newQuantity = quantity;
          break;
      }
      
      return {
        ...prev,
        [productId]: {
          ...current,
          quantity: newQuantity,
          lastUpdated: new Date().toISOString(),
        }
      };
    });
    
    addInventoryLog(productId, operation, quantity, notes);
  };

  const addInventoryLog = (productId: string, operation: string, quantity: number, notes?: string) => {
    // In a real app, this would add to an inventory log table
    console.log(`Inventory log: ${operation} ${quantity} units for product ${productId}. Notes: ${notes || 'None'}`);
  };

  const getInventoryAlerts = () => {
    return Object.entries(inventory).filter(([productId, item]) => 
      item.quantity <= item.lowStockThreshold
    ).map(([productId, item]) => ({
      productId,
      currentStock: item.quantity,
      threshold: item.lowStockThreshold,
    }));
  };

  // Release Notes
  const addReleaseNote = (noteData: Omit<ReleaseNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: ReleaseNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReleaseNotes(prev => [newNote, ...prev]);
  };

  const updateReleaseNote = (id: string, noteData: Partial<ReleaseNote>) => {
    setReleaseNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...noteData, updatedAt: new Date().toISOString() } 
        : note
    ));
  };

  const deleteReleaseNote = (id: string) => {
    setReleaseNotes(prev => prev.filter(note => note.id !== id));
  };

  const publishReleaseNote = (id: string) => {
    setReleaseNotes(prev => prev.map(note => 
      note.id === id 
        ? { 
            ...note, 
            isPublished: true, 
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } 
        : note
    ));
  };

  // Notifications
  const sendNotification = (notificationData: Omit<Notification, 'id' | 'sentAt' | 'recipients'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      sentAt: new Date().toISOString(),
      recipients: notificationData.target === 'all' ? 1000 : notificationData.target === 'customers' ? 800 : 200,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateNotificationSettings = (settingsData: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settingsData }));
  };

  // Update category counts based on products for specific branch
  const updateCategoryCount = () => {
    setAllCategories(prev => prev.map(category => {
      const categoryProducts = allProducts.filter(product => 
        product.category === category.name.toLowerCase().replace(/\s+/g, '-') && 
        product.branchId === category.branchId
      );
      return {
        ...category,
        count: categoryProducts.length
      };
    }));
  };

  const value: AdminContextType = {
    selectedAdminBranch,
    setSelectedAdminBranch,
    products,
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    allCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    branches,
    addBranch,
    updateBranch,
    deleteBranch,
    promos,
    allPromos,
    addPromo,
    updatePromo,
    deletePromo,
    users,
    allUsers,
    addUser,
    updateUser,
    deleteUser,
    brandSettings,
    updateBrandSettings,
    themeSettings,
    updateThemeSettings,
    orders,
    analytics: {},
    inventory,
    updateInventory,
    addInventoryLog,
    getInventoryAlerts,
    releaseNotes,
    addReleaseNote,
    updateReleaseNote,
    deleteReleaseNote,
    publishReleaseNote,
    notifications,
    notificationSettings,
    sendNotification,
    updateNotificationSettings,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};