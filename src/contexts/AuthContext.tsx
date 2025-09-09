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
  loading: boolean;
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
        .maybeSingle();

      if (userData && !error) {
        setIsAdmin(userData.role === 'admin' || userData.role === 'super_admin');
        console.log('✅ User role retrieved:', userData.role);
      } else {
        console.log('⚠️ No user role found for auth user:', authUserId);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('❌ Error getting user role:', error);
      setIsAdmin(false);
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
        .maybeSingle();

      if (userError || !customUser) {
        console.log('❌ User not found in custom users table:', userError?.message);
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
        
        // Create Supabase auth user without email confirmation
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: customUser.email,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              skip_confirmation: true
            }
          }
        });
        
        console.log('🔍 SignUp response:', { authData, signUpError });

        if (signUpError) {
          console.error('❌ Failed to create auth user:', signUpError);
          
          // Check if user already exists in Supabase Auth
          if (signUpError.message?.includes('already registered')) {
            console.log('🔍 User already exists in Supabase Auth, attempting sign in...');
            
            // Try to sign in instead
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: customUser.email,
              password: password
            });
            
            if (signInError) {
              console.error('❌ Sign in failed:', signInError);
              return false;
            }
            
            // Link the existing auth user to custom user
            const { error: updateError } = await supabase
              .from('users')
              .update({ auth_user_id: signInData.user.id })
              .eq('id', customUser.id);
            
            if (updateError) {
              console.error('❌ Failed to link existing user:', updateError);
              return false;
            }
            
            console.log('✅ Existing user linked successfully!');
            return true;
          }
          
          return false;
        }

        if (!authData.user) {
          console.error('❌ No user data returned from signup');
          return false;
        }

        // Check if session exists (no email confirmation required)
        if (!authData.session) {
          console.log('⚠️ Email confirmation required. Please check your email and confirm your account first.');
          console.log('💡 To disable email confirmation: Go to Supabase Dashboard > Authentication > Settings > Email Auth > Disable "Enable email confirmations"');
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
        console.log('🔍 Attempting sign in for existing linked user:', customUser.email);
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: customUser.email,
          password: password
        });

        if (signInError) {
          console.error('❌ Supabase auth sign in failed:', signInError);
          
          // If email not confirmed, try to handle it gracefully
          if (signInError.message?.includes('Email not confirmed')) {
            console.log('⚠️ Email confirmation required for existing user');
            console.log('💡 Please check your email and confirm, or disable email confirmation in Supabase Dashboard');
            console.log('🔗 Auth Settings: https://supabase.com/dashboard/project/pelytyjonytekqdiwjri/auth/providers');
          }
          
          return false;
        }

        if (!signInData.user) {
          console.error('❌ No user data returned from sign in');
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
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};