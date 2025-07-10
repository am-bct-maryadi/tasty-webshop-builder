import React from 'react';
import { X, Clock, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import type { Product } from './ProductCard';

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Product Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-4 mb-3">
                  {product.isPopular && (
                    <Badge variant="destructive" className="text-xs">
                      🔥 Popular
                    </Badge>
                  )}
                  <Badge 
                    variant={product.isAvailable ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {product.isAvailable ? "Available" : "Sold Out"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Customer Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{product.prepTime} min</span>
                </div>
                <p className="text-xs text-muted-foreground">Prep Time</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant={product.isAvailable ? "gradient" : "secondary"}
                className="flex-1 font-bold"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={!product.isAvailable}
              >
                {product.isAvailable ? `Add to Cart • ${formatCurrency(product.price)}` : "Currently Unavailable"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};