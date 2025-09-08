import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomerAuthDialog } from './CustomerAuthDialog';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, History, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerNav: React.FC = () => {
  const { customer, isCustomerAuthenticated, logout } = useCustomerAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/customer');
  };

  const handleLogout = () => {
    logout();
  };

  if (isCustomerAuthenticated && customer) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {customer.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm">{customer.full_name}</p>
              <p className="w-[160px] sm:w-[200px] truncate text-xs text-muted-foreground">
                {customer.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/customer?tab=orders')}>
            <History className="mr-2 h-4 w-4" />
            <span>Order History</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowAuthDialog(true)}
        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
      >
        <User className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Sign In</span>
        <span className="sm:hidden">Login</span>
      </Button>
      
      <CustomerAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
};