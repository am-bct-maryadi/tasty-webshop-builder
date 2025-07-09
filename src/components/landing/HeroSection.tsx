import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroBanner } from './HeroBanner';
import { useAdmin } from '@/contexts/AdminContext';

interface HeroSectionProps {
  onSelectBranch?: (branchId: string) => void;
  selectedBranch?: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectBranch, selectedBranch }) => {
  // Get branches from AdminContext instead of hardcoded data
  const { branches } = useAdmin();

  if (selectedBranch) {
    const selectedBranchData = branches.find(b => b.id === selectedBranch);
    return (
      <div className="bg-gradient-hero text-white py-4 md:py-6">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                🎉 Welcome to {selectedBranchData?.name}!
              </h2>
              <p className="text-sm opacity-90">
                Browse our delicious menu below and place your order
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSelectBranch?.('')}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
            >
              Change Branch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <HeroBanner />
      
      <div className="bg-background py-6 md:py-8">
        <div className="w-full px-4 md:px-6">
          {/* Branch Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-4 text-foreground">
              Select Your Branch
            </h2>
          
            <div className="grid gap-3 max-w-2xl mx-auto">
              {branches.map((branch, index) => (
                <Card 
                  key={branch.id} 
                  className="p-4 bg-card border hover:shadow-medium transition-smooth animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 w-full sm:w-auto">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{branch.name}</h3>
                        {branch.isOpen ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            Open
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                            Closed
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{branch.address}</span>
                      </div>
                    </div>
                    
                     <Button
                      variant={branch.isOpen ? "default" : "ghost"}
                      size="sm"
                      disabled={!branch.isOpen}
                      onClick={() => onSelectBranch?.(branch.id)}
                      className={`w-full sm:w-auto sm:ml-4 ${
                        branch.isOpen 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                          : "text-muted-foreground"
                      }`}
                    >
                      {branch.isOpen ? 'Select' : 'Closed'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};