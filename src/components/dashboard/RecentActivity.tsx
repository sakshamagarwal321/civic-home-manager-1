
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  CreditCard, 
  Wrench, 
  Megaphone, 
  Star, 
  Eye, 
  Filter,
  RefreshCw,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'announcement' | 'approval';
  title: string;
  description?: string;
  amount?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'info';
  icon: React.ComponentType<{ className?: string }>;
  details: {
    approvedBy?: string;
    paymentMethod?: string;
    reference?: string;
    completedBy?: string;
    rating?: number;
    preview?: string;
  };
  isUnread: boolean;
}

const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'payment',
    title: 'Electricity bill approved',
    amount: '₹18,500',
    timestamp: '2 hours ago',
    status: 'completed',
    icon: Check,
    details: {
      approvedBy: 'Rajesh Kumar',
      paymentMethod: 'Bank Transfer',
      reference: 'ELE001'
    },
    isUnread: true,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Security payment processed',
    amount: '₹25,000',
    timestamp: '5 hours ago',
    status: 'completed',
    icon: CreditCard,
    details: {
      paymentMethod: 'Bank Transfer',
      reference: 'TXN123456'
    },
    isUnread: true,
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Maintenance request #234 completed',
    description: 'Plumbing issue - Flat B-204',
    timestamp: '1 day ago',
    status: 'completed',
    icon: Wrench,
    details: {
      completedBy: 'Ravi (Plumber)',
      rating: 4.5
    },
    isUnread: false,
  },
  {
    id: '4',
    type: 'announcement',
    title: '3 new announcements posted',
    description: 'Water supply interruption notice',
    timestamp: '2 days ago',
    status: 'info',
    icon: Megaphone,
    details: {
      preview: 'Water supply interruption scheduled for maintenance...'
    },
    isUnread: false,
  },
  {
    id: '5',
    type: 'approval',
    title: 'Plumber payment pending',
    amount: '₹3,200',
    timestamp: '3 days ago',
    status: 'pending',
    icon: RefreshCw,
    details: {
      reference: 'APP005'
    },
    isUnread: false,
  },
];

export const RecentActivity: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [visibleCount, setVisibleCount] = useState(5);
  const [filter, setFilter] = useState<'all' | 'payment' | 'maintenance' | 'announcement'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity (randomly)
      if (Math.random() > 0.7) {
        const newActivity: Activity = {
          id: `new-${Date.now()}`,
          type: 'payment',
          title: 'New payment received',
          amount: `₹${Math.floor(Math.random() * 50000) + 10000}`,
          timestamp: 'Just now',
          status: 'completed',
          icon: Check,
          details: {
            paymentMethod: 'UPI',
            reference: `TXN${Math.floor(Math.random() * 900000) + 100000}`
          },
          isUnread: true,
        };
        setActivities(prev => [newActivity, ...prev]);
      }
    }, 30000); // 30 second refresh

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.type === filter
  );

  const visibleActivities = filteredActivities.slice(0, visibleCount);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const markAsRead = (id: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === id ? { ...activity, isUnread: false } : activity
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'info': return 'bg-info/10 text-info';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <div className="flex items-center gap-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="all">All</option>
              <option value="payment">Financial</option>
              <option value="maintenance">Maintenance</option>
              <option value="announcement">Announcements</option>
            </select>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => markAsRead(activity.id)}
            >
              <div className="relative">
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                {activity.isUnread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm font-medium ${activity.isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {activity.title}
                    </p>
                    {activity.amount && (
                      <p className="text-sm font-mono font-semibold text-primary">
                        {activity.amount}
                      </p>
                    )}
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Eye className="h-3 w-3" />
                    </Button>
                    {activity.isUnread && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </div>
                </div>
                
                {/* Activity Details */}
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  {activity.details.approvedBy && (
                    <div>Approved by: {activity.details.approvedBy}</div>
                  )}
                  {activity.details.paymentMethod && (
                    <div>Payment: {activity.details.paymentMethod}</div>
                  )}
                  {activity.details.reference && (
                    <div>Ref: {activity.details.reference}</div>
                  )}
                  {activity.details.completedBy && (
                    <div>Completed by: {activity.details.completedBy}</div>
                  )}
                  {activity.details.rating && (
                    <div className="flex items-center gap-1">
                      <span>Rating:</span>
                      <div className="flex items-center gap-0.5">
                        {renderStars(activity.details.rating)}
                      </div>
                      <span>({activity.details.rating}/5)</span>
                    </div>
                  )}
                  {activity.details.preview && (
                    <div className="text-xs italic">"{activity.details.preview}"</div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {filteredActivities.length > visibleCount && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLoadMore}
              className="gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Load More
            </Button>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => navigate('/activity-log')}
          >
            <ExternalLink className="h-4 w-4" />
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
