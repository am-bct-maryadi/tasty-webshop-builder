import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
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

  const login = (username: string, password: string): boolean => {
    // Simple admin login - in production use proper authentication
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('foodieapp-auth', 'true');
      localStorage.setItem('foodieapp-admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('foodieapp-auth');
    localStorage.removeItem('foodieapp-admin');
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