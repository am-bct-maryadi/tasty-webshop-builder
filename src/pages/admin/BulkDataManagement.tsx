import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ImportRow {
  id?: string;
  data: any;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export const BulkDataManagement: React.FC = () => {
  const { products, addProduct, updateProduct, categories, addCategory, updateCategory, inventory, updateInventory, selectedAdminBranch } = useAdmin();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<'products' | 'categories' | 'inventory'>('products');
  const [file, setFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const dataTypes = [
    { value: 'products', label: 'Products', description: 'Import/export product catalog' },
    { value: 'categories', label: 'Categories', description: 'Import/export menu categories' },
    { value: 'inventory', label: 'Inventory', description: 'Import/export stock levels' },
  ];

  const getTemplateData = (type: string) => {
    switch (type) {
      case 'products':
        return [
          {
            id: '1',
            name: 'Classic Burger',
            description: 'Delicious beef burger with fresh ingredients',
            price: 12.99,
            category: 'Burgers',
            rating: 4.5,
            prepTime: 15,
            isAvailable: true,
            isPopular: false,
            image: 'https://example.com/image.jpg'
          }
        ];
      case 'categories':
        return [
          {
            id: 'burgers',
            name: 'Burgers',
            count: 5
          }
        ];
      case 'inventory':
        return [
          {
            productId: '1',
            quantity: 100,
            lowStockThreshold: 10
          }
        ];
      default:
        return [];
    }
  };

  const downloadTemplate = () => {
    const templateData = getTemplateData(selectedType);
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedType);
    XLSX.writeFile(workbook, `${selectedType}_template.xlsx`);
    
    toast({ title: "Template downloaded successfully" });
  };

  const exportCurrentData = () => {
    let data: any[] = [];
    
    switch (selectedType) {
      case 'products':
        data = products.map(p => {
          const categoryName = categories.find(c => c.id === p.category)?.name || p.category;
          return {
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: categoryName,
            rating: p.rating,
            prepTime: p.prepTime,
            isAvailable: p.isAvailable,
            isPopular: p.isPopular,
            image: p.image
          };
        });
        break;
      case 'categories':
        data = categories.map(c => ({
          id: c.id,
          name: c.name,
          count: c.count
        }));
        break;
      case 'inventory':
        data = Object.entries(inventory).map(([productId, item]) => ({
          productId,
          quantity: item.quantity,
          lowStockThreshold: item.lowStockThreshold
        }));
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedType);
    XLSX.writeFile(workbook, `${selectedType}_export.xlsx`);
    
    toast({ title: "Data exported successfully" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(xlsx|xls)$/)) {
      toast({ title: "Error", description: "Please upload an Excel file (.xlsx or .xls)", variant: "destructive" });
      return;
    }

    setFile(uploadedFile);
    parseExcelFile(uploadedFile);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedData: ImportRow[] = jsonData.map((row: any, index) => ({
          id: row.id || `temp_${index}`,
          data: row,
          status: 'pending' as const,
        }));

        setImportData(processedData);
        setPreviewMode(true);
        toast({ title: "File parsed successfully", description: `Found ${processedData.length} rows` });
      } catch (error) {
        toast({ title: "Error", description: "Failed to parse Excel file", variant: "destructive" });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validateRow = (row: any, type: string): { isValid: boolean; error?: string } => {
    switch (type) {
      case 'products':
        if (!row.name || !row.price || !row.category) {
          return { isValid: false, error: 'Missing required fields: name, price, category' };
        }
        if (isNaN(row.price) || row.price <= 0) {
          return { isValid: false, error: 'Price must be a positive number' };
        }
        break;
      case 'categories':
        if (!row.name) {
          return { isValid: false, error: 'Missing required field: name' };
        }
        break;
      case 'inventory':
        if (!row.productId || row.quantity === undefined) {
          return { isValid: false, error: 'Missing required fields: productId, quantity' };
        }
        if (isNaN(row.quantity) || row.quantity < 0) {
          return { isValid: false, error: 'Quantity must be a non-negative number' };
        }
        break;
    }
    return { isValid: true };
  };

  const processImport = async () => {
    setIsProcessing(true);
    setProgress(0);

    const updatedData: ImportRow[] = [];

    for (let i = 0; i < importData.length; i++) {
      const row = importData[i];
      const validation = validateRow(row.data, selectedType);

      if (!validation.isValid) {
        updatedData.push({
          ...row,
          status: 'error',
          error: validation.error
        });
      } else {
        try {
          switch (selectedType) {
            case 'products':
              // Check for existing product by ID or name
              const existingProduct = products.find(p => 
                (row.data.id && p.id === row.data.id) || 
                (p.name === row.data.name && p.branchId === (selectedAdminBranch || '1'))
              );
              
              // Find category ID from category name
              const categoryId = categories.find(c => c.name === row.data.category)?.id || row.data.category;
              
              if (existingProduct) {
                updateProduct(existingProduct.id, {
                  name: row.data.name,
                  description: row.data.description || '',
                  price: Number(row.data.price),
                  category: categoryId,
                  rating: Number(row.data.rating) || 0,
                  prepTime: Number(row.data.prepTime) || 0,
                  isAvailable: Boolean(row.data.isAvailable),
                  isPopular: Boolean(row.data.isPopular),
                  image: row.data.image || '',
                  branchId: selectedAdminBranch || '1'
                });
              } else {
                addProduct({
                  name: row.data.name,
                  description: row.data.description || '',
                  price: Number(row.data.price),
                  category: categoryId,
                  rating: Number(row.data.rating) || 0,
                  prepTime: Number(row.data.prepTime) || 0,
                  isAvailable: Boolean(row.data.isAvailable),
                  isPopular: Boolean(row.data.isPopular),
                  image: row.data.image || '',
                  branchId: selectedAdminBranch || '1'
                });
              }
              break;
            case 'categories':
              if (row.data.id && categories.find(c => c.id === row.data.id)) {
                updateCategory(row.data.id, { name: row.data.name });
              } else {
                addCategory({ name: row.data.name, branchId: selectedAdminBranch || '1' });
              }
              break;
            case 'inventory':
              updateInventory(
                row.data.productId,
                Number(row.data.quantity),
                'set',
                'Bulk import update'
              );
              break;
          }
          
          updatedData.push({
            ...row,
            status: 'success'
          });
        } catch (error) {
          updatedData.push({
            ...row,
            status: 'error',
            error: 'Failed to process row'
          });
        }
      }

      setProgress(((i + 1) / importData.length) * 100);
      // Add small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setImportData(updatedData);
    setIsProcessing(false);
    
    const successCount = updatedData.filter(row => row.status === 'success').length;
    const errorCount = updatedData.filter(row => row.status === 'error').length;
    
    toast({
      title: "Import completed",
      description: `${successCount} rows processed successfully, ${errorCount} errors`
    });
  };

  const resetImport = () => {
    setFile(null);
    setImportData([]);
    setPreviewMode(false);
    setProgress(0);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Data Management</h1>
        <p className="text-muted-foreground">Import and export data in bulk using Excel files</p>
      </div>

      {/* Data Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Data Type</CardTitle>
          <CardDescription>Choose what type of data you want to import/export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dataTypes.map((type) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-colors ${
                  selectedType === type.value ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedType(type.value as any)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    <h3 className="font-medium">{type.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates and Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Download Template</CardTitle>
            <CardDescription>Get a template file with the correct format</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} className="w-full gap-2">
              <Download className="h-4 w-4" />
              Download {selectedType} Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Current Data</CardTitle>
            <CardDescription>Download existing data as Excel file</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportCurrentData} variant="outline" className="w-full gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export {selectedType} Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>Upload an Excel file to import {selectedType} data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!previewMode ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium">Click to upload Excel file</span>
                <p className="text-sm text-muted-foreground mt-2">Supports .xlsx and .xls files</p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Preview: {file?.name}</h3>
                  <p className="text-sm text-muted-foreground">{importData.length} rows found</p>
                </div>
                <Button variant="outline" onClick={resetImport}>
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      {Object.keys(importData[0]?.data || {}).slice(0, 4).map(key => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importData.slice(0, 20).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant={
                            row.status === 'success' ? 'default' :
                            row.status === 'error' ? 'destructive' : 'secondary'
                          }>
                            {row.status === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {row.status === 'error' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {row.status}
                          </Badge>
                        </TableCell>
                        {Object.values(row.data).slice(0, 4).map((value: any, i) => (
                          <TableCell key={i} className="max-w-32 truncate">
                            {String(value)}
                          </TableCell>
                        ))}
                        <TableCell className="text-red-600 text-sm">
                          {row.error}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {!isProcessing && (
                <Button onClick={processImport} className="w-full" size="lg">
                  Import {importData.length} Rows
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Summary */}
      {importData.length > 0 && importData.some(row => row.status !== 'pending') && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Import Summary: {importData.filter(row => row.status === 'success').length} successful, 
            {importData.filter(row => row.status === 'error').length} errors
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};