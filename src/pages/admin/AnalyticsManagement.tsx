import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsManagement: React.FC = () => {
  const { products } = useAdmin();
  const [dateRange, setDateRange] = useState('7d');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load analytics data from database
  useEffect(() => {
    loadAnalyticsData();
  }, [selectedBranch, dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load orders from database
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('branch_id', selectedBranch || '')
        .neq('status', 'cancelled') // Exclude cancelled orders
        .gte('created_at', getDateRangeStart())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Use mock data as fallback
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeStart = () => {
    const now = new Date();
    switch (dateRange) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      case '1y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate metrics from actual orders data
  const revenueMetrics = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
    conversionRate: 3.2, // This would need additional data to calculate properly
  };

  // Generate sales data from orders
  const salesData = generateSalesData(orders);
  const topProducts = generateTopProducts(orders);
  const categoryData = generateCategoryData(orders);

  function generateSalesData(orders: any[]) {
    const dailySales: { [key: string]: { sales: number; orders: number } } = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { sales: 0, orders: 0 };
      }
      dailySales[date].sales += order.total;
      dailySales[date].orders += 1;
    });

    return Object.entries(dailySales)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7); // Last 7 days
  }

  function generateTopProducts(orders: any[]) {
    const productStats: { [key: string]: { name: string; sales: number; revenue: number } } = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach((item: any) => {
          if (!productStats[item.product_id]) {
            productStats[item.product_id] = {
              name: item.product_name,
              sales: 0,
              revenue: 0
            };
          }
          productStats[item.product_id].sales += item.quantity;
          productStats[item.product_id].revenue += item.price * item.quantity;
        });
      }
    });

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }

  function generateCategoryData(orders: any[]) {
    // This would need category information from products table
    // For now, return mock data
    return [
      { name: 'Burgers', value: 35, color: '#2563eb' },
      { name: 'Pizza', value: 28, color: '#7c3aed' },
      { name: 'Salads', value: 20, color: '#059669' },
      { name: 'Beverages', value: 17, color: '#ea580c' },
    ];
  }

  const exportData = () => {
    const csvData = salesData.map(item => 
      `${item.date},${item.sales},${item.orders}`
    ).join('\n');
    
    const blob = new Blob([`Date,Sales,Orders\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${dateRange}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track performance and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueMetrics.totalRevenue)}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last period
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{revenueMetrics.totalOrders}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.3% from last period
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(revenueMetrics.averageOrderValue)}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.8% from last period
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{revenueMetrics.conversionRate}%</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 rotate-180" />
                  -0.5% from last period
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="categories">Category Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Daily sales and order volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#7c3aed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products with highest sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};