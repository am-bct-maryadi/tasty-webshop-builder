import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HeroBanner } from './HeroBanner';

interface HeroSectionProps {
  onSelectBranch?: (branchId: string) => void;
  selectedBranch?: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectBranch, selectedBranch }) => {
  const branches = [
    {
      id: '1',
      name: 'Downtown Branch',
      address: '123 Main Street, Downtown',
      isOpen: true
    },
    {
      id: '2', 
      name: 'Mall Branch',
      address: '456 Shopping Center, North Mall',
      isOpen: true
    },
    {
      id: '3',
      name: 'University Branch',
      address: '789 Campus Drive, University District',
      isOpen: false
    }
  ];

  if (selectedBranch) {
    const selectedBranchData = branches.find(b => b.id === selectedBranch);
    return (
      <div className="bg-gradient-hero text-white py-6">
        <div className="w-full px-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
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
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
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
      
      <div className="bg-background py-8">
        <div className="w-full px-6">
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
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{branch.name}</h3>
                        {branch.isOpen ? (
                          <span className="text-xs bg-success/20 text-success-foreground px-2 py-1 rounded-full">
                            Open
                          </span>
                        ) : (
                          <span className="text-xs bg-destructive/20 text-destructive-foreground px-2 py-1 rounded-full">
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
                      variant={branch.isOpen ? "gradient" : "ghost"}
                      size="sm"
                      disabled={!branch.isOpen}
                      onClick={() => onSelectBranch?.(branch.id)}
                      className="ml-4"
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