
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Home, Calendar } from 'lucide-react';
import type { UserFlat } from '@/hooks/useFlatAssignments';

interface UserFlatCardProps {
  flat: UserFlat;
}

export const UserFlatCard: React.FC<UserFlatCardProps> = ({ flat }) => {
  return (
    <Card className="bg-primary/5">
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="font-medium">Flat Details</span>
            </div>
            <div className="space-y-1 ml-6">
              <p>Flat Number: <span className="font-medium">{flat.flat_number}</span></p>
              <p>Block: {flat.block}, Floor: {flat.floor_number}</p>
              <p>Type: {flat.flat_type}</p>
              <p>Area: {flat.carpet_area} sq ft</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="font-medium">Ownership</span>
            </div>
            <div className="space-y-1 ml-6">
              <div className="flex items-center gap-2">
                <Badge variant={flat.assignment_type === 'owner' ? 'default' : 'secondary'}>
                  {flat.assignment_type === 'owner' ? 'Owner' : 'Tenant'}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Since: {new Date(flat.start_date).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Monthly Maintenance: ₹2,500</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
