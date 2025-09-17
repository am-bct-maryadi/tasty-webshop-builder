import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/components/product/ProductCard';
import type { Category } from '@/components/product/CategoryFilter';

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
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  branchId: string;
}

interface BrandSettings {
  id?: string;
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

// Utility functions to convert between database and app formats
const dbToProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  price: dbProduct.price,
  image: dbProduct.image,
  category: dbProduct.category,
  rating: dbProduct.rating,
  prepTime: dbProduct.prep_time,
  isAvailable: dbProduct.is_available,
  isPopular: dbProduct.is_popular,
  branchId: dbProduct.branch_id,
});

const productToDb = (product: Omit<Product, 'id'> | Product) => ({
  name: product.name,
  description: product.description,
  price: product.price,
  image: product.image,
  category: product.category,
  rating: product.rating,
  prep_time: product.prepTime,
  is_available: product.isAvailable,
  is_popular: product.isPopular,
  branch_id: product.branchId,
});

const dbToBranch = (dbBranch: any): Branch => ({
  id: dbBranch.id,
  name: dbBranch.name,
  address: dbBranch.address,
  whatsappNumber: dbBranch.whatsapp_number,
  isOpen: dbBranch.is_open,
});

const branchToDb = (branch: Omit<Branch, 'id'>) => ({
  name: branch.name,
  address: branch.address,
  whatsapp_number: branch.whatsappNumber,
  is_open: branch.isOpen,
});

const dbToCategory = (dbCategory: any): Category => ({
  id: dbCategory.id,
  name: dbCategory.name,
  count: dbCategory.count,
  branchId: dbCategory.branch_id,
  sortOrder: dbCategory.sort_order || 0,
});

const categoryToDb = (category: Omit<Category, 'id' | 'count'>) => ({
  name: category.name,
  count: 1,
  branch_id: category.branchId,
  sort_order: category.sortOrder || 0,
});

const dbToPromo = (dbPromo: any): Promo => ({
  id: dbPromo.id,
  code: dbPromo.code,
  type: dbPromo.type,
  value: dbPromo.value,
  minOrderAmount: dbPromo.min_order_amount,
  isActive: dbPromo.is_active,
  expiryDate: dbPromo.expiry_date,
  branchId: dbPromo.branch_id,
});

const promoToDb = (promo: Omit<Promo, 'id'>) => ({
  code: promo.code,
  type: promo.type,
  value: promo.value,
  min_order_amount: promo.minOrderAmount,
  is_active: promo.isActive,
  expiry_date: promo.expiryDate,
  branch_id: promo.branchId,
});

const dbToUser = (dbUser: any): User => ({
  id: dbUser.id,
  username: dbUser.username,
  email: dbUser.email,
  role: dbUser.role,
  isActive: dbUser.is_active,
  branchId: dbUser.branch_id,
});

const userToDb = (user: Omit<User, 'id'>) => ({
  username: user.username,
  email: user.email,
  role: user.role,
  is_active: user.isActive,
  branch_id: user.branchId,
});

const dbToBrandSettings = (dbSettings: any): BrandSettings => ({
  id: dbSettings.id,
  companyName: dbSettings.company_name,
  logo: dbSettings.logo,
  tagline: dbSettings.tagline,
  description: dbSettings.description,
  website: dbSettings.website,
  email: dbSettings.email,
  phone: dbSettings.phone,
  address: dbSettings.address,
  socialMedia: dbSettings.social_media,
  footerText: dbSettings.footer_text,
  copyrightText: dbSettings.copyright_text,
});

const brandSettingsToDb = (settings: BrandSettings) => ({
  company_name: settings.companyName,
  logo: settings.logo,
  tagline: settings.tagline,
  description: settings.description,
  website: settings.website,
  email: settings.email,
  phone: settings.phone,
  address: settings.address,
  social_media: settings.socialMedia,
  footer_text: settings.footerText,
  copyright_text: settings.copyrightText,
  updated_at: new Date().toISOString(),
});

export const useDatabase = () => {
  // Products
  const getProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data.map(dbToProduct);
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert(productToDb(product))
      .select()
      .single();
    if (error) throw error;
    return dbToProduct(data);
  };

  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update(productToDb(product as Product))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return dbToProduct(data);
  };

  const deleteProduct = async (id: string): Promise<void> => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  };

  // Branches
  const getBranches = async (): Promise<Branch[]> => {
    const { data, error } = await supabase.from('branches').select('*');
    if (error) throw error;
    return data.map(dbToBranch);
  };

  const addBranch = async (branch: Omit<Branch, 'id'>): Promise<Branch> => {
    const { data, error } = await supabase
      .from('branches')
      .insert(branchToDb(branch))
      .select()
      .single();
    if (error) throw error;
    return dbToBranch(data);
  };

  const updateBranch = async (id: string, branch: Partial<Branch>): Promise<Branch> => {
    const { data, error } = await supabase
      .from('branches')
      .update(branchToDb(branch as Branch))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return dbToBranch(data);
  };

  const deleteBranch = async (id: string): Promise<void> => {
    const { error } = await supabase.from('branches').delete().eq('id', id);
    if (error) throw error;
  };

  // Categories
  const getCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data.map(dbToCategory);
  };

  const addCategory = async (category: Omit<Category, 'id' | 'count'>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryToDb(category))
      .select()
      .single();
    if (error) throw error;
    return dbToCategory(data);
  };

  const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
    const updateData: any = {};
    if (category.name !== undefined) updateData.name = category.name;
    if (category.sortOrder !== undefined) updateData.sort_order = category.sortOrder;
    
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return dbToCategory(data);
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  };

  // Promos
  const getPromos = async (): Promise<Promo[]> => {
    const { data, error } = await supabase.from('promos').select('*');
    if (error) throw error;
    return data.map(dbToPromo);
  };

  const addPromo = async (promo: Omit<Promo, 'id'>): Promise<Promo> => {
    const { data, error } = await supabase
      .from('promos')
      .insert(promoToDb(promo))
      .select()
      .single();
    if (error) throw error;
    return dbToPromo(data);
  };

  const updatePromo = async (id: string, promo: Partial<Promo>): Promise<Promo> => {
    const { data, error } = await supabase
      .from('promos')
      .update(promoToDb(promo as Promo))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return dbToPromo(data);
  };

  const deletePromo = async (id: string): Promise<void> => {
    const { error } = await supabase.from('promos').delete().eq('id', id);
    if (error) throw error;
  };

  // Users
  const getUsers = async (): Promise<User[]> => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data.map(dbToUser);
  };

  const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .insert(userToDb(user))
      .select()
      .single();
    if (error) throw error;
    return dbToUser(data);
  };

  const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .update(userToDb(user as User))
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return dbToUser(data);
  };

  const deleteUser = async (id: string): Promise<void> => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  };

  // Brand Settings
  const getBrandSettings = async (): Promise<BrandSettings | null> => {
    try {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('[Supabase] Error fetching brand settings:', error);
        if (typeof window !== "undefined") {
          alert('[Supabase] Error fetching brand settings: ' + error.message);
        }
        return null;
      }
      if (!data) {
        console.error('[Supabase] No data returned for brand settings!');
        if (typeof window !== "undefined") {
          alert('[Supabase] No data returned for brand settings!');
        }
        return null;
      }
      return dbToBrandSettings(data);
    } catch (err: any) {
      console.error('[Supabase] Exception fetching brand settings:', err);
      if (typeof window !== "undefined") {
        alert('[Supabase] Exception fetching brand settings: ' + (err?.message || err));
      }
      return null;
    }
  };

  const updateBrandSettings = async (settings: BrandSettings): Promise<BrandSettings> => {
    // Get the most recent brand settings record (same logic as getBrandSettings)
    const { data: existingData } = await supabase
      .from('brand_settings')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let data, error;
    
    if (existingData) {
      // Update the most recent record
      const result = await supabase
        .from('brand_settings')
        .update({
          ...brandSettingsToDb(settings),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from('brand_settings')
        .insert(brandSettingsToDb(settings))
        .select()
        .single();
      data = result.data;
      error = result.error;
    }
    
    if (error) throw error;
    return dbToBrandSettings(data);
  };

  return {
    // Products
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    // Branches
    getBranches,
    addBranch,
    updateBranch,
    deleteBranch,
    // Categories
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    // Promos
    getPromos,
    addPromo,
    updatePromo,
    deletePromo,
    // Users
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    // Brand Settings
    getBrandSettings,
    updateBrandSettings,
  };
};
