
import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ResidentDirectory } from '@/components/members/ResidentDirectory';

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
        </div>

        <ResidentDirectory />
      </div>
    </AppShell>
  );
};

export default Members;
