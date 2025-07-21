
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Clock, Calendar, MapPin } from 'lucide-react';

interface FacilityCardProps {
  facility: {
    id: string;
    name: string;
    capacity: string;
    hourlyRate: string;
    advanceBooking: string;
    status: 'Available' | 'Occupied' | 'Maintenance';
    currentBooking?: string;
    nextAvailable: string;
    icon: React.ReactNode;
    availableSlots?: string;
    peakHours?: string;
  };
  onBookNow: (facilityId: string) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, onBookNow }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500';
      case 'Occupied':
        return 'bg-yellow-500';
      case 'Maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Occupied':
        return 'secondary';
      case 'Maintenance':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {facility.icon}
            {facility.name}
          </CardTitle>
          <Badge variant={getStatusVariant(facility.status)}>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(facility.status)} mr-2`} />
            {facility.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
          <div className="text-gray-400 text-4xl">
            {facility.icon}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{facility.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{facility.hourlyRate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{facility.advanceBooking}</span>
          </div>
          {facility.availableSlots && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{facility.availableSlots}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          {facility.currentBooking && (
            <div>
              <span className="font-medium">Current: </span>
              <span className="text-muted-foreground">{facility.currentBooking}</span>
            </div>
          )}
          <div>
            <span className="font-medium">Next Available: </span>
            <span className="text-muted-foreground">{facility.nextAvailable}</span>
          </div>
          {facility.peakHours && (
            <div>
              <span className="font-medium">Peak Hours: </span>
              <span className="text-muted-foreground">{facility.peakHours}</span>
            </div>
          )}
        </div>

        <Button 
          onClick={() => onBookNow(facility.id)} 
          className="w-full"
          disabled={facility.status === 'Maintenance'}
        >
          {facility.name === 'Visitor Parking' ? 'Reserve Slot' : 'Book Now'}
        </Button>
      </CardContent>
    </Card>
  );
};
