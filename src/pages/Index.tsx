import React, { useState } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { MobileNav } from '@/components/ui/mobile-nav';
import { HeroSection } from '@/components/landing/HeroSection';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBranchSelection = (branchId: string) => {
    setSelectedBranch(branchId);
    toast({
      title: "Branch Selected",
      description: "Great! You can now browse our menu and place orders.",
    });
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    toast({
      title: "Navigation",
      description: `Navigated to ${page}`,
    });
  };

  return (
    <ThemeProvider defaultTheme="default">
      <div className="min-h-screen bg-background">
        <MobileNav 
          currentPage={currentPage} 
          onNavigate={handleNavigation} 
        />
        
        <main className="pb-16 md:pb-0">
          <HeroSection onSelectBranch={handleBranchSelection} />
          
          {/* Content area for future features */}
          {selectedBranch && (
            <div className="mobile-container py-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to FoodieApp!</h2>
                <p className="text-muted-foreground mb-6">
                  Your branch has been selected. Ready to start building your food ordering experience!
                </p>
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-card rounded-lg border shadow-soft">
                    <h3 className="font-semibold mb-2">Phase 1 Complete ✅</h3>
                    <p className="text-sm text-muted-foreground">
                      Beautiful foundation with seasonal theming capability, mobile-first design, 
                      and responsive navigation system.
                    </p>
                  </div>
                  <div className="p-6 bg-muted/50 rounded-lg border">
                    <h3 className="font-semibold mb-2">Coming Next: Phase 2 🚀</h3>
                    <p className="text-sm text-muted-foreground">
                      Product catalog with category filtering, product details, 
                      cart functionality, and WhatsApp ordering integration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;