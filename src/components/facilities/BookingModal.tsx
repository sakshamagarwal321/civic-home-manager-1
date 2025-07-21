
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, X } from 'lucide-react';
import { format } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, facilityId }) => {
  const [bookingData, setBookingData] = useState({
    date: undefined as Date | undefined,
    startTime: '',
    endTime: '',
    purpose: '',
    contactPerson: '',
    phone: '',
    expectedGuests: '',
    specialRequests: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log('Booking submitted:', bookingData);
    onClose();
  };

  if (!isOpen) return null;

  const facilityNames = {
    'community-hall': 'Community Hall',
    'playground': 'Playground',
    'visitor-parking': 'Visitor Parking',
  };

  const facilityName = facilityNames[facilityId as keyof typeof facilityNames] || 'Facility';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Book {facilityName}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Booking Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingData.date ? format(bookingData.date, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => setBookingData({ ...bookingData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., Birthday Party, Meeting"
                  value={bookingData.purpose}
                  onChange={(e) => setBookingData({ ...bookingData, purpose: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Full name"
                  value={bookingData.contactPerson}
                  onChange={(e) => setBookingData({ ...bookingData, contactPerson: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                />
              </div>

              {facilityId !== 'visitor-parking' && (
                <div className="space-y-2">
                  <Label htmlFor="expectedGuests">Expected Guests</Label>
                  <Input
                    id="expectedGuests"
                    type="number"
                    placeholder="Number of people"
                    value={bookingData.expectedGuests}
                    onChange={(e) => setBookingData({ ...bookingData, expectedGuests: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                placeholder="Any special requirements or requests..."
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Facility: {facilityName}</p>
                <p>Date: {bookingData.date ? format(bookingData.date, 'PPP') : 'Not selected'}</p>
                <p>Time: {bookingData.startTime} - {bookingData.endTime}</p>
                <p>Duration: {bookingData.startTime && bookingData.endTime ? 'Calculate based on time' : 'Not calculated'}</p>
                <p className="font-medium text-foreground">Estimated Cost: ₹500 (2 hours)</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Confirm Booking
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
