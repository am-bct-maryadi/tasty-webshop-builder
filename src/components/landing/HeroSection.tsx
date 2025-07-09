import React from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-food-banner.jpg';

interface HeroSectionProps {
  onSelectBranch?: (branchId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectBranch }) => {
  const branches = [
    {
      id: '1',
      name: 'Downtown Branch',
      address: '123 Main Street, Downtown',
      rating: 4.8,
      estimatedTime: '15-25 min',
      isOpen: true
    },
    {
      id: '2', 
      name: 'Mall Branch',
      address: '456 Shopping Center, North Mall',
      rating: 4.6,
      estimatedTime: '20-30 min',
      isOpen: true
    },
    {
      id: '3',
      name: 'University Branch',
      address: '789 Campus Drive, University District',
      rating: 4.7,
      estimatedTime: '25-35 min',
      isOpen: false
    }
  ];

  return (
    <div className="relative min-h-[60vh] bg-gradient-hero text-white overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative mobile-container py-8">
        {/* Hero Text */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Delicious Food, Delivered Fresh
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Choose your nearest branch and start ordering
          </p>
        </div>

        {/* Branch Selection */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">
            Select Your Branch
          </h2>
          
          <div className="grid gap-3">
            {branches.map((branch, index) => (
              <Card 
                key={branch.id} 
                className="p-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{branch.name}</h3>
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
                    
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{branch.address}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-white/80 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-warning" />
                        <span>{branch.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{branch.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant={branch.isOpen ? "secondary" : "ghost"}
                    size="sm"
                    disabled={!branch.isOpen}
                    onClick={() => onSelectBranch?.(branch.id)}
                    className={`ml-4 ${
                      branch.isOpen 
                        ? "bg-white text-primary hover:bg-white/90" 
                        : "text-white/50"
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
  );
};