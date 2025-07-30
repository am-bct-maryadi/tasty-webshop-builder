import React, { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { BranchSelector } from '@/components/admin/BranchSelector';

interface CategoryFormData {
  name: string;
  sortOrder: number;
}

export const CategoriesManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, selectedAdminBranch, branches } = useAdmin();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      sortOrder: 0,
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        updateCategory(editingCategory, data);
        toast({ title: "Category updated successfully" });
      } else {
        addCategory({ ...data, branchId: selectedAdminBranch || '1' });
        toast({ title: "Category added successfully" });
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save category", variant: "destructive" });
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category.id);
    form.reset({
      name: category.name,
      sortOrder: category.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteCategory(id);
      toast({ title: "Category deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      sortOrder: categories.length,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <BranchSelector />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">
            {selectedAdminBranch 
              ? `Managing categories for: ${branches.find(b => b.id === selectedAdminBranch)?.name}`
              : 'Managing all categories across branches'
            }
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category information' : 'Create a new menu category'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Category name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Burgers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  rules={{ required: "Sort order is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({categories.length})</CardTitle>
          <CardDescription>Manage your menu categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Product Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.sortOrder || 0}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.count} items
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
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