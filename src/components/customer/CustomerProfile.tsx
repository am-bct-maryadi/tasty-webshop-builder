import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Phone, Mail, Calendar, Shield, Plus, Edit2, Trash2, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CustomerProfile: React.FC = () => {
  const { 
    customer, 
    addresses, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    logout 
  } = useCustomerAuth();
  const { toast } = useToast();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: customer?.full_name || '',
    phone: customer?.phone || ''
  });

  const [addressData, setAddressData] = useState({
    label: 'Home',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'ID'
  });

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast({ title: 'Profile updated successfully' });
      setIsEditingProfile(false);
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to update profile',
        variant: 'destructive' 
      });
    }
    setIsLoading(false);
  };

  const handleAddAddress = async () => {
    setIsLoading(true);
    const result = await addAddress({
      ...addressData,
      is_default: addresses.length === 0 // Set as default if it's the first address
    });
    
    if (result.success) {
      toast({ title: 'Address added successfully' });
      setIsAddingAddress(false);
      resetAddressForm();
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to add address',
        variant: 'destructive' 
      });
    }
    setIsLoading(false);
  };

  const handleUpdateAddress = async (id: string) => {
    setIsLoading(true);
    const result = await updateAddress(id, {
      ...addressData,
      is_default: false // Let user set default separately
    });
    
    if (result.success) {
      toast({ title: 'Address updated successfully' });
      setEditingAddress(null);
      resetAddressForm();
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to update address',
        variant: 'destructive' 
      });
    }
    setIsLoading(false);
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      const result = await deleteAddress(id);
      
      if (result.success) {
        toast({ title: 'Address deleted successfully' });
      } else {
        toast({ 
          title: 'Error', 
          description: result.error || 'Failed to delete address',
          variant: 'destructive' 
        });
      }
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const result = await setDefaultAddress(id);
    
    if (result.success) {
      toast({ title: 'Default address updated' });
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to set default address',
        variant: 'destructive' 
      });
    }
  };

  const resetAddressForm = () => {
    setAddressData({
      label: 'Home',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'ID'
    });
  };

  const startEditingAddress = (address: any) => {
    setAddressData({
      label: address.label,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country
    });
    setEditingAddress(address.id);
  };

  if (!customer) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and delivery addresses</p>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingProfile ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} disabled={isLoading}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Member since {new Date(customer.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={customer.email_verified ? 'default' : 'secondary'}>
                    {customer.email_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Addresses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle>Delivery Addresses</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingAddress(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Manage your delivery addresses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="h-4 w-4" />
                        <span className="font-medium">{address.label}</span>
                        {address.is_default && (
                          <Badge variant="default">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.address_line1}
                        {address.address_line2 && `, ${address.address_line2}`}
                        <br />
                        {address.city}
                        {address.state && `, ${address.state}`}
                        {address.postal_code && ` ${address.postal_code}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditingAddress(address)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              ))}
              
              {addresses.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No addresses added yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog 
        open={isAddingAddress || editingAddress !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingAddress(false);
            setEditingAddress(null);
            resetAddressForm();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Address Label</Label>
              <Select
                value={addressData.label}
                onValueChange={(value) => setAddressData({ ...addressData, label: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input
                value={addressData.address_line1}
                onChange={(e) => setAddressData({ ...addressData, address_line1: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Apartment, suite, etc. (optional)</Label>
              <Input
                value={addressData.address_line2}
                onChange={(e) => setAddressData({ ...addressData, address_line2: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={addressData.postal_code}
                  onChange={(e) => setAddressData({ ...addressData, postal_code: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={editingAddress ? () => handleUpdateAddress(editingAddress) : handleAddAddress}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                  resetAddressForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};