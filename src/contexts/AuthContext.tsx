import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('foodieapp-auth') === 'true';
  });
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('foodieapp-admin') === 'true';
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔍 Login attempt for username:', username);
      console.log('🔍 Password provided:', password);
      
      // Query the users table to find a matching user
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      console.log('🔍 Database query error:', error);
      console.log('🔍 User found:', users ? 'YES' : 'NO');
      if (users) {
        console.log('🔍 User details:', { username: users.username, role: users.role, is_active: users.is_active });
        console.log('🔍 Password hash from DB:', users.password);
      }

      if (error || !users) {
        console.log('❌ Login failed: User not found or database error');
        return false;
      }

      // TEMPORARY: Use direct password comparison for testing
      console.log('🔍 Comparing password directly (temporary)...');
      const isPasswordValid = password === users.password;
      console.log('🔍 Password comparison result:', isPasswordValid);
      
      if (isPasswordValid) {
        console.log('✅ Login successful!');
        setIsAuthenticated(true);
        setIsAdmin(users.role === 'admin');
        localStorage.setItem('foodieapp-auth', 'true');
        localStorage.setItem('foodieapp-admin', users.role === 'admin' ? 'true' : 'false');
        localStorage.setItem('foodieapp-user', JSON.stringify(users));
        return true;
      }
      
      console.log('❌ Login failed: Invalid password');
      return false;
    } catch (error) {
      console.error('💥 Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('foodieapp-auth');
    localStorage.removeItem('foodieapp-admin');
    localStorage.removeItem('foodieapp-user');
  };

  const value: AuthContextType = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};