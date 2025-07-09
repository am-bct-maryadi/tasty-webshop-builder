import React, { useState } from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { MobileNav } from '@/components/ui/mobile-nav';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProductCatalog } from '@/components/product/ProductCatalog';
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
          <ProductCatalog />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;