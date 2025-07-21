
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  MessageCircle, 
  FileText, 
  Edit, 
  Download,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MemberProfileModalProps {
  open: boolean;
  onClose: () => void;
  resident: {
    id: string;
    name: string;
    flat: string;
    ownershipType: 'Owner' | 'Tenant';
    ownerSince: string;
    familySize: number;
    phone: string;
    email?: string;
    paymentStatus: 'Paid' | 'Overdue' | 'Partial';
    lastPayment?: string;
    dueAmount?: number;
    role?: string;
  };
}

const mockPaymentHistory = [
  { id: '1', date: '2025-01-01', amount: 3500, status: 'Paid', method: 'UPI', reference: 'TXN001' },
  { id: '2', date: '2024-12-01', amount: 3500, status: 'Paid', method: 'Bank Transfer', reference: 'TXN002' },
  { id: '3', date: '2024-11-01', amount: 3500, status: 'Paid', method: 'Cash', reference: 'TXN003' },
  { id: '4', date: '2024-10-01', amount: 3500, status: 'Paid', method: 'UPI', reference: 'TXN004' },
];

const mockRequests = [
  { id: '1', type: 'Maintenance', title: 'Plumbing issue in kitchen', date: '2025-01-15', status: 'Open' },
  { id: '2', type: 'Complaint', title: 'Noise complaint from neighbor', date: '2025-01-10', status: 'Resolved' },
  { id: '3', type: 'Request', title: 'Parking space allocation', date: '2025-01-05', status: 'Pending' },
];

const mockCommunications = [
  { id: '1', type: 'Email', subject: 'Monthly maintenance reminder', date: '2025-01-15', status: 'Sent' },
  { id: '2', type: 'SMS', subject: 'Payment due notification', date: '2025-01-10', status: 'Delivered' },
  { id: '3', type: 'WhatsApp', subject: 'Society event invitation', date: '2025-01-05', status: 'Read' },
];

const mockFamilyMembers = [
  { name: 'Priya Kumar', relationship: 'Spouse', age: 35 },
  { name: 'Aarav Kumar', relationship: 'Son', age: 12 },
  { name: 'Ananya Kumar', relationship: 'Daughter', age: 8 },
];

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ open, onClose, resident }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resident Profile</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Profile Section */}
          <div className="w-80 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getInitials(resident.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-lg flex items-center justify-center gap-2">
                      {resident.name}
                      {resident.role && (
                        <Badge variant="secondary" className="text-xs">
                          {resident.role}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Flat {resident.flat}
                    </p>
                  </div>

                  <Badge className={getStatusColor(resident.paymentStatus)}>
                    {resident.paymentStatus}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{resident.phone}</span>
                  </div>
                  {resident.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{resident.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{resident.ownershipType} since {resident.ownerSince}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{resident.familySize} family members</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Info
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="communications">Communications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Family Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockFamilyMembers.map((member, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.relationship}</p>
                          </div>
                          <Badge variant="outline">{member.age} years</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm">Payment received</p>
                          <p className="text-xs text-muted-foreground">Jan 1, 2025</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-sm">Message sent</p>
                          <p className="text-xs text-muted-foreground">Dec 28, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-sm">Maintenance request submitted</p>
                          <p className="text-xs text-muted-foreground">Dec 25, 2024</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockPaymentHistory.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">
                                {payment.date} • {payment.method}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {payment.reference}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{request.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {request.type} • {request.date}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Communication History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCommunications.map((comm) => (
                        <div key={comm.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <MessageCircle className="h-5 w-5 text-purple-600" />
                            <div>
                              <p className="font-medium">{comm.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {comm.type} • {comm.date}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
