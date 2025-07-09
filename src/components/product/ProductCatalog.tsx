import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard, type Product } from './ProductCard';
import { CategoryFilter, type Category } from './CategoryFilter';
import { CartSheet, type CartItem } from '../cart/CartSheet';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with Supabase data in production
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheese, lettuce, tomato, and our special sauce',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    category: 'burgers',
    rating: 4.8,
    prepTime: 15,
    isAvailable: true,
    isPopular: true
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, basil, and tomato sauce on crispy dough',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    category: 'pizza',
    rating: 4.9,
    prepTime: 20,
    isAvailable: true,
    isPopular: true
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan, croutons, and caesar dressing',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&h=400&fit=crop',
    category: 'salads',
    rating: 4.6,
    prepTime: 10,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Iced Coffee',
    description: 'Premium cold brew coffee served with ice and your choice of milk',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
    category: 'beverages',
    rating: 4.7,
    prepTime: 5,
    isAvailable: true
  },
  {
    id: '5',
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce: BBQ, Buffalo, or Honey Garlic',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=400&fit=crop',
    category: 'appetizers',
    rating: 4.5,
    prepTime: 18,
    isAvailable: false
  },
  {
    id: '6',
    name: 'Chocolate Milkshake',
    description: 'Rich and creamy chocolate milkshake topped with whipped cream',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop',
    category: 'beverages',
    rating: 4.8,
    prepTime: 5,
    isAvailable: true
  }
];

const mockCategories: Category[] = [
  { id: 'burgers', name: 'Burgers', count: 1 },
  { id: 'pizza', name: 'Pizza', count: 1 },
  { id: 'salads', name: 'Salads', count: 1 },
  { id: 'appetizers', name: 'Appetizers', count: 1 },
  { id: 'beverages', name: 'Beverages', count: 2 }
];

export const ProductCatalog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart",
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mobile-container py-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for food, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter
        categories={mockCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Products Grid */}
      <div className="mobile-container py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Our Menu</h2>
              <p className="text-muted-foreground">Delicious food made fresh daily</p>
            </div>
            <div className="mobile-grid">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(product) => {
                    toast({
                      title: "Product Details",
                      description: `Viewing details for ${product.name}`,
                    });
                  }}
                />
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Cart */}
      <CartSheet
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
};