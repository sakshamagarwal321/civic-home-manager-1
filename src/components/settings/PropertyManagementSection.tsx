
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Building2, Car, Users, PawPrint, Clock, MapPin, Home } from 'lucide-react';

export const PropertyManagementSection: React.FC = () => {
  const blockData = [
    { name: 'Block A', totalFlats: 40, occupied: 38, vacant: 2 },
    { name: 'Block B', totalFlats: 40, occupied: 35, vacant: 5 },
    { name: 'Block C', totalFlats: 40, occupied: 40, vacant: 0 }
  ];

  const flatTypeDistribution = [
    { type: '1 BHK', count: 45, percentage: 37.5 },
    { type: '2 BHK', count: 60, percentage: 50 },
    { type: '3 BHK', count: 15, percentage: 12.5 }
  ];

  const commonAreas = [
    { name: 'Community Hall', status: 'Available', nextMaintenance: '2024-02-15' },
    { name: 'Swimming Pool', status: 'Under Maintenance', nextMaintenance: '2024-01-30' },
    { name: 'Gymnasium', status: 'Available', nextMaintenance: '2024-03-01' },
    { name: 'Children\'s Play Area', status: 'Available', nextMaintenance: '2024-02-20' },
    { name: 'Garden & Landscaping', status: 'Available', nextMaintenance: '2024-02-10' }
  ];

  return (
    <div className="space-y-6">
      {/* Block Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Block Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {blockData.map((block) => (
              <div key={block.name} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{block.name}</h3>
                  <Badge variant="outline">{block.totalFlats} flats</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Occupied: {block.occupied}</span>
                    <span>Vacant: {block.vacant}</span>
                  </div>
                  <Progress value={(block.occupied / block.totalFlats) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {Math.round((block.occupied / block.totalFlats) * 100)}% occupancy
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flat Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Flat Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flatTypeDistribution.map((type) => (
              <div key={type.type} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">{type.count}</div>
                <div className="font-medium">{type.type}</div>
                <div className="text-sm text-muted-foreground">{type.percentage}% of total</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Common Areas & Facilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commonAreas.map((area) => (
              <div key={area.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium">{area.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Next maintenance: {area.nextMaintenance}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={area.status === 'Available' ? 'default' : 'secondary'}
                  >
                    {area.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parking Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Car className="mr-2 h-5 w-5" />
            Parking Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">150</div>
              <div className="font-medium">Total Slots</div>
              <div className="text-sm text-muted-foreground">Covered + Open</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">135</div>
              <div className="font-medium">Allocated</div>
              <div className="text-sm text-muted-foreground">90% utilization</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">15</div>
              <div className="font-medium">Available</div>
              <div className="text-sm text-muted-foreground">For new residents</div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            Manage Parking Allocation
          </Button>
        </CardContent>
      </Card>

      {/* Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Visitor Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Entry Hours:</span>
              <span className="text-muted-foreground">6:00 AM - 10:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration:</span>
              <span className="text-muted-foreground">Mandatory at gate</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Max Duration:</span>
              <span className="text-muted-foreground">12 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Guest Parking:</span>
              <span className="text-muted-foreground">Available (paid)</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Clock className="mr-2 h-4 w-4" />
              Edit Visitor Policy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PawPrint className="mr-2 h-5 w-5" />
              Pet Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Dogs Allowed:</span>
              <span className="text-muted-foreground">Yes (with conditions)</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Cats Allowed:</span>
              <span className="text-muted-foreground">Yes</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Registration:</span>
              <span className="text-muted-foreground">Required</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Common Area:</span>
              <span className="text-muted-foreground">On leash only</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <PawPrint className="mr-2 h-4 w-4" />
              Edit Pet Policy
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Property Settings</Button>
      </div>
    </div>
  );
};
