import React from 'react';
import { Plus, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: number;
  isAvailable: boolean;
  isPopular?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails 
}) => {
  return (
    <Card className="food-card overflow-hidden group cursor-pointer">
      <div className="relative" onClick={() => onViewDetails?.(product)}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
            loading="lazy"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isPopular && (
            <Badge variant="destructive" className="text-xs">
              Popular
            </Badge>
          )}
          {!product.isAvailable && (
            <Badge variant="secondary" className="text-xs">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-medium"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            disabled={!product.isAvailable}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
          <div className="text-primary font-bold text-sm ml-2">
            ${product.price.toFixed(2)}
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-warning" />
            <span>{product.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{product.prepTime} min</span>
          </div>
        </div>

        <Button
          variant="gradient"
          size="sm"
          className="w-full mt-3"
          onClick={() => onAddToCart?.(product)}
          disabled={!product.isAvailable}
        >
          {product.isAvailable ? 'Add to Cart' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  );
};