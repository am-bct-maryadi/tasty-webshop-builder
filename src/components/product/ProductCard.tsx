import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

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
  branchId: string;
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
    <Card className="food-card overflow-hidden group cursor-pointer bg-white border-0 shadow-soft hover:shadow-strong min-h-[480px] flex flex-col">
      <div className="relative flex-shrink-0" onClick={() => onViewDetails?.(product)}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-smooth group-hover:scale-110"
            loading="lazy"
          />
        </div>
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.isPopular && (
            <Badge variant="destructive" className="text-xs font-semibold px-2 py-1 shadow-medium">
              🔥 Popular
            </Badge>
          )}
          {!product.isAvailable && (
            <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1 shadow-medium">
            {formatCurrency(product.price)}
          </Badge>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button
            size="icon"
            variant="gradient"
            className="h-10 w-10 rounded-full shadow-strong hover:scale-110 transition-bounce"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            disabled={!product.isAvailable}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1 mb-6">
          <h3 className="font-bold text-xl leading-tight mb-3 text-foreground group-hover:text-primary transition-smooth line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Add to Cart Button - Fixed at bottom */}
        <div className="mt-auto">
          <Button
            variant={product.isAvailable ? "gradient" : "secondary"}
            size="lg"
            className="w-full font-bold text-lg h-14 transition-bounce hover:scale-105 active:scale-95 shadow-medium"
            onClick={() => onAddToCart?.(product)}
            disabled={!product.isAvailable}
          >
            {product.isAvailable ? (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add to Cart
              </>
            ) : (
              "Currently Unavailable"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};