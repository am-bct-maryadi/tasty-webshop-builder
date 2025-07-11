import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, DollarSign, Search, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  promo_code?: string;
  notes?: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export const OrdersManagement: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState('1');
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data for now - in real app this would come from Supabase
  const mockOrders: Order[] = [
    {
      id: '1',
      customer_name: 'John Doe',
      customer_phone: '+62812345678',
      customer_address: 'Jl. Sudirman No. 123, Jakarta',
      items: [
        { product_id: '1', product_name: 'Classic Cheeseburger', quantity: 2, price: 45000 },
        { product_id: '2', product_name: 'French Fries', quantity: 1, price: 25000 }
      ],
      subtotal: 115000,
      discount: 11500,
      total: 103500,
      status: 'pending',
      promo_code: 'SAVE10',
      notes: 'Extra cheese please',
      branch_id: selectedBranch || '1',
      created_at: '2024-01-08T10:30:00Z',
      updated_at: '2024-01-08T10:30:00Z'
    },
    {
      id: '2',
      customer_name: 'Jane Smith',
      customer_phone: '+62887654321',
      customer_address: 'Jl. Thamrin No. 456, Jakarta',
      items: [
        { product_id: '3', product_name: 'Margherita Pizza', quantity: 1, price: 65000 }
      ],
      subtotal: 65000,
      discount: 0,
      total: 65000,
      status: 'confirmed',
      branch_id: selectedBranch || '1',
      created_at: '2024-01-08T11:15:00Z',
      updated_at: '2024-01-08T11:20:00Z'
    }
  ];

  useEffect(() => {
    loadOrders();
  }, [selectedBranch]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // In real app, fetch from Supabase:
      // const { data, error } = await supabase
      //   .from('orders')
      //   .select('*')
      //   .eq('branch_id', selectedBranch)
      //   .order('created_at', { ascending: false });
      
      // For now, use mock data
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // In real app, update in Supabase:
      // const { error } = await supabase
      //   .from('orders')
      //   .update({ status: newStatus, updated_at: new Date().toISOString() })
      //   .eq('id', orderId);

      // For now, update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_phone.includes(searchTerm) ||
                         order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { value: 'preparing', label: 'Preparing', icon: Package },
    { value: 'ready', label: 'Ready', icon: CheckCircle },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders by customer name, phone, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} order(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.product_name} x{item.quantity}
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - #{order.id}</DialogTitle>
                            <DialogDescription>
                              Manage order status and view details
                            </DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div>
                                <h3 className="font-semibold mb-2">Customer Information</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label>Name</Label>
                                    <p>{selectedOrder.customer_name}</p>
                                  </div>
                                  <div>
                                    <Label>Phone</Label>
                                    <p>{selectedOrder.customer_phone}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <Label>Address</Label>
                                    <p>{selectedOrder.customer_address}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items */}
                              <div>
                                <h3 className="font-semibold mb-2">Order Items</h3>
                                <div className="space-y-2">
                                  {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex justify-between">
                                      <span>{item.product_name} x{item.quantity}</span>
                                      <span>{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Totals */}
                              <div className="border-t pt-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                  </div>
                                  {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount ({selectedOrder.promo_code})</span>
                                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(selectedOrder.total)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Status Update */}
                              <div>
                                <Label className="mb-2 block">Update Status</Label>
                                <Select 
                                  value={selectedOrder.status} 
                                  onValueChange={(value: Order['status']) => 
                                    updateOrderStatus(selectedOrder.id, value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {selectedOrder.notes && (
                                <div>
                                  <Label>Customer Notes</Label>
                                  <p className="text-sm bg-muted p-2 rounded">
                                    {selectedOrder.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Select 
                        value={order.status} 
                        onValueChange={(value: Order['status']) => 
                          updateOrderStatus(order.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};