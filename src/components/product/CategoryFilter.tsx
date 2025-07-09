import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  count: number;
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
    <div className="w-full">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-4 pb-0">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? "gradient" : "outline"}
                size="sm"
                className={`whitespace-nowrap transition-bounce ${
                  isSelected ? "shadow-medium" : "hover:bg-accent"
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="font-medium">{category.name}</span>
                <span className={`ml-1 text-xs ${
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  ({category.count})
                </span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};