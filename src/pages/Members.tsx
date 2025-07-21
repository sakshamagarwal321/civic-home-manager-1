import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';

const Members: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">
              Manage residents, track payments, and handle communications
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resident Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Member management features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Members;