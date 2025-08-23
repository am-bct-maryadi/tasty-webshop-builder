import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  email_verified: boolean;
  privacy_accepted: boolean;
  marketing_consent: boolean;
  created_at: string;
}

interface CustomerAddress {
  id: string;
  customer_id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
}

interface CustomerAuthContextType {
  customer: Customer | null;
  isCustomerAuthenticated: boolean;
  addresses: CustomerAddress[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Customer>) => Promise<{ success: boolean; error?: string }>;
  addAddress: (address: Omit<CustomerAddress, 'id' | 'customer_id'>) => Promise<{ success: boolean; error?: string }>;
  updateAddress: (id: string, address: Partial<CustomerAddress>) => Promise<{ success: boolean; error?: string }>;
  deleteAddress: (id: string) => Promise<{ success: boolean; error?: string }>;
  setDefaultAddress: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshAddresses: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  privacy_accepted: boolean;
  marketing_consent: boolean;
  address: {
    label: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
  };
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
};

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isCustomerAuthenticated = !!customer;

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const sessionToken = localStorage.getItem('customer-session-token');
      if (!sessionToken) {
        setIsLoading(false);
        return;
      }

      const { data: session, error } = await supabase
        .from('customer_sessions')
        .select('*, customers(*)')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session) {
        localStorage.removeItem('customer-session-token');
        setIsLoading(false);
        return;
      }

      setCustomer(session.customers);
      await refreshAddresses();
      
      // Update last login
      await supabase
        .from('customers')
        .update({ last_login: new Date().toISOString() })
        .eq('id', session.customers.id);

    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('customer-session-token');
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (customerId: string) => {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await supabase
      .from('customer_sessions')
      .insert({
        customer_id: customerId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

    localStorage.setItem('customer-session-token', sessionToken);
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Starting login process for:', email);
      
      // Hash the password to match the stored hash format
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Use the existing authenticate_customer database function
      // This bypasses RLS and performs secure server-side authentication
      const { data: customerData, error } = await supabase
        .rpc('authenticate_customer', {
          p_email: email.toLowerCase(),
          p_password_hash: hashedPassword
        });
      
      if (error) {
        console.log('❌ Authentication RPC error:', error);
        return { success: false, error: 'Invalid email or password' };
      }

      // The RPC returns an array - empty if authentication failed
      if (!customerData || customerData.length === 0) {
        console.log('❌ Authentication failed - no customer data returned');
        return { success: false, error: 'Invalid email or password' };
      }

      const customer = customerData[0];
      console.log('✅ Authentication successful');
      
      // Convert RPC result to our Customer interface
      const authenticatedCustomer: Customer = {
        id: customer.customer_id,
        email: customer.email,
        full_name: customer.full_name,
        phone: customer.phone,
        is_active: customer.is_active,
        email_verified: customer.email_verified,
        privacy_accepted: true, // Existing customers have accepted privacy
        marketing_consent: false, // Default for existing customers
        created_at: new Date().toISOString(),
      };

      setCustomer(authenticatedCustomer);
      await createSession(authenticatedCustomer.id);
      await refreshAddresses();

      console.log('✅ Login successful');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (data: SignupData) => {
    try {
      if (!data.privacy_accepted) {
        return { success: false, error: 'You must accept the privacy policy to create an account' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 12);

      // Use the secure database function to create customer account and get complete data
      const { data: customerResult, error: rpcError } = await supabase
        .rpc('create_customer_account', {
          p_full_name: data.full_name,
          p_email: data.email.toLowerCase(),
          p_phone: data.phone,
          p_password_hash: passwordHash,
          p_privacy_accepted: data.privacy_accepted,
          p_marketing_consent: data.marketing_consent,
        });

      if (rpcError) {
        console.error('Signup error:', rpcError);
        let errorMessage = 'Failed to create account';
        
        if (rpcError.message.includes('Email already exists')) {
          errorMessage = 'An account with this email already exists';
        } else if (rpcError.message.includes('Phone number already exists')) {
          errorMessage = 'An account with this phone number already exists';
        }
        
        return { success: false, error: errorMessage };
      }

      if (!customerResult || customerResult.length === 0) {
        return { success: false, error: 'Failed to create account' };
      }

      // The function now returns the complete customer data directly
      const customerData = customerResult[0];
      const newCustomer = {
        id: customerData.customer_id,
        email: customerData.email,
        full_name: customerData.full_name,
        phone: customerData.phone,
        is_active: customerData.is_active,
        email_verified: customerData.email_verified,
        privacy_accepted: customerData.privacy_accepted,
        marketing_consent: customerData.marketing_consent,
        created_at: customerData.created_at,
      };

      // Create default address
      await supabase
        .from('customer_addresses')
        .insert({
          customer_id: newCustomer.id,
          ...data.address,
          is_default: true,
        });

      setCustomer(newCustomer);
      await createSession(newCustomer.id);
      await refreshAddresses();

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem('customer-session-token');
      if (sessionToken) {
        await supabase
          .from('customer_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('customer-session-token');
    setCustomer(null);
    setAddresses([]);
  };

  const updateProfile = async (data: Partial<Customer>) => {
    try {
      if (!customer) return { success: false, error: 'Not authenticated' };

      const { error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', customer.id);

      if (error) {
        return { success: false, error: 'Failed to update profile' };
      }

      setCustomer({ ...customer, ...data });
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An error occurred while updating profile' };
    }
  };

  const refreshAddresses = async () => {
    if (!customer) return;

    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', customer.id)
        .order('is_default', { ascending: false });

      if (!error && data) {
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const addAddress = async (address: Omit<CustomerAddress, 'id' | 'customer_id'>) => {
    try {
      if (!customer) return { success: false, error: 'Not authenticated' };

      const { error } = await supabase
        .from('customer_addresses')
        .insert({
          customer_id: customer.id,
          ...address,
        });

      if (error) {
        return { success: false, error: 'Failed to add address' };
      }

      await refreshAddresses();
      return { success: true };
    } catch (error) {
      console.error('Add address error:', error);
      return { success: false, error: 'An error occurred while adding address' };
    }
  };

  const updateAddress = async (id: string, address: Partial<CustomerAddress>) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .update(address)
        .eq('id', id);

      if (error) {
        return { success: false, error: 'Failed to update address' };
      }

      await refreshAddresses();
      return { success: true };
    } catch (error) {
      console.error('Update address error:', error);
      return { success: false, error: 'An error occurred while updating address' };
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: 'Failed to delete address' };
      }

      await refreshAddresses();
      return { success: true };
    } catch (error) {
      console.error('Delete address error:', error);
      return { success: false, error: 'An error occurred while deleting address' };
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) {
        return { success: false, error: 'Failed to set default address' };
      }

      await refreshAddresses();
      return { success: true };
    } catch (error) {
      console.error('Set default address error:', error);
      return { success: false, error: 'An error occurred while setting default address' };
    }
  };

  const value: CustomerAuthContextType = {
    customer,
    isCustomerAuthenticated,
    addresses,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};