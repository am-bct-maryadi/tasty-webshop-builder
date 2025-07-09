import React, { useState } from 'react';
import { Plus, Edit, Trash2, Percent, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface PromoFormData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  isActive: boolean;
  expiryDate: string;
}

export const PromosManagement: React.FC = () => {
  const { promos, addPromo, updatePromo, deletePromo } = useAdmin();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<string | null>(null);

  const form = useForm<PromoFormData>({
    defaultValues: {
      code: '',
      type: 'percentage',
      value: 10,
      minOrderAmount: 0,
      isActive: true,
      expiryDate: '',
    },
  });

  const onSubmit = (data: PromoFormData) => {
    try {
      if (editingPromo) {
        updatePromo(editingPromo, data);
        toast({ title: "Promo code updated successfully" });
      } else {
        addPromo(data);
        toast({ title: "Promo code added successfully" });
      }
      setIsDialogOpen(false);
      setEditingPromo(null);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save promo code", variant: "destructive" });
    }
  };

  const handleEdit = (promo: any) => {
    setEditingPromo(promo.id);
    form.reset({
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minOrderAmount: promo.minOrderAmount,
      isActive: promo.isActive,
      expiryDate: promo.expiryDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deletePromo(id);
      toast({ title: "Promo code deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete promo code", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingPromo(null);
    form.reset({
      code: '',
      type: 'percentage',
      value: 10,
      minOrderAmount: 0,
      isActive: true,
      expiryDate: '',
    });
    setIsDialogOpen(true);
  };

  const formatDiscount = (type: string, value: number) => {
    return type === 'percentage' ? `${value}%` : `$${value}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Promo Code Management</h1>
          <p className="text-muted-foreground">Create and manage discount codes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Edit Promo Code' : 'Add New Promo Code'}</DialogTitle>
              <DialogDescription>
                {editingPromo ? 'Update promo code details' : 'Create a new discount code'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  rules={{ required: "Promo code is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promo Code</FormLabel>
                      <FormControl>
                        <Input placeholder="SAVE20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    rules={{ required: "Value is required", min: { value: 1, message: "Value must be at least 1" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="minOrderAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  rules={{ required: "Expiry date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Set whether this promo code is currently active
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPromo ? 'Update' : 'Add'} Promo Code
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promo Codes ({promos.length})</CardTitle>
          <CardDescription>Manage your discount codes and offers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      {promo.code}
                    </div>
                  </TableCell>
                  <TableCell>{formatDiscount(promo.type, promo.value)}</TableCell>
                  <TableCell>${promo.minOrderAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(promo.expiryDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${
                      promo.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(promo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(promo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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