
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Wrench } from 'lucide-react';

interface BookingDetailsPanelProps {
  bookings: Array<{
    id: string;
    facility: string;
    title: string;
    time: string;
    bookedBy: string;
    type: 'booking' | 'maintenance';
  }>;
  stats: {
    todayRevenue: string;
    monthlyBookings: number;
    mostPopular: string;
    utilizationRate: string;
  };
}

export const BookingDetailsPanel: React.FC<BookingDetailsPanelProps> = ({ bookings, stats }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {booking.type === 'maintenance' ? (
                    <Wrench className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Calendar className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="font-medium text-sm">{booking.facility}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {booking.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{booking.time}</span>
                  <User className="h-3 w-3 text-muted-foreground ml-2" />
                  <span className="text-xs text-muted-foreground">{booking.bookedBy}</span>
                </div>
              </div>
              <Badge variant={booking.type === 'maintenance' ? 'secondary' : 'default'}>
                {booking.type === 'maintenance' ? 'Maintenance' : 'Booked'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.todayRevenue}</div>
              <div className="text-sm text-muted-foreground">Today's Revenue</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.monthlyBookings}</div>
              <div className="text-sm text-muted-foreground">Monthly Bookings</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-600">{stats.mostPopular}</div>
              <div className="text-sm text-muted-foreground">Most Popular</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.utilizationRate}</div>
              <div className="text-sm text-muted-foreground">Utilization Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
