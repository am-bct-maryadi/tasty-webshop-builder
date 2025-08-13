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
      // Query the users table to find a matching user
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !users) {
        return false;
      }

      // Compare password with bcrypt hash
      const isPasswordValid = await bcrypt.compare(password, users.password);
      if (isPasswordValid) {
        setIsAuthenticated(true);
        setIsAdmin(users.role === 'admin');
        localStorage.setItem('foodieapp-auth', 'true');
        localStorage.setItem('foodieapp-admin', users.role === 'admin' ? 'true' : 'false');
        localStorage.setItem('foodieapp-user', JSON.stringify(users));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
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