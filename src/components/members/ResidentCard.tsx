
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Users, Calendar, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ResidentCardProps {
  resident: {
    id: string;
    name: string;
    flat: string;
    ownershipType: 'Owner' | 'Tenant';
    ownerSince: string;
    familySize: number;
    phone: string;
    paymentStatus: 'Paid' | 'Overdue' | 'Partial';
    lastPayment?: string;
    dueAmount?: number;
    role?: string;
  };
  onViewProfile: (id: string) => void;
  onSendMessage: (id: string) => void;
  onPaymentHistory: (id: string) => void;
  onSendReminder: (id: string) => void;
}

export const ResidentCard: React.FC<ResidentCardProps> = ({
  resident,
  onViewProfile,
  onSendMessage,
  onPaymentHistory,
  onSendReminder,
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(resident.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                {resident.name}
                {resident.role && (
                  <Badge variant="secondary" className="text-xs">
                    {resident.role}
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Flat: {resident.flat}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(resident.paymentStatus)}>
            {resident.paymentStatus}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{resident.ownershipType} since:</span>
            <span>{resident.ownerSince}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Family Size:
            </span>
            <span>{resident.familySize} members</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Phone:
            </span>
            <span>{resident.phone}</span>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          {resident.paymentStatus === 'Paid' && resident.lastPayment && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last Payment:
              </span>
              <span className="text-green-600">{resident.lastPayment}</span>
            </div>
          )}
          {resident.paymentStatus === 'Overdue' && resident.dueAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Due Amount:
              </span>
              <span className="text-red-600 font-medium">₹{resident.dueAmount.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(resident.id)}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSendMessage(resident.id)}
            className="flex-1"
          >
            Send Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPaymentHistory(resident.id)}>
                Payment History
              </DropdownMenuItem>
              {resident.paymentStatus === 'Overdue' && (
                <DropdownMenuItem onClick={() => onSendReminder(resident.id)}>
                  Send Reminder
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
