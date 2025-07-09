import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';

export const AdminHeader: React.FC = () => {
  const { brandSettings } = useAdmin();

  return (
    <header className="bg-background border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            {brandSettings.logo ? (
              <img 
                src={brandSettings.logo} 
                alt={brandSettings.companyName} 
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {brandSettings.companyName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-semibold text-lg">{brandSettings.companyName} Admin</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
            >
              <Link to="/" target="_blank">
                <Home className="h-4 w-4" />
                View Landing Page
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};