
import React from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { ResidentDirectory } from '@/components/members/ResidentDirectory';

const Members: React.FC = () => {
  return (
    <EnhancedAppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">
              Manage residents, track payments, and handle communications
            </p>
          </div>
        </div>

        <ResidentDirectory />
      </div>
    </EnhancedAppShell>
  );
};

export default Members;
