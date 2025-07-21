import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, AlertCircle, FileText } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'payment',
    title: 'Electricity bill approved',
    amount: '₹18,500',
    time: '2 hours ago',
    status: 'completed',
    icon: Check,
  },
  {
    id: 2,
    type: 'payment',
    title: 'Security payment processed',
    amount: '₹25,000',
    time: '5 hours ago',
    status: 'completed',
    icon: Check,
  },
  {
    id: 3,
    type: 'maintenance',
    title: 'Maintenance request #234 completed',
    description: 'Plumbing issue - Flat B-204',
    time: '1 day ago',
    status: 'completed',
    icon: Check,
  },
  {
    id: 4,
    type: 'announcement',
    title: '3 new announcements posted',
    description: 'Water supply interruption notice',
    time: '2 days ago',
    status: 'info',
    icon: FileText,
  },
  {
    id: 5,
    type: 'approval',
    title: 'Plumber payment pending',
    amount: '₹3,200',
    time: '3 days ago',
    status: 'pending',
    icon: Clock,
  },
];

export const RecentActivity: React.FC = () => {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-full ${
                  activity.status === 'completed'
                    ? 'bg-success/10 text-success'
                    : activity.status === 'pending'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-info/10 text-info'
                }`}
              >
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                {activity.amount && (
                  <p className="text-sm font-mono font-semibold text-primary">
                    {activity.amount}
                  </p>
                )}
                {activity.description && (
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};