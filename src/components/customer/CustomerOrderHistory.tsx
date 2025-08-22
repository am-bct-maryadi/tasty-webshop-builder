import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ShoppingBag, Clock, MapPin, Phone, User, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: string;
  items: any;
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
  promo_code?: string;
  created_at: string;
  updated_at: string;
}

export const CustomerOrderHistory: React.FC = () => {
  const { customer } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  const fetchOrders = async () => {
    if (!customer) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'preparing':
        return 'outline';
      case 'ready':
        return 'secondary';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const reorderItems = (order: Order) => {
    // This would integrate with your cart system to add items from previous order
    console.log('Reordering items from order:', order.id);
    // TODO: Implement reorder functionality
  };

  if (!customer) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground">Track your orders and reorder your favorites</p>
        </div>
        <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              Start shopping to see your orders here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(order.created_at), 'MMM dd, yyyy - HH:mm')}
                      </div>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {formatCurrency(order.total)}
                    </div>
                    {order.discount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Saved {formatCurrency(order.discount)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-3">Items Ordered</h4>
                    <div className="space-y-2">
                      {(Array.isArray(order.items) ? order.items : []).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount {order.promo_code && `(${order.promo_code})`}</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-2 font-medium mb-2">
                        <User className="h-4 w-4" />
                        Customer Details
                      </div>
                      <div className="text-muted-foreground">
                        <div>{order.customer_name}</div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customer_phone}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 font-medium mb-2">
                        <MapPin className="h-4 w-4" />
                        Delivery Address
                      </div>
                      <div className="text-muted-foreground">
                        {order.customer_address}
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <>
                      <Separator />
                      <div>
                        <div className="font-medium mb-2">Order Notes</div>
                        <div className="text-muted-foreground text-sm bg-muted p-3 rounded">
                          {order.notes}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => reorderItems(order)}
                      className="flex-1"
                    >
                      Reorder
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" className="flex-1">
                        Rate Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};