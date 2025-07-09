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
    <Card className="food-card overflow-hidden group cursor-pointer bg-white border-0 shadow-soft hover:shadow-strong">
      <div className="relative" onClick={() => onViewDetails?.(product)}>
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
            ${product.price.toFixed(2)}
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

      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-smooth">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Rating and Time Info */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 fill-current text-warning" />
              <span className="font-medium">{product.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{product.prepTime} min</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          variant={product.isAvailable ? "gradient" : "secondary"}
          size="lg"
          className="w-full font-semibold text-base h-12 transition-bounce hover:scale-105 active:scale-95"
          onClick={() => onAddToCart?.(product)}
          disabled={!product.isAvailable}
        >
          {product.isAvailable ? (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add to Cart • ${product.price.toFixed(2)}
            </>
          ) : (
            "Currently Unavailable"
          )}
        </Button>
      </div>
    </Card>
  );
};