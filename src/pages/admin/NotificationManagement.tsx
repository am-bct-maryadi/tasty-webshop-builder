import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Settings, Send, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface NotificationFormData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  target: 'all' | 'customers' | 'staff';
  channel: 'push' | 'email' | 'sms';
  scheduledFor?: string;
}

export const NotificationManagement: React.FC = () => {
  const { notifications, notificationSettings, sendNotification, updateNotificationSettings } = useAdmin();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('send');

  const form = useForm<NotificationFormData>({
    defaultValues: {
      title: '',
      message: '',
      type: 'info',
      target: 'all',
      channel: 'push',
      scheduledFor: '',
    },
  });

  const settingsForm = useForm({
    defaultValues: {
      emailNotifications: notificationSettings?.emailNotifications || true,
      pushNotifications: notificationSettings?.pushNotifications || true,
      smsNotifications: notificationSettings?.smsNotifications || false,
      orderUpdates: notificationSettings?.orderUpdates || true,
      promotions: notificationSettings?.promotions || true,
      inventory: notificationSettings?.inventory || true,
      system: notificationSettings?.system || true,
    },
  });

  const onSendNotification = (data: NotificationFormData) => {
    try {
      sendNotification(data);
      toast({ title: "Notification sent successfully" });
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    }
  };

  const onUpdateSettings = (data: any) => {
    try {
      updateNotificationSettings(data);
      toast({ title: "Settings updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update settings", variant: "destructive" });
    }
  };

  const notificationTemplates = [
    {
      name: 'Order Confirmation',
      title: 'Order Confirmed',
      message: 'Your order #{{orderNumber}} has been confirmed and is being prepared.',
      type: 'success'
    },
    {
      name: 'Low Stock Alert',
      title: 'Low Stock Alert',
      message: 'Product {{productName}} is running low on stock ({{quantity}} remaining).',
      type: 'warning'
    },
    {
      name: 'Promotion',
      title: 'Special Offer!',
      message: 'Enjoy {{discount}}% off on all {{category}} items until {{endDate}}.',
      type: 'info'
    },
  ];

  const recentNotifications = [
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight from 2-4 AM',
      type: 'warning',
      sentAt: '2024-01-07T10:30:00Z',
      recipients: 245,
    },
    {
      id: '2',
      title: 'New Menu Items',
      message: 'Check out our new seasonal menu items!',
      type: 'info',
      sentAt: '2024-01-06T14:15:00Z',
      recipients: 1823,
    },
    {
      id: '3',
      title: 'Order Ready',
      message: 'Your order is ready for pickup!',
      type: 'success',
      sentAt: '2024-01-06T12:45:00Z',
      recipients: 1,
    },
  ];

  const useTemplate = (template: any) => {
    form.setValue('title', template.title);
    form.setValue('message', template.message);
    form.setValue('type', template.type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notification Center</h1>
        <p className="text-muted-foreground">Send and manage notifications to users</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="send" className="gap-2">
            <Send className="h-4 w-4" />
            Send
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Bell className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>Create and send notifications to users</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSendNotification)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="success">Success</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              <SelectItem value="customers">Customers Only</SelectItem>
                              <SelectItem value="staff">Staff Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="channel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Channel</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="push">Push Notification</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Notification title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Type your notification message here..." 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="scheduledFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schedule For (Optional)</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Clear
                    </Button>
                    <Button type="submit">
                      Send Notification
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>View recently sent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge variant={notification.type as any}>{notification.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(notification.sentAt).toLocaleString()}</span>
                        <span>{notification.recipients} recipients</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Pre-built notification templates for common scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {notificationTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.message}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => useTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification preferences and channels</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(onUpdateSettings)} className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="space-y-4">
                      <FormField
                        control={settingsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Notifications
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Send notifications via email
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
                      <FormField
                        control={settingsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Push Notifications
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Send push notifications to mobile devices
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
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-4">
                      <FormField
                        control={settingsForm.control}
                        name="orderUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Order Updates</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Notifications about order status changes
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
                      <FormField
                        control={settingsForm.control}
                        name="inventory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Inventory Alerts</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Low stock and inventory notifications
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
                    </div>
                  </div>

                  <Button type="submit">Save Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};