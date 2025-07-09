import React, { useState } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { ProductsManagement } from './admin/ProductsManagement';
import { BranchesManagement } from './admin/BranchesManagement';
import { CategoriesManagement } from './admin/CategoriesManagement';
import { PromosManagement } from './admin/PromosManagement';
import { SettingsManagement } from './admin/SettingsManagement';
import { AnalyticsManagement } from './admin/AnalyticsManagement';
import { InventoryManagement } from './admin/InventoryManagement';
import { NotificationManagement } from './admin/NotificationManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Package, Tags, MapPin, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AdminPanel: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated || !isAdmin) {
    return <AdminLogin />;
  }

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Tags },
    { id: 'branches', label: 'Branches', icon: MapPin },
    { id: 'promos', label: 'Promo Codes', icon: Tags },
    { id: 'analytics', label: 'Analytics', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'notifications', label: 'Notifications', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'products':
        return <ProductsManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'branches':
        return <BranchesManagement />;
      case 'promos':
        return <PromosManagement />;
      case 'analytics':
        return <AnalyticsManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'notifications':
        return <NotificationManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">FoodieApp Admin</span>
            </div>
            
            {currentPage !== 'dashboard' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-background">
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive ? "bg-gradient-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderPage()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex-col gap-1 h-auto py-2 px-3 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminPanel;