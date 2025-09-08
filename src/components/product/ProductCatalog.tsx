import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard, type Product } from './ProductCard';
import { ProductDetails } from './ProductDetails';
import { CategoryFilter, type Category } from './CategoryFilter';
import { CartSheet, type CartItem } from '../cart/CartSheet';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';


interface ProductCatalogProps {
  promoCode?: string;
  selectedBranch?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ promoCode, selectedBranch }) => {
  const { allProducts, allCategories } = useAdmin();
  
  // Filter products and categories by selected branch
  const products = selectedBranch 
    ? allProducts.filter(p => p.branchId === selectedBranch)
    : allProducts;
    
  const categories = selectedBranch 
    ? allCategories.filter(c => c.branchId === selectedBranch)
    : allCategories;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    let filtered = products;

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
  }, [selectedCategory, searchQuery, products]);

  // Calculate accurate category counts based on actual filtered products
  const categoriesWithCounts = useMemo(() => {
    return categories.map(category => ({
      ...category,
      count: products.filter(product => product.category === category.name).length
    }));
  }, [categories, products]);

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

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-4">
        <div className="max-w-md mx-auto relative">
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
        categories={categoriesWithCounts}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Products Grid */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3">Our Menu</h2>
              <p className="text-lg text-muted-foreground">Delicious food made fresh daily</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in w-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
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
        promoCode={promoCode}
      />

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        isOpen={showProductDetails}
        onClose={() => setShowProductDetails(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};