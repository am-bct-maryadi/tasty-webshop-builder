import React from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

export const BranchSelector: React.FC = () => {
  const { branches, selectedAdminBranch, setSelectedAdminBranch } = useAdmin();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Branch Management
        </CardTitle>
        <CardDescription>
          Select a branch to manage its products and categories, or view all data across branches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedAdminBranch || 'all'} onValueChange={(value) => setSelectedAdminBranch(value === 'all' ? null : value)}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select branch to manage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches (Master View)</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name} - {branch.address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAdminBranch && (
          <p className="text-sm text-muted-foreground mt-2">
            Currently managing: <span className="font-medium">
              {branches.find(b => b.id === selectedAdminBranch)?.name}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};