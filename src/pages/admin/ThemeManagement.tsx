import React, { useState } from 'react';
import { Palette, Monitor, Sun, Moon, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useAdmin } from '@/contexts/AdminContext';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface ThemeFormData {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  darkModeEnabled: boolean;
  compactMode: boolean;
}

export const ThemeManagement: React.FC = () => {
  const { themeSettings, updateThemeSettings } = useAdmin();
  const { toast } = useToast();
  
  const form = useForm<ThemeFormData>({
    defaultValues: {
      primaryColor: themeSettings?.primaryColor || '#2563eb',
      accentColor: themeSettings?.accentColor || '#7c3aed',
      fontFamily: themeSettings?.fontFamily || 'inter',
      fontSize: themeSettings?.fontSize || 14,
      borderRadius: themeSettings?.borderRadius || 8,
      darkModeEnabled: themeSettings?.darkModeEnabled || false,
      compactMode: themeSettings?.compactMode || false,
    },
  });

  const onSubmit = async (data: ThemeFormData) => {
    try {
      await updateThemeSettings(data);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const resetToDefault = async () => {
    const defaultSettings = {
      primaryColor: '#2563eb',
      accentColor: '#7c3aed',
      fontFamily: 'inter',
      fontSize: 14,
      borderRadius: 8,
      darkModeEnabled: false,
      compactMode: false,
    };
    form.reset(defaultSettings);
    await updateThemeSettings(defaultSettings);
  };

  const colorPresets = [
    { name: 'Blue', primary: '#2563eb', accent: '#7c3aed' },
    { name: 'Green', primary: '#059669', accent: '#7c2d12' },
    { name: 'Purple', primary: '#7c3aed', accent: '#db2777' },
    { name: 'Orange', primary: '#ea580c', accent: '#be185d' },
    { name: 'Red', primary: '#dc2626', accent: '#9333ea' },
  ];

  const applyPreset = (preset: any) => {
    form.setValue('primaryColor', preset.primary);
    form.setValue('accentColor', preset.accent);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Configuration</CardTitle>
          <CardDescription>Customize the appearance of your admin panel and customer app</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Color Presets */}
              <div className="space-y-3">
                <FormLabel>Color Presets</FormLabel>
                <div className="flex gap-2 flex-wrap">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="gap-2"
                    >
                      <div className="flex gap-1">
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-3 h-3 rounded-full border" 
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-16 h-10 p-1" />
                          <Input {...field} placeholder="#2563eb" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accentColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accent Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input type="color" {...field} className="w-16 h-10 p-1" />
                          <Input {...field} placeholder="#7c3aed" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Typography */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Family</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inter">Inter</SelectItem>
                          <SelectItem value="roboto">Roboto</SelectItem>
                          <SelectItem value="open-sans">Open Sans</SelectItem>
                          <SelectItem value="lato">Lato</SelectItem>
                          <SelectItem value="poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fontSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Font Size: {field.value}px</FormLabel>
                      <FormControl>
                        <Slider
                          min={12}
                          max={18}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Layout */}
              <FormField
                control={form.control}
                name="borderRadius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Border Radius: {field.value}px</FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={16}
                        step={2}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* UI Options */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="darkModeEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark Mode
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Enable dark theme for the application
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
                  control={form.control}
                  name="compactMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Compact Mode
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Reduce spacing and padding for mobile devices
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

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetToDefault}>
                  Reset to Default
                </Button>
                <Button type="submit">
                  Save Theme Settings
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};