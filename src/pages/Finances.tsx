import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';

const Finances: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Financial Management</h1>
            <p className="text-muted-foreground">
              Track expenses, manage budgets, and monitor society finances
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Summary - January 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Financial management features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Finances;