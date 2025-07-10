import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '../product/ProductCard';

export interface CartItem extends Product {
  quantity: number;
}

interface CartSheetProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  promoCode?: string;
}

export const CartSheet: React.FC<CartSheetProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  promoCode: externalPromoCode
}) => {
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = React.useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [promoCode, setPromoCode] = React.useState('');

  // Auto-fill promo code when claimed from popup
  React.useEffect(() => {
    if (externalPromoCode) {
      setPromoCode(externalPromoCode);
      toast({
        title: "Promo Applied!",
        description: `${externalPromoCode} has been applied to your cart`,
      });
    }
  }, [externalPromoCode, toast]);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount
  const getDiscount = () => {
    if (promoCode === 'WELCOME20') return subtotal * 0.2;
    if (promoCode === 'SAVE10') return subtotal * 0.1;
    return 0;
  };
  
  const discount = getDiscount();
  const totalPrice = subtotal - discount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleWhatsAppOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, phone number, and delivery address",
        variant: "destructive",
      });
      return;
    }

    // Format order for WhatsApp
    const orderText = `🍽️ *New Order from ${customerInfo.name}*\n\n` +
      `📱 Phone: ${customerInfo.phone}\n` +
      `📍 Address: ${customerInfo.address}\n\n` +
      `📋 *Order Details:*\n` +
      items.map(item => 
        `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
      ).join('\n') +
      `\n\n💰 *Subtotal: ${formatCurrency(subtotal)}*` +
      (discount > 0 ? `\n🎟️ *Discount (${promoCode}): -${formatCurrency(discount)}*` : '') +
      `\n💸 *Total: ${formatCurrency(totalPrice)}*` +
      (customerInfo.notes ? `\n\n📝 *Notes:* ${customerInfo.notes}` : '') +
      `\n\n🕒 Order placed at: ${new Date().toLocaleString('id-ID')}`;

    // Get WhatsApp number from brand settings based on current branch
    let whatsappNumber = "628158882505"; // Default fallback number
    try {
      const { data: brandSettings } = await supabase
        .from('brand_settings')
        .select('whatsapp_number')
        .single();
      
      if (brandSettings?.whatsapp_number) {
        whatsappNumber = brandSettings.whatsapp_number;
      }
    } catch (error) {
      console.log('Using default WhatsApp number');
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderText)}`;
    
    // Save order to database
    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        discount,
        total: totalPrice,
        status: 'pending' as const,
        promo_code: promoCode || null,
        notes: customerInfo.notes || null,
        branch_id: 'current-branch-id' // Should come from context
      };

      await supabase.from('orders').insert(orderData);
    } catch (error) {
      console.error('Error saving order:', error);
    }
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after successful order
    onClearCart();
    setCustomerInfo({ name: '', phone: '', address: '', notes: '' });
    setPromoCode('');
    
    toast({
      title: "Order Sent!",
      description: "Your order has been sent via WhatsApp. We'll contact you soon!",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="gradient" 
          size="icon" 
          className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-strong md:bottom-4"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Your cart is empty<br />
              <span className="text-sm">Add some delicious items!</span>
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-primary font-semibold">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Separator />
              
              {/* Customer Information */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Customer Information</Label>
                <div className="grid gap-2">
                  <Input
                    placeholder="Your name *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone number *"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Delivery address *"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="min-h-[60px]"
                  />
                  <Textarea
                    placeholder="Special requests or notes (optional)"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    className="min-h-[60px]"
                  />
                </div>
              </div>

              {/* Promo Code */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (promoCode && (promoCode === 'WELCOME20' || promoCode === 'SAVE10')) {
                        toast({
                          title: "Promo Applied!",
                          description: `${promoCode} discount applied successfully`,
                        });
                      } else if (promoCode) {
                        toast({
                          title: "Invalid Code",
                          description: "Please check your promo code and try again",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-success">
                    ✅ {promoCode} applied - You save {formatCurrency(discount)}!
                  </p>
                )}
              </div>

              <Separator />
              
              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-success">
                    <span>Discount ({promoCode}):</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid gap-2">
                <Button
                  variant="gradient"
                  className="w-full gap-2"
                  onClick={handleWhatsAppOrder}
                  disabled={items.length === 0}
                >
                  <MessageCircle className="h-4 w-4" />
                  Order via WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClearCart}
                  disabled={items.length === 0}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};