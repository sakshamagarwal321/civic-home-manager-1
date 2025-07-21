
import React, { useState } from 'react';
import { ResidentCard } from './ResidentCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, Users, Home, Clock, CheckCircle } from 'lucide-react';

const mockResidents = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    flat: 'B-204',
    ownershipType: 'Owner' as const,
    ownerSince: '2018',
    familySize: 4,
    phone: '+91 9876543210',
    paymentStatus: 'Paid' as const,
    lastPayment: 'Jan 1, 2025 (₹3,500)',
    role: 'Secretary'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    flat: 'A-101',
    ownershipType: 'Owner' as const,
    ownerSince: '2020',
    familySize: 3,
    phone: '+91 9876543211',
    paymentStatus: 'Overdue' as const,
    dueAmount: 7000,
  },
  {
    id: '3',
    name: 'Amit Patel',
    flat: 'C-305',
    ownershipType: 'Tenant' as const,
    ownerSince: '2022',
    familySize: 2,
    phone: '+91 9876543212',
    paymentStatus: 'Paid' as const,
    lastPayment: 'Dec 28, 2024 (₹3,500)',
  },
  {
    id: '4',
    name: 'Sunita Reddy',
    flat: 'A-203',
    ownershipType: 'Owner' as const,
    ownerSince: '2019',
    familySize: 5,
    phone: '+91 9876543213',
    paymentStatus: 'Partial' as const,
    dueAmount: 1750,
  },
  {
    id: '5',
    name: 'Vikram Singh',
    flat: 'B-101',
    ownershipType: 'Tenant' as const,
    ownerSince: '2023',
    familySize: 2,
    phone: '+91 9876543214',
    paymentStatus: 'Paid' as const,
    lastPayment: 'Jan 2, 2025 (₹3,500)',
  },
  {
    id: '6',
    name: 'Meera Gupta',
    flat: 'C-102',
    ownershipType: 'Owner' as const,
    ownerSince: '2017',
    familySize: 3,
    phone: '+91 9876543215',
    paymentStatus: 'Overdue' as const,
    dueAmount: 3500,
  },
];

export const ResidentDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const filteredResidents = mockResidents.filter(resident => {
    const matchesSearch = 
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.flat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.phone.includes(searchTerm);

    const matchesStatus = filterStatus === 'all' || resident.paymentStatus.toLowerCase() === filterStatus;
    const matchesType = filterType === 'all' || resident.ownershipType.toLowerCase() === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const totalResidents = mockResidents.length;
  const owners = mockResidents.filter(r => r.ownershipType === 'Owner').length;
  const tenants = mockResidents.filter(r => r.ownershipType === 'Tenant').length;
  const paymentDue = mockResidents.filter(r => r.paymentStatus === 'Overdue').length;
  const fullyPaid = mockResidents.filter(r => r.paymentStatus === 'Paid').length;

  const handleViewProfile = (id: string) => {
    console.log('View profile for resident:', id);
  };

  const handleSendMessage = (id: string) => {
    console.log('Send message to resident:', id);
  };

  const handlePaymentHistory = (id: string) => {
    console.log('View payment history for resident:', id);
  };

  const handleSendReminder = (id: string) => {
    console.log('Send reminder to resident:', id);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, flat number, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="tenant">Tenant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalResidents}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Residents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{owners}</span>
            </div>
            <p className="text-sm text-muted-foreground">Owners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">{tenants}</span>
            </div>
            <p className="text-sm text-muted-foreground">Tenants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{paymentDue}</span>
            </div>
            <p className="text-sm text-muted-foreground">Payment Due</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{fullyPaid}</span>
            </div>
            <p className="text-sm text-muted-foreground">Fully Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Resident Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map(resident => (
          <ResidentCard
            key={resident.id}
            resident={resident}
            onViewProfile={handleViewProfile}
            onSendMessage={handleSendMessage}
            onPaymentHistory={handlePaymentHistory}
            onSendReminder={handleSendReminder}
          />
        ))}
      </div>

      {filteredResidents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No residents found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setFilterStatus('all');
            setFilterType('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
