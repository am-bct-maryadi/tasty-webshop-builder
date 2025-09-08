import React from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

export const BranchSelector: React.FC = () => {
  const { branches, selectedAdminBranch, setSelectedAdminBranch } = useAdmin();

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          Branch Management
        </CardTitle>
        <CardDescription className="text-sm">
          Select a branch to manage its products and categories, or view all data across branches
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Select value={selectedAdminBranch || 'all'} onValueChange={(value) => setSelectedAdminBranch(value === 'all' ? null : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select branch to manage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches (Master View)</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                  <span className="font-medium">{branch.name}</span>
                  <span className="text-xs text-muted-foreground sm:ml-2">
                    {branch.address}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAdminBranch && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Currently managing: <span className="font-medium">
              {branches.find(b => b.id === selectedAdminBranch)?.name}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
};