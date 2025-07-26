
import React, { useState, useEffect } from 'react';
import { EnhancedAppShell } from '@/components/layout/EnhancedAppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Check, 
  CreditCard, 
  Wrench, 
  Megaphone, 
  Star, 
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  IndianRupee,
  FileText,
  Users
} from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  type: 'payment' | 'maintenance' | 'announcement' | 'member';
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
    category?: string;
  };
  isUnread: boolean;
}

const ActivityLog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extended activity data for the full log
  const allActivities: Activity[] = [
    {
      id: '1',
      type: 'payment',
      title: 'Electricity bill approved',
      amount: '₹18,500',
      timestamp: '2 hours ago',
      status: 'completed',
      icon: IndianRupee,
      details: {
        approvedBy: 'Rajesh Kumar',
        paymentMethod: 'Bank Transfer',
        reference: 'ELE001',
        category: 'Utilities'
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
      icon: IndianRupee,
      details: {
        paymentMethod: 'Bank Transfer',
        reference: 'TXN123456',
        category: 'Security'
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
        rating: 4.5,
        category: 'Plumbing'
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
        preview: 'Water supply interruption scheduled for maintenance on Sunday...',
        category: 'Maintenance Notice'
      },
      isUnread: false,
    },
    {
      id: '5',
      type: 'payment',
      title: 'Plumber payment pending',
      amount: '₹3,200',
      timestamp: '3 days ago',
      status: 'pending',
      icon: IndianRupee,
      details: {
        reference: 'APP005',
        category: 'Maintenance'
      },
      isUnread: false,
    },
    {
      id: '6',
      type: 'member',
      title: 'New member registration',
      description: 'Priya Sharma - Flat C-305',
      timestamp: '4 days ago',
      status: 'info',
      icon: Users,
      details: {
        category: 'Member Management'
      },
      isUnread: false,
    },
    {
      id: '7',
      type: 'payment',
      title: 'Monthly maintenance fee collected',
      amount: '₹125,000',
      timestamp: '1 week ago',
      status: 'completed',
      icon: IndianRupee,
      details: {
        paymentMethod: 'Multiple',
        reference: 'MAINT001',
        category: 'Maintenance'
      },
      isUnread: false,
    },
    {
      id: '8',
      type: 'maintenance',
      title: 'Elevator service completed',
      description: 'Tower A - Lift #2',
      timestamp: '1 week ago',
      status: 'completed',
      icon: Wrench,
      details: {
        completedBy: 'TechCare Services',
        rating: 5,
        category: 'Elevator'
      },
      isUnread: false,
    },
    {
      id: '9',
      type: 'announcement',
      title: 'Society AGM scheduled',
      description: 'Annual General Meeting notification',
      timestamp: '2 weeks ago',
      status: 'info',
      icon: Megaphone,
      details: {
        preview: 'Annual General Meeting scheduled for next month...',
        category: 'Meeting Notice'
      },
      isUnread: false,
    },
    {
      id: '10',
      type: 'payment',
      title: 'Internet bill approved',
      amount: '₹12,500',
      timestamp: '2 weeks ago',
      status: 'completed',
      icon: IndianRupee,
      details: {
        approvedBy: 'Rajesh Kumar',
        paymentMethod: 'Bank Transfer',
        reference: 'NET001',
        category: 'Utilities'
      },
      isUnread: false,
    },
  ];

  const filteredActivities = allActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const visibleActivities = filteredActivities.slice(0, visibleCount);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 20);
      setIsLoading(false);
    }, 500);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting activity log...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'info': return 'bg-info/10 text-info border-info/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment': return 'text-green-600';
      case 'maintenance': return 'text-blue-600';
      case 'announcement': return 'text-purple-600';
      case 'member': return 'text-orange-600';
      default: return 'text-muted-foreground';
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

  const handleActivityClick = (activity: Activity) => {
    console.log('View details for:', activity);
    // Implement detailed view modal or navigation
  };

  const handleViewReceipt = (activity: Activity) => {
    console.log('View receipt for:', activity);
    // Implement receipt view
  };

  const handleViewDetails = (activity: Activity) => {
    console.log('View details for:', activity);
    // Implement details view
  };

  const handleViewAnnouncements = () => {
    navigate('/announcements');
  };

  return (
    <EnhancedAppShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Activity Log</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Activity Log</h1>
            <p className="text-muted-foreground">
              Complete log of society activities
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background min-w-[150px]"
              >
                <option value="all">All Types</option>
                <option value="payment">Financial</option>
                <option value="maintenance">Maintenance</option>
                <option value="announcement">Announcements</option>
                <option value="member">Member Actions</option>
              </select>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background min-w-[130px]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <Badge variant="secondary">{filteredActivities.length} activities</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visibleActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="relative">
                    <div className={`p-3 rounded-full ${getStatusColor(activity.status)} border`}>
                      <activity.icon className={`h-5 w-5 ${getTypeColor(activity.type)}`} />
                    </div>
                    {activity.isUnread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <p className={`font-medium ${activity.isUnread ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {activity.title}
                        </p>
                        {activity.amount && (
                          <p className="text-lg font-mono font-semibold text-primary mt-1">
                            {activity.amount}
                          </p>
                        )}
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                        
                        {/* Activity Details */}
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          {activity.details.approvedBy && (
                            <div>Approved by: {activity.details.approvedBy}</div>
                          )}
                          {activity.details.completedBy && (
                            <div>Completed by: {activity.details.completedBy}</div>
                          )}
                          {activity.details.paymentMethod && (
                            <div>Payment: {activity.details.paymentMethod}</div>
                          )}
                          {activity.details.reference && (
                            <div>Ref: {activity.details.reference}</div>
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
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {activity.type === 'payment' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReceipt(activity);
                            }}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View Receipt
                          </Button>
                        )}
                        {activity.type === 'maintenance' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(activity);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        )}
                        {activity.type === 'announcement' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAnnouncements();
                            }}
                          >
                            <Megaphone className="h-3 w-3 mr-1" />
                            View Announcements
                          </Button>
                        )}
                        {activity.isUnread && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More */}
            {filteredActivities.length > visibleCount && (
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {isLoading ? 'Loading...' : `Load More (${filteredActivities.length - visibleCount} remaining)`}
                </Button>
              </div>
            )}
            
            {/* Empty State */}
            {filteredActivities.length === 0 && (
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  No activities found matching your filters.
                </div>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setDateFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </EnhancedAppShell>
  );
};

export default ActivityLog;
