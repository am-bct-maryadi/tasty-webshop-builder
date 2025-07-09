import React from 'react';
import { BarChart3, Package, Settings, Users, MapPin, Tags, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { logout } = useAuth();
  const { products, categories, branches, promos } = useAdmin();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      description: 'Active menu items',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Categories',
      value: categories.length,
      description: 'Food categories',
      icon: Tags,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Branches',
      value: branches.length,
      description: 'Store locations',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Available Items',
      value: products.filter(p => p.isAvailable).length,
      description: 'Currently available',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Active Promos',
      value: promos.filter(p => p.isActive).length,
      description: 'Current promotions',
      icon: Tags,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  const menuItems = [
    {
      title: 'Products',
      description: 'Manage menu items, prices, and availability',
      icon: Package,
      page: 'products',
      color: 'text-blue-600',
    },
    {
      title: 'Categories',
      description: 'Organize products into categories',
      icon: Tags,
      page: 'categories',
      color: 'text-green-600',
    },
    {
      title: 'Branches',
      description: 'Manage store locations and details',
      icon: MapPin,
      page: 'branches',
      color: 'text-purple-600',
    },
    {
      title: 'Promo Codes',
      description: 'Create and manage discount codes',
      icon: Tags,
      page: 'promos',
      color: 'text-pink-600',
    },
    {
      title: 'Settings',
      description: 'App configuration and preferences',
      icon: Settings,
      page: 'settings',
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your food delivery app</p>
        </div>
        <Button
          variant="outline"
          onClick={logout}
          className="gap-2 w-full sm:w-auto"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.page}
                className="cursor-pointer hover:shadow-medium transition-smooth"
                onClick={() => onNavigate(item.page)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${item.color}`} />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">System initialized</p>
                <p className="text-sm text-muted-foreground">Admin dashboard is ready to use</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};