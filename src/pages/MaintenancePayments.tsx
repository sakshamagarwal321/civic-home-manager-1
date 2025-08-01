
import React, { useState } from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaintenancePaymentForm } from '@/components/maintenance/MaintenancePaymentForm';
import { AdminDashboard } from '@/components/maintenance/AdminDashboard';
import { CreditCard, BarChart3 } from 'lucide-react';

const MaintenancePayments: React.FC = () => {
  return (
    <EnhancedAppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Payments</h1>
          <p className="text-muted-foreground">
            Manage monthly maintenance fee payments and collections
          </p>
        </div>

        <Tabs defaultValue="payment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Make Payment
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="mt-6">
            <MaintenancePaymentForm />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </EnhancedAppShell>
  );
};

export default MaintenancePayments;
