import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerProfile } from '@/components/customer/CustomerProfile';
import { CustomerOrderHistory } from '@/components/customer/CustomerOrderHistory';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { Navigate } from 'react-router-dom';
import { User, History } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { isCustomerAuthenticated, isLoading } = useCustomerAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isCustomerAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Order History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <CustomerProfile />
            </TabsContent>

            <TabsContent value="orders">
              <CustomerOrderHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};