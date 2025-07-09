import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count: number;
  branchId: string;
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
  const allCategory = {
    id: 'all',
    name: 'All',
    count: categories.reduce((sum, cat) => sum + cat.count, 0)
  };

  const allCategories = [allCategory, ...categories];

  return (
    <div className="w-full bg-muted/30 border-y">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <ScrollArea className="w-full">
          <div className="flex justify-center py-4">
            <div className="flex gap-3 flex-wrap justify-center max-w-4xl">
              {allCategories.map((category) => {
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "gradient" : "outline"}
                    size="sm"
                    className={`whitespace-nowrap transition-bounce px-6 py-2 font-medium ${
                      isSelected ? "shadow-medium scale-105" : "hover:bg-accent hover:scale-105"
                    }`}
                    onClick={() => onCategoryChange(category.id)}
                  >
                    <span className="font-semibold">{category.name}</span>
                    <span className={`ml-2 text-xs ${
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
  );
};