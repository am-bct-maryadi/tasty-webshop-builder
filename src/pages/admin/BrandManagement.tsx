import React from 'react';
import { Building, Globe, Mail, Phone, MapPin, Upload, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

export const BrandManagement: React.FC = () => {
  const { brandSettings, updateBrandSettings } = useAdmin();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: brandSettings,
  });

  const socialForm = useForm({
    defaultValues: brandSettings.socialMedia,
  });

  const onSubmitBasic = (data: any) => {
    try {
      updateBrandSettings(data);
      toast({ title: "Brand settings updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update brand settings", variant: "destructive" });
    }
  };

  const onSubmitSocial = (data: any) => {
    try {
      updateBrandSettings({ socialMedia: data });
      toast({ title: "Social media links updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update social media", variant: "destructive" });
    }
  };

  const handleLogoChange = async (logoUrl: string) => {
    try {
      form.setValue('logo', logoUrl);
      await updateBrandSettings({ logo: logoUrl });
      toast({ title: "Logo updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update logo", variant: "destructive" });
    }
  };

  const handleLogoRemove = () => {
    form.setValue('logo', '');
    updateBrandSettings({ logo: '' });
  };

  const handleLogoUrl = () => {
    const logoUrl = form.getValues('logo');
    if (logoUrl) {
      updateBrandSettings({ logo: logoUrl });
      toast({ title: "Logo URL updated successfully" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Management</h1>
        <p className="text-muted-foreground">Manage your company branding, logo, and contact information</p>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="gap-2">
            <Building className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            Contact & Social
          </TabsTrigger>
          <TabsTrigger value="logo" className="gap-2">
            <Image className="h-4 w-4" />
            Logo & Branding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic company details and messaging</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitBasic)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      rules={{ required: "Company name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="FoodieApp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://foodieapp.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input placeholder="Delicious food delivered to your door" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="We are a premium food delivery service..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="footerText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Footer Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Your favorite meals, delivered fresh and fast." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="copyrightText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Copyright Text</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="© 2024 FoodieApp. All rights reserved." 
                              {...field} 
                              disabled 
                              className="bg-muted cursor-not-allowed"
                            />
                          </FormControl>
                          <div className="text-xs text-muted-foreground">
                            Copyright text can only be updated in the database
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Basic Information</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Business contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitBasic)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@foodieapp.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Business Address
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="123 Food Street, Culinary City, FC 12345" 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Save Contact Information</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...socialForm}>
                <form onSubmit={socialForm.handleSubmit(onSubmitSocial)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={socialForm.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/foodieapp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/foodieapp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/foodieapp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={socialForm.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/company/foodieapp" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit">Save Social Media Links</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logo Management</CardTitle>
              <CardDescription>Upload or set your company logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(brandSettings.logo || form.watch('logo')) && (
                <div className="flex items-center justify-center p-6 border rounded-lg bg-muted/30">
                  <img 
                    src={form.watch('logo') || brandSettings.logo} 
                    alt="Company Logo Preview" 
                    className="max-h-32 max-w-64 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Upload Logo File</h3>
                  <ImageUpload
                    value={form.watch('logo') || brandSettings.logo}
                    onChange={handleLogoChange}
                    onRemove={handleLogoRemove}
                    bucket="brand-assets"
                    maxSize={2}
                    className="max-w-md mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Or Enter Logo URL</h3>
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Form>
                  <Button onClick={handleLogoUrl} className="w-full">
                    Update Logo URL
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};