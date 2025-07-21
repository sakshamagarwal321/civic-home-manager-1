import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Send, Bell } from 'lucide-react';

const Announcements: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Announcements</h1>
            <p className="text-muted-foreground">
              Communicate with residents and manage society notifications
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Send Alert
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Announcement management features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Announcements;