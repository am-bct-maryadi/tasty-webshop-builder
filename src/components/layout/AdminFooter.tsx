import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';

export const AdminFooter: React.FC = () => {
  const { brandSettings } = useAdmin();

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {brandSettings.logo ? (
              <img 
                src={brandSettings.logo} 
                alt={brandSettings.companyName} 
                className="h-6 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  {brandSettings.companyName.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-medium text-sm">{brandSettings.companyName} Admin</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-muted-foreground">
              {brandSettings.copyrightText}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Admin Panel v1.0 • Built with Lovable
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};