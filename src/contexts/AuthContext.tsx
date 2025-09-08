import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
  session: Session | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);

        if (session?.user) {
          // Get user role from custom users table
          await getUserRole(session.user.id);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      
      if (session?.user) {
        getUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async (authUserId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (userData && !error) {
        setIsAdmin(userData.role === 'admin' || userData.role === 'super_admin');
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔍 Login attempt for username:', username);
      
      // First, get user from custom users table
      const { data: customUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (userError || !customUser) {
        console.log('❌ User not found in custom users table');
        return false;
      }

      // Check password (direct comparison for now)
      const isPasswordValid = password === customUser.password;
      
      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        return false;
      }

      // If user is not linked to auth yet, create auth user and link
      if (!customUser.auth_user_id) {
        console.log('🔗 Linking user to Supabase Auth...');
        
        // Create Supabase auth user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: customUser.email,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (signUpError || !authData.user) {
          console.error('❌ Failed to create auth user:', signUpError);
          return false;
        }

        // Link the auth user to custom user
        const { error: updateError } = await supabase
          .from('users')
          .update({ auth_user_id: authData.user.id })
          .eq('id', customUser.id);

        if (updateError) {
          console.error('❌ Failed to link user:', updateError);
          return false;
        }

        // Set session manually for new users
        setSession(authData.session);
        setUser(authData.user);
        setIsAuthenticated(true);
        setIsAdmin(customUser.role === 'admin' || customUser.role === 'super_admin');
        
        console.log('✅ User created and linked successfully!');
        return true;
      } else {
        // User already linked, sign in with Supabase Auth
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: customUser.email,
          password: password
        });

        if (signInError || !signInData.user) {
          console.error('❌ Supabase auth sign in failed:', signInError);
          return false;
        }

        console.log('✅ Login successful!');
        return true;
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      setSession(null);
      
      // Clear localStorage
      localStorage.removeItem('foodieapp-auth');
      localStorage.removeItem('foodieapp-admin');
      localStorage.removeItem('foodieapp-user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isAdmin,
    login,
    logout,
    user,
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};