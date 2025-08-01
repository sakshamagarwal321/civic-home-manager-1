
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveTable } from '@/components/ui/responsive-table';
import { TableRow, TableCell } from '@/components/ui/table';
import { Search, Filter, Download, Send, Receipt, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useMaintenancePayments } from '@/hooks/useMaintenancePayments';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { SendReminderModal } from '@/components/dashboard/SendReminderModal';

export const AdminDashboard: React.FC = () => {
  const { payments, flats, settings, paymentsLoading } = useMaintenancePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Calculate statistics
  const currentMonthPayments = payments.filter(p => 
    p.payment_month.startsWith(selectedMonth)
  );

  const totalCollections = currentMonthPayments
    .filter(p => p.status === 'paid' || p.status === 'verified')
    .reduce((sum, p) => sum + p.total_amount, 0);

  const pendingPayments = flats.length - currentMonthPayments.filter(p => 
    p.status === 'paid' || p.status === 'verified'
  ).length;

  const latePayments = currentMonthPayments.filter(p => p.penalty_amount > 0).length;

  const collectionRate = Math.round((currentMonthPayments.filter(p => 
    p.status === 'paid' || p.status === 'verified'
  ).length / flats.length) * 100);

  // Filter payments
  const filteredPayments = currentMonthPayments.filter(payment => {
    const matchesSearch = 
      payment.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get payment status for each flat
  const getFlatsWithPaymentStatus = () => {
    return flats.map(flat => {
      const payment = currentMonthPayments.find(p => p.flat_number === flat.flat_number);
      return {
        ...flat,
        payment_status: payment?.status || 'pending',
        payment_date: payment?.payment_date,
        total_amount: payment?.total_amount || (settings?.base_maintenance_fee || 2500),
        receipt_number: payment?.receipt_number,
        days_overdue: payment ? 0 : Math.max(0, Math.floor(
          (new Date().getTime() - new Date(selectedMonth + '-10').getTime()) / (1000 * 60 * 60 * 24)
        ))
      };
    });
  };

  const flatsWithStatus = getFlatsWithPaymentStatus().filter(flat => {
    const matchesSearch = 
      flat.flat_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flat.resident_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || flat.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const handleViewReceipt = (receiptNumber: string) => {
    console.log('View receipt:', receiptNumber);
  };

  const handleSendReminder = (flatNumber: string) => {
    console.log('Send reminder to:', flatNumber);
  };

  const headers = [
    'Flat Number',
    'Resident Name', 
    'Payment Status',
    'Amount Due',
    'Payment Date',
    'Receipt Number',
    'Days Overdue',
    'Actions'
  ];

  const renderTableRow = (flat: any, index: number) => (
    <TableRow key={flat.id}>
      <TableCell className="font-medium">{flat.flat_number}</TableCell>
      <TableCell>{flat.resident_name || 'Not assigned'}</TableCell>
      <TableCell>{getStatusBadge(flat.payment_status)}</TableCell>
      <TableCell>₹{flat.total_amount.toLocaleString()}</TableCell>
      <TableCell>
        {flat.payment_date ? format(new Date(flat.payment_date), 'MMM dd, yyyy') : '-'}
      </TableCell>
      <TableCell>{flat.receipt_number || '-'}</TableCell>
      <TableCell>
        {flat.days_overdue > 0 ? (
          <span className="text-red-600">{flat.days_overdue} days</span>
        ) : (
          '-'
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {flat.receipt_number && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewReceipt(flat.receipt_number)}
            >
              <Receipt className="h-4 w-4" />
            </Button>
          )}
          {flat.payment_status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSendReminder(flat.flat_number)}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  const renderCard = (flat: any, index: number) => (
    <Card key={flat.id}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{flat.flat_number}</h4>
              <p className="text-sm text-muted-foreground">{flat.resident_name || 'Not assigned'}</p>
            </div>
            {getStatusBadge(flat.payment_status)}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Amount Due:</span>
              <span className="font-medium">₹{flat.total_amount.toLocaleString()}</span>
            </div>
            {flat.payment_date && (
              <div className="flex justify-between">
                <span>Payment Date:</span>
                <span>{format(new Date(flat.payment_date), 'MMM dd, yyyy')}</span>
              </div>
            )}
            {flat.receipt_number && (
              <div className="flex justify-between">
                <span>Receipt:</span>
                <span className="font-mono text-xs">{flat.receipt_number}</span>
              </div>
            )}
            {flat.days_overdue > 0 && (
              <div className="flex justify-between">
                <span>Days Overdue:</span>
                <span className="text-red-600">{flat.days_overdue} days</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {flat.receipt_number && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleViewReceipt(flat.receipt_number)}
              >
                <Receipt className="h-4 w-4 mr-2" />
                Receipt
              </Button>
            )}
            {flat.payment_status === 'pending' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleSendReminder(flat.flat_number)}
              >
                <Send className="h-4 w-4 mr-2" />
                Remind
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage maintenance fee collections
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowReminderModal(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">₹{totalCollections.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">Total Collections</p>
            <p className="text-xs text-muted-foreground">
              {currentMonthPayments.filter(p => p.status === 'paid' || p.status === 'verified').length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">{pendingPayments}</span>
            </div>
            <p className="text-sm text-muted-foreground">Pending Payments</p>
            <p className="text-xs text-muted-foreground">
              ₹{(pendingPayments * (settings?.base_maintenance_fee || 2500)).toLocaleString()} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{latePayments}</span>
            </div>
            <p className="text-sm text-muted-foreground">Late Payments</p>
            <p className="text-xs text-muted-foreground">With penalty</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{collectionRate}%</span>
            </div>
            <p className="text-sm text-muted-foreground">Collection Rate</p>
            <p className="text-xs text-muted-foreground">
              {currentMonthPayments.filter(p => p.status === 'paid' || p.status === 'verified').length} of {flats.length} flats
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by flat number, resident name, or receipt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status - {format(new Date(selectedMonth + '-01'), 'MMMM yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveTable
            headers={headers}
            data={flatsWithStatus}
            renderRow={renderTableRow}
            renderCard={renderCard}
          />
        </CardContent>
      </Card>

      {/* Send Reminder Modal */}
      <SendReminderModal 
        open={showReminderModal}
        onOpenChange={setShowReminderModal}
      />
    </div>
  );
};
