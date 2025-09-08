import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUp } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count: number;
  branchId: string;
  sortOrder?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Calculate proper total count for the "All" category
  const allCategory = {
    id: 'all',
    name: 'All',
    count: categories.reduce((sum, cat) => sum + cat.count, 0)
  };

  const allCategories = [allCategory, ...categories];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="w-full bg-muted/30 border-y" id="categories-section">
        <div className="w-full px-2 sm:px-4 md:px-8 lg:px-12">
          <ScrollArea className="w-full">
            <div className="flex justify-center py-3 md:py-4">
              <div className="flex gap-2 sm:gap-3 flex-wrap justify-center max-w-4xl">
                {allCategories.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? "gradient" : "outline"}
                      size="sm"
                      className={`whitespace-nowrap transition-bounce px-3 sm:px-4 md:px-6 py-2 font-medium text-xs sm:text-sm ${
                        isSelected ? "shadow-medium scale-105" : "hover:bg-accent hover:scale-105"
                      }`}
                      onClick={() => onCategoryChange(category.id)}
                    >
                      <span className="font-semibold">{category.name}</span>
                      <span className={`ml-1 sm:ml-2 text-xs ${
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}>
                        ({category.count})
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-20 left-4 z-50 h-12 w-12 rounded-full shadow-lg"
          size="icon"
          variant="gradient"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
};