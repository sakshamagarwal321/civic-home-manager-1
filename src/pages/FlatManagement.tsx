
import React from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { FlatManagementDashboard } from '@/components/admin/FlatManagementDashboard';

const FlatManagement: React.FC = () => {
  return (
    <EnhancedAppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Flat Management</h1>
            <p className="text-muted-foreground">
              Manage flat assignments, track occupancy, and maintain resident records
            </p>
          </div>
        </div>

        <FlatManagementDashboard />
      </div>
    </EnhancedAppShell>
  );
};

export default FlatManagement;
