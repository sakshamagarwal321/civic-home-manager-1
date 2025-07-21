import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Building } from 'lucide-react';

const Facilities: React.FC = () => {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Facility Management</h1>
            <p className="text-muted-foreground">
              Book facilities, track maintenance, and manage common areas
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Facility Bookings & Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Facility management features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default Facilities;