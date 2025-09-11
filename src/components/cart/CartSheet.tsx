import React from 'react';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { formatCurrency } from '@/lib/utils';
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

export const CartSheet: React.FC<CartSheetProps> = (props) => {
  const {
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    promoCode: externalPromoCode
  } = props;
  const { toast } = useToast();
  const { promos, branches } = useAdmin();
  const { customer, addresses } = useCustomerAuth();
  const [customerInfo, setCustomerInfo] = React.useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [promoCode, setPromoCode] = React.useState('');
  const [deliveryType, setDeliveryType] = React.useState<'delivery' | 'pickup'>('delivery');
  const [pickupBranch, setPickupBranch] = React.useState<string>('');
  const [pickupTime, setPickupTime] = React.useState<string>('');

  // Auto-fill customer data when authenticated
  React.useEffect(() => {
    if (customer) {
      setCustomerInfo(prev => ({
        ...prev,
        name: customer.full_name || prev.name,
        phone: customer.phone || prev.phone,
        address: addresses.find(addr => addr.is_default)?.address_line1 || prev.address
      }));
    }
  }, [customer, addresses]);

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

  const calculateDiscount = (subtotal: number): number => {
    if (!promoCode) return 0;
    const selectedBranchId = localStorage.getItem('selectedBranch');
    if (!selectedBranchId) return 0;
    try {
      const validPromo = promos.find(p =>
        p.code === promoCode &&
        (p.branchId === selectedBranchId || p.branchId === 'all') &&
        p.isActive &&
        new Date(p.expiryDate) > new Date() &&
        subtotal >= p.minOrderAmount
      );
      if (validPromo) {
        return validPromo.type === 'percentage'
          ? subtotal * (validPromo.value / 100)
          : validPromo.value;
      }
    } catch (error) {
      console.log('Error calculating promo discount:', error);
    }
    return 0;
  };

  const discount = calculateDiscount(subtotal);
  const totalPrice = subtotal - discount;

  const handleWhatsAppOrder = async () => {
    // Validate required fields based on delivery type
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and phone number",
        variant: "destructive",
      });
      return;
    }
    if (deliveryType === 'delivery' && !customerInfo.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in your delivery address",
        variant: "destructive",
      });
      return;
    }
    if (deliveryType === 'pickup') {
      if (!pickupBranch) {
        toast({
          title: "Missing Information",
          description: "Please select a branch for pickup",
          variant: "destructive",
        });
        return;
      }
      if (!pickupTime) {
        toast({
          title: "Missing Information",
          description: "Please select a pickup time",
          variant: "destructive",
        });
        return;
      }
      // Validate pickup time is in the future (at least 30 minutes from now)
      const selectedPickupTime = new Date(pickupTime);
      const minAllowedTime = new Date(Date.now() + 30 * 60 * 1000);
      if (selectedPickupTime < minAllowedTime) {
        toast({
          title: "Invalid Pickup Time",
          description: "Pickup time must be at least 30 minutes from now",
          variant: "destructive",
        });
        return;
      }
    }

    // Format order for WhatsApp
    const orderText = `🍽️ *New Order from ${customerInfo.name}*\n\n` +
      `📱 Phone: ${customerInfo.phone}\n` +
      (deliveryType === 'delivery'
        ? `📍 Address: ${customerInfo.address}\n`
        : `🏬 Pickup Branch: ${branches?.find(b => b.id === pickupBranch)?.name || ''}\n🕒 Pickup Time: ${pickupTime}\n`
      ) +
      `\n📋 *Order Details:*\n` +
      items.map(item =>
        `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`
      ).join('\n') +
      `\n\n💰 *Subtotal: ${formatCurrency(subtotal)}*` +
      (discount > 0 ? `\n🎟️ *Discount (${promoCode}): -${formatCurrency(discount)}*` : '') +
      `\n💸 *Total: ${formatCurrency(totalPrice)}*` +
      (customerInfo.notes ? `\n\n📝 *Notes:* ${customerInfo.notes}` : '') +
      `\n\n🕒 Order placed at: ${new Date().toLocaleString('id-ID')}`;

    // Get WhatsApp number from selected branch instead of brand settings
    let whatsappNumber = "628158882505"; // Default fallback number
    try {
      const selectedBranchId = localStorage.getItem('selectedBranch');
      if (selectedBranchId) {
        const { data: branchData } = await supabase
          .from('branches')
          .select('whatsapp_number')
          .eq('id', selectedBranchId)
          .single();
        if (branchData?.whatsapp_number) {
          whatsappNumber = branchData.whatsapp_number;
        }
      }
    } catch (error) {
      console.log('Using default WhatsApp number, branch-specific number not found');
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderText)}`;

    // Save order to database
    try {
      const selectedBranchId = localStorage.getItem('selectedBranch') || 'default-branch';
      const orderData = {
        customer_id: customer?.id || null,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: deliveryType === 'delivery' ? customerInfo.address : "-",
        delivery_type: deliveryType,
        pickup_branch: deliveryType === 'pickup' ? pickupBranch : null,
        pickup_time: deliveryType === 'pickup' ? new Date(pickupTime + ':00+07:00').toISOString() : null,
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
        branch_id: selectedBranchId
      };

      const { error } = await supabase.from('orders').insert(orderData);
      if (error) {
        console.error('Error saving order:', error);
        toast({
          title: "Order Failed",
          description: "There was a problem saving your order. Please try again.",
          variant: "destructive",
        });
        return;
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
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Order Failed",
        description: "There was a problem saving your order. Please try again.",
        variant: "destructive",
      });
    }
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

              {/* Delivery Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Order Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={deliveryType === 'delivery'}
                      onChange={() => setDeliveryType('delivery')}
                    />
                    Delivery
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === 'pickup'}
                      onChange={() => setDeliveryType('pickup')}
                    />
                    Pick Up
                  </label>
                </div>
              </div>
              {/* Customer Information */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Customer Information</Label>
                <div className="grid gap-2">
                  <Input
                    placeholder="Your name *"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!!customer}
                  />
                  <Input
                    placeholder="Phone number *"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!!customer}
                  />
                  {deliveryType === 'delivery' && (
                    <Textarea
                      placeholder="Delivery address *"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="min-h-[60px]"
                    />
                  )}
                  {deliveryType === 'pickup' && (
                    <>
                      <Label className="text-xs font-medium">Select Branch *</Label>
                      <select
                        className="border rounded px-2 py-2"
                        value={pickupBranch}
                        onChange={e => setPickupBranch(e.target.value)}
                      >
                        <option value="">Select branch</option>
                        {Array.isArray(addresses) && addresses.length === 0 && (
                          <option disabled>No branches available</option>
                        )}
                        {/* Use branches from admin context */}
                        {useAdmin().branches?.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      <Label className="text-xs font-medium">Pickup Time *</Label>
                      <input
                        type="datetime-local"
                        className="border rounded px-2 py-2"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        min={new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16)}
                      />
                    </>
                  )}
                  <Textarea
                    placeholder="Special requests or notes (optional)"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    className="min-h-[60px]"
                  />
                  {customer && (
                    <p className="text-xs text-muted-foreground">
                      Name and phone are auto-filled from your account
                    </p>
                  )}
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
                      const discount = calculateDiscount(subtotal);
                      if (promoCode && discount > 0) {
                        toast({
                          title: "Success!",
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