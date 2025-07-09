import React, { useState } from 'react';
import { Plus, Edit, Trash2, User, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { BranchSelector } from '@/components/admin/BranchSelector';

interface UserFormData {
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  branchId: string;
}

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, branches, selectedAdminBranch } = useAdmin();
  
  // Filter users based on selected branch
  const filteredUsers = selectedAdminBranch 
    ? users.filter(u => u.branchId === selectedAdminBranch || u.branchId === 'all')
    : users;
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    defaultValues: {
      username: '',
      email: '',
      role: 'staff',
      isActive: true,
      branchId: selectedAdminBranch || 'all',
    },
  });

  const onSubmit = (data: UserFormData) => {
    try {
      if (editingUser) {
        updateUser(editingUser, data);
        toast({ title: "User updated successfully" });
      } else {
        addUser(data);
        toast({ title: "User added successfully" });
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save user", variant: "destructive" });
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user.id);
    form.reset({
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      branchId: user.branchId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      deleteUser(id);
      toast({ title: "User deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    form.reset({
      username: '',
      email: '',
      role: 'staff',
      isActive: true,
      branchId: selectedAdminBranch || 'all',
    });
    setIsDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600';
      case 'manager': return 'text-blue-600';
      case 'staff': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <BranchSelector />
      <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage admin users and their permissions</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogDescription>
                  {editingUser ? 'Update user information and permissions' : 'Create a new admin user'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="branchId"
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Branches</SelectItem>
                              {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active User</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Set whether this user can access the admin panel
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
                      {editingUser ? 'Update' : 'Add'} User
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {user.username}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className={`font-medium capitalize ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.branchId === 'all' ? 'All Branches' : branches.find(b => b.id === user.branchId)?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  <span className={`text-sm font-medium ${
                    user.isActive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
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