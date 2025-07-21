import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, IndianRupee } from 'lucide-react';

const pendingApprovals = [
  {
    id: 1,
    title: 'Plumber Payment',
    description: 'Emergency repair - Flat A-301',
    amount: 3200,
    category: 'Maintenance',
    submittedBy: 'Maintenance Staff',
    submitDate: '2025-01-20',
    priority: 'high' as const,
  },
  {
    id: 2,
    title: 'Garden Maintenance',
    description: 'Monthly landscaping service',
    amount: 8500,
    category: 'Landscaping',
    submittedBy: 'Green Thumb Ltd',
    submitDate: '2025-01-19',
    priority: 'medium' as const,
  },
  {
    id: 3,
    title: 'Security Equipment',
    description: 'CCTV camera replacement',
    amount: 15600,
    category: 'Security',
    submittedBy: 'SecureTech Solutions',
    submitDate: '2025-01-18',
    priority: 'medium' as const,
  },
  {
    id: 4,
    title: 'Parking Slot Allocation',
    description: 'New resident request - Flat C-105',
    amount: 0,
    category: 'Administration',
    submittedBy: 'Priya Sharma',
    submitDate: '2025-01-17',
    priority: 'low' as const,
  },
  {
    id: 5,
    title: 'Elevator Maintenance',
    description: 'Quarterly service contract',
    amount: 12000,
    category: 'Maintenance',
    submittedBy: 'Lift Tech Services',
    submitDate: '2025-01-16',
    priority: 'high' as const,
  },
];

export const PendingApprovals: React.FC = () => {
  const totalAmount = pendingApprovals
    .filter(item => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">
            Pending Approvals ({pendingApprovals.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total Amount: <span className="font-mono font-semibold">₹{totalAmount.toLocaleString()}</span>
          </p>
        </div>
        <Clock className="h-5 w-5 text-warning" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingApprovals.map((approval) => (
            <div key={approval.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm">{approval.title}</h4>
                    <Badge
                      variant={
                        approval.priority === 'high'
                          ? 'destructive'
                          : approval.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {approval.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {approval.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>Category: {approval.category}</span>
                    <span>By: {approval.submittedBy}</span>
                    <span>Date: {approval.submitDate}</span>
                  </div>
                </div>
                {approval.amount > 0 && (
                  <div className="text-right">
                    <div className="flex items-center text-primary font-mono font-semibold">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {approval.amount.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="default" className="flex-1">
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};