
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Grid, List, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ isOpen, onClose }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const mockBookings = [
    { id: '1', title: 'Birthday Party', facility: 'Community Hall', time: '2 PM - 6 PM', date: new Date() },
    { id: '2', title: 'Cricket Match', facility: 'Playground', time: '4 PM - 7 PM', date: new Date() },
    { id: '3', title: 'Maintenance', facility: 'Community Hall', time: '8 AM - 10 AM', date: new Date() },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Facility Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('day')}
                >
                  Day
                </Button>
              </div>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Today's Schedule</h3>
                <div className="space-y-2">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-medium text-sm">{booking.facility}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{booking.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{booking.time}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Legend</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Community Hall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Playground</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm">Visitor Parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm">Maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
