import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface BranchFormData {
  name: string;
  address: string;
  isOpen: boolean;
}

export const BranchesManagement: React.FC = () => {
  const { branches, addBranch, updateBranch, deleteBranch } = useAdmin();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<string | null>(null);

  const form = useForm<BranchFormData>({
    defaultValues: {
      name: '',
      address: '',
      isOpen: true,
    },
  });

  const onSubmit = (data: BranchFormData) => {
    try {
      if (editingBranch) {
        updateBranch(editingBranch, data);
        toast({ title: "Branch updated successfully" });
      } else {
        addBranch(data);
        toast({ title: "Branch added successfully" });
      }
      setIsDialogOpen(false);
      setEditingBranch(null);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save branch", variant: "destructive" });
    }
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch.id);
    form.reset({
      name: branch.name,
      address: branch.address,
      isOpen: branch.isOpen,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteBranch(id);
      toast({ title: "Branch deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete branch", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    form.reset({
      name: '',
      address: '',
      isOpen: true,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-muted-foreground">Manage your store locations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
              <DialogDescription>
                {editingBranch ? 'Update branch information' : 'Add a new store location'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Branch name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Downtown Branch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isOpen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Currently Open</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Set whether this branch is currently accepting orders
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
                    {editingBranch ? 'Update' : 'Add'} Branch
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Branches ({branches.length})</CardTitle>
          <CardDescription>Manage your store locations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {branch.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {branch.address}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className={`text-sm font-medium ${
                        branch.isOpen ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {branch.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(branch)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(branch.id)}
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