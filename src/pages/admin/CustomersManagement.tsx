import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Users, Search, Eye, Ban, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  email_verified: boolean;
  privacy_accepted: boolean;
  marketing_consent: boolean;
  created_at: string;
  last_login?: string;
}

interface CustomerAddress {
  id: string;
  label: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
}

export const CustomersManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch customers',
          variant: 'destructive',
        });
      } else {
        setCustomers(data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch customers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerAddresses = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', customerId)
        .order('is_default', { ascending: false });

      if (error) {
        console.error('Error fetching customer addresses:', error);
      } else {
        setCustomerAddresses(data || []);
      }
    } catch (error) {
      console.error('Error fetching customer addresses:', error);
    }
  };

  const toggleCustomerStatus = async (customerId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ is_active: !isActive })
        .eq('id', customerId);

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update customer status',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `Customer ${!isActive ? 'activated' : 'deactivated'} successfully`,
        });
        fetchCustomers();
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update customer status',
        variant: 'destructive',
      });
    }
  };

  const showCustomerDetails = async (customer: Customer) => {
    setSelectedCustomer(customer);
    await fetchCustomerAddresses(customer.id);
    setShowDetailsDialog(true);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusBadge = (customer: Customer) => {
    if (!customer.is_active) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (customer.email_verified) {
      return <Badge variant="default">Verified</Badge>;
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer accounts and view customer information
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
              <p className="text-2xl font-bold">
                {customers.filter(c => c.is_active).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Mail className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Verified Emails</p>
              <p className="text-2xl font-bold">
                {customers.filter(c => c.email_verified).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Ban className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Inactive Customers</p>
              <p className="text-2xl font-bold">
                {customers.filter(c => !c.is_active).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customers</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.full_name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer)}</TableCell>
                    <TableCell>
                      {format(new Date(customer.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {customer.last_login 
                        ? format(new Date(customer.last_login), 'MMM dd, yyyy')
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showCustomerDetails(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCustomerStatus(customer.id, customer.is_active)}
                        >
                          {customer.is_active ? (
                            <Ban className="h-4 w-4 text-red-600" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedCustomer.full_name}</div>
                    <div><strong>Email:</strong> {selectedCustomer.email}</div>
                    <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                    <div><strong>Status:</strong> {getStatusBadge(selectedCustomer)}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Joined:</strong> {format(new Date(selectedCustomer.created_at), 'MMM dd, yyyy')}</div>
                    <div><strong>Last Login:</strong> {selectedCustomer.last_login 
                      ? format(new Date(selectedCustomer.last_login), 'MMM dd, yyyy HH:mm')
                      : 'Never'
                    }</div>
                    <div><strong>Privacy Accepted:</strong> {selectedCustomer.privacy_accepted ? 'Yes' : 'No'}</div>
                    <div><strong>Marketing Consent:</strong> {selectedCustomer.marketing_consent ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Addresses
                </h3>
                {customerAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {customerAddresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <strong>{address.label}</strong>
                          {address.is_default && (
                            <Badge variant="default">Default</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {address.address_line1}
                          {address.address_line2 && `, ${address.address_line2}`}
                          <br />
                          {address.city}
                          {address.state && `, ${address.state}`}
                          {address.postal_code && ` ${address.postal_code}`}
                          <br />
                          {address.country}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No addresses found</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};