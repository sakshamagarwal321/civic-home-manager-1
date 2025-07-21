
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Building, Users, MapPin } from 'lucide-react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { BookingDetailsPanel } from '@/components/facilities/BookingDetailsPanel';
import { CalendarView } from '@/components/facilities/CalendarView';
import { BookingModal } from '@/components/facilities/BookingModal';

const Facilities: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<string>('');

  const facilities = [
    {
      id: 'community-hall',
      name: 'Community Hall',
      capacity: '100 people',
      hourlyRate: '₹500/hour',
      advanceBooking: 'Up to 30 days',
      status: 'Available' as const,
      nextAvailable: 'Today 6:00 PM',
      icon: <Building className="h-5 w-5" />,
    },
    {
      id: 'playground',
      name: 'Playground',
      capacity: 'Open access',
      hourlyRate: '₹200/hour',
      advanceBooking: 'Up to 15 days',
      status: 'Available' as const,
      currentBooking: "Children's play time",
      nextAvailable: 'Tomorrow 8:00 AM',
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 'visitor-parking',
      name: 'Visitor Parking',
      capacity: '20 slots',
      hourlyRate: '₹50/hour',
      advanceBooking: 'Up to 7 days',
      status: 'Occupied' as const,
      availableSlots: '8 remaining',
      peakHours: '6 PM - 10 PM',
      nextAvailable: 'Available now',
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  const todayBookings = [
    {
      id: '1',
      facility: 'Community Hall',
      title: 'Birthday Party',
      time: '2 PM - 6 PM',
      bookedBy: 'Priya Sharma',
      type: 'booking' as const,
    },
    {
      id: '2',
      facility: 'Playground',
      title: 'Cricket Match',
      time: '4 PM - 7 PM',
      bookedBy: 'Youth Committee',
      type: 'booking' as const,
    },
    {
      id: '3',
      facility: 'Community Hall',
      title: 'Hall cleaning',
      time: '8 AM - 10 AM',
      bookedBy: 'Maintenance Team',
      type: 'maintenance' as const,
    },
  ];

  const stats = {
    todayRevenue: '₹2,800',
    monthlyBookings: 45,
    mostPopular: 'Community Hall (28)',
    utilizationRate: '78%',
  };

  const handleBookNow = (facilityId: string) => {
    setSelectedFacility(facilityId);
    setShowBookingModal(true);
  };

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
            <Button variant="outline" onClick={() => setShowCalendar(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button onClick={() => setShowBookingModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          </div>

          <div className="xl:col-span-1">
            <BookingDetailsPanel bookings={todayBookings} stats={stats} />
          </div>
        </div>

        <CalendarView
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
        />

        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          facilityId={selectedFacility}
        />
      </div>
    </AppShell>
  );
};

export default Facilities;
