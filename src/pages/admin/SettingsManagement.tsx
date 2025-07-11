import React, { useState } from 'react';
import { User, Palette, Users, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from './UserManagement';
import { ThemeManagement } from './ThemeManagement';
import { BrandManagement } from './BrandManagement';
import { BannerManagement } from './BannerManagement';

export const SettingsManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your app configuration and preferences</p>
      </div>

      <Tabs defaultValue="brand" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brand" className="gap-2">
            <User className="h-4 w-4" />
            Brand & Company
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="h-4 w-4" />
            Theme Settings
          </TabsTrigger>
          <TabsTrigger value="banners" className="gap-2">
            <Shield className="h-4 w-4" />
            Banner Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="brand">
          <BrandManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="theme">
          <ThemeManagement />
        </TabsContent>
        
        <TabsContent value="banners">
          <BannerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};