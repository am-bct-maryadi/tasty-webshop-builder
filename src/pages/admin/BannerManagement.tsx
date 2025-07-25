import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { BranchSelector } from '@/components/admin/BranchSelector';
import { useAdmin } from '@/contexts/AdminContext';

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'hero' | 'sidebar' | 'footer' | 'popup';
  isActive: boolean;
  order: number;
  branchId: string;
  startDate: string;
  endDate: string;
}

interface BannerFormData {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: 'hero' | 'sidebar' | 'footer' | 'popup';
  isActive: boolean;
  order: number;
  branchId: string;
  startDate: string;
  endDate: string;
}

export const BannerManagement: React.FC = () => {
  const { branches, selectedAdminBranch } = useAdmin();
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Welcome Banner',
      description: 'Welcome to our delicious food delivery service',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
      linkUrl: '/menu',
      position: 'hero',
      isActive: true,
      order: 1,
      branchId: '1',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  ]);
  
  const filteredBanners = selectedAdminBranch 
    ? banners.filter(b => b.branchId === selectedAdminBranch || b.branchId === 'all')
    : banners;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);

  const form = useForm<BannerFormData>({
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'hero',
      isActive: true,
      order: 1,
      branchId: selectedAdminBranch || 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: BannerFormData) => {
    try {
      if (editingBanner) {
        setBanners(prev => prev.map(banner => 
          banner.id === editingBanner ? { ...banner, ...data } : banner
        ));
        toast({ title: "Banner updated successfully" });
      } else {
        const newBanner: Banner = {
          id: Date.now().toString(),
          ...data,
        };
        setBanners(prev => [...prev, newBanner]);
        toast({ title: "Banner added successfully" });
      }
      setIsDialogOpen(false);
      setEditingBanner(null);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save banner", variant: "destructive" });
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner.id);
    form.reset(banner);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    try {
      setBanners(prev => prev.filter(banner => banner.id !== id));
      toast({ title: "Banner deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete banner", variant: "destructive" });
    }
  };

  const handleToggleStatus = (id: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
    ));
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    form.reset({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'hero',
      isActive: true,
      order: 1,
      branchId: selectedAdminBranch || 'all',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <BranchSelector />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Banner Management</CardTitle>
              <CardDescription>Manage promotional banners and advertisements</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                  <DialogDescription>
                    {editingBanner ? 'Update banner information' : 'Create a new promotional banner'}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Banner title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hero">Hero Section</SelectItem>
                                <SelectItem value="sidebar">Sidebar</SelectItem>
                                <SelectItem value="footer">Footer</SelectItem>
                                <SelectItem value="popup">Popup</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Banner description..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      rules={{ required: "Image URL is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('imageUrl') && (
                      <div className="mt-2">
                        <img 
                          src={form.watch('imageUrl')} 
                          alt="Banner preview" 
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="linkUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link URL</FormLabel>
                            <FormControl>
                              <Input placeholder="/menu or https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Order</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="1" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        rules={{ required: "Start date is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        rules={{ required: "End date is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
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
                            <FormLabel className="text-base">Active Banner</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Set whether this banner is currently displayed
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
                        {editingBanner ? 'Update' : 'Add'} Banner
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
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="w-16 h-10 rounded overflow-hidden">
                      <img 
                        src={banner.imageUrl} 
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      {banner.title}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{banner.position}</TableCell>
                  <TableCell>
                    {banner.branchId === 'all' ? 'All Branches' : branches.find(b => b.id === banner.branchId)?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(banner.startDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(banner.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(banner.id)}
                      className={`text-sm font-medium ${
                        banner.isActive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {banner.isActive ? (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Inactive
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
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